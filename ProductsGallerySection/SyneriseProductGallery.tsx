import {useEffect, useMemo, useState} from "react";
import {useSearchParams} from "next/navigation";
import {PLPContext, SearchPageContext, usePage} from "@faststore/core";

import {isPLP, isSearchPage} from "src/sdk/overrides/PageProvider";
import Section from "src/components/sections/Section";
import EmptyGallery from "src/components/sections/ProductGallery/EmptyGallery";

import {SearchProvider, SyneriseSearchStateProps, useSearchContext} from "./SearchProvider";
import {ProductGallery} from "./ProductGallery";
import {prepareCustomFilteredFacets, prepareFilters, getSelectedFacets, getSorting} from "./utils";
import {useSearch} from "./hooks";
import {Filter, SortOption} from "./SyneriseProductGallery.types";

import styles from "./SyneriseProductGallery.module.scss";

export type SyneriseProductGalleryProps = {
    indexId: string,
    trackerKey: string,
    apiHost: string,
    filters: Filter[],
    sort: SortOption[],
    itemsPerPage: number,
}

export const SyneriseProductGallery = ({itemsPerPage, sort, indexId, apiHost, trackerKey, filters}: SyneriseProductGalleryProps) => {
    const context = usePage();
    const searchParams = useSearchParams();

    const initialState: SyneriseSearchStateProps = useMemo(() => {
        const query = searchParams.get("q") ||
            // @ts-ignore
            context?.data?.searchTerm || "";
        const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : itemsPerPage;
        const correlationId = searchParams.get("correlationId") || undefined;
        const pageParam = searchParams.get("page") || 0;
        const page = Number(pageParam);
        const selectedFacets = getSelectedFacets();
        const selectedSort = searchParams.get("sort") || undefined;

        let sorting = sort.find(item => item.key === selectedSort)
            || sort.find(item => item.isDefault)
            || sort[0]
            || undefined;

        return {
            query,
            page,
            limit,
            correlationId,
            selectedFacets,
            sortKey: sorting?.key,
            sort,
            indexId,
            apiHost,
            trackerKey,
            filters,
            itemsPerPage
        };
    }, [searchParams, context, itemsPerPage, apiHost, trackerKey, filters, sort]);

    const onChangeFunction = async (url: URL) => {
        window.history.pushState(null, "", url)
        return true;
    }

    return (
        <div className={styles.productGallery}>
            <SearchProvider initialState={initialState} onChange={onChangeFunction}>
                <SyneriseProductGalleryContent />
            </SearchProvider>
        </div>
    )
}

const SyneriseProductGalleryContent = () => {
    const context = usePage<SearchPageContext | PLPContext>();
    const [title, searchTerm] = isSearchPage(context)
        ? [context?.data?.title, context?.data?.searchTerm]
        : isPLP(context)
            ? [context?.data?.collection?.seo?.title]
            : ['']

    const [isLoading, setIsLoading] = useState(false);
    const { state, setCorrelationId } = useSearchContext()

    const sorting = state.sortKey ? getSorting(state.sortKey, state.sort) : undefined

    const {data: queryResponse, error} = useSearch({
        indexId: state.indexId,
        apiHost: state.apiHost,
        trackerKey: state.trackerKey,
        query: state.query,
        page: state.page + 1,
        limit: state.limit,
        correlationId: state.correlationId ? state.correlationId : undefined,
        caseSensitiveFacetValues: true,
        filters: prepareFilters(state.selectedFacets),
        customFilteredFacets: prepareCustomFilteredFacets(state.selectedFacets),
        sortBy: sorting?.sortBy,
        ordering: sorting?.ordering,
        includeFacets: "all",
        facets: ["*"]
    })

    useEffect(() => {
        if(!queryResponse && !state.correlationId && !error){
            setIsLoading(true)
        }

        if(queryResponse?.extras?.correlationId){
            setCorrelationId(queryResponse.extras.correlationId)
            setIsLoading(false)
        }
    }, [queryResponse]);

    return queryResponse?.meta?.totalCount === 0 ? (
        <Section className={`${styles.section} section-product-gallery`}>
            <section data-testid="product-gallery" data-fs-product-listing>
                <EmptyGallery />
            </section>
        </Section>
        ) : (
        <ProductGallery
            title={title}
            searchTerm={searchTerm}
            searchTermLabel={"Showing results for:"}
            isLoading={isLoading}
            allFacets={queryResponse?.extras?.allFacets}
            filteredFacets={queryResponse?.extras?.filteredFacets}
            customFilteredFacets={queryResponse?.extras?.customFilteredFacets}
            totalCount={queryResponse?.meta?.totalCount}
            totalPages={queryResponse?.meta?.totalPages}
            totalCountLabel={"Results"}
        />
    )
}
