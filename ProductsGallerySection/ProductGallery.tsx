import {createContext, useContext, useEffect, useMemo} from "react";
import {useSearchParams} from "next/navigation";
import {SearchPageContext, usePage} from '@faststore/core';

import {
    prepareCustomFilteredFacets,
    prepareFilters,
    SearchProvider,
    SyneriseSearchStateProps,
    useSearchContext,
    useSearchQuery
} from '@synerise/faststore-sdk'

import {ProductGallery} from "./ui/ProductGallery/ProductGallery";
import {ProductGallerySectionProps} from "./ProductGallery.types";
import styles from "./ProductGallery.module.scss";

const ProductGallerySectionContext = createContext<ProductGallerySectionProps | undefined>(undefined)

export const useProductGallerySectionContext = (): ProductGallerySectionProps => {
    const context = useContext(ProductGallerySectionContext);
    if (!context) {
        throw new Error("useProductGallerySectionContext must be used within a ProductGallerySection");
    }
    return context;
};

const getSelectedFacets = () => {
    const url = new URL(window.location.href);

    const textFacets = url.searchParams.get("facets");
    const rangeFacets = url.searchParams.get("rangeFacets");

    const textFacetsNames = textFacets ? textFacets.split(",") : []
    const rangeFacetsNames = rangeFacets ? rangeFacets.split(",") : []


    const facets: {
        text: Record<string, string[]>
        range: Record<string, { min: number, max: number }>
    } = {
        range: {},
        text: {}
    }

    textFacetsNames.forEach((facetName) => {
        facets.text[facetName] = url.searchParams.getAll(facetName)
    })

    rangeFacetsNames.forEach((facetName) => {
        const rangeFacetValue = url.searchParams.get(facetName);
        if (rangeFacetValue) {
            const [min, max] = rangeFacetValue.split(";");
            if (min && max) {
                facets.range[facetName] = {
                    min: Number(min),
                    max: Number(max),
                }
            }
        }

    })

    return facets;
}

export const ProductGallerySection = ({filters, sort, itemsPerPage}: ProductGallerySectionProps) => {
    const context = usePage<SearchPageContext>()
    const searchParams = useSearchParams()
    const initialState = useMemo((): SyneriseSearchStateProps => {
        const query = searchParams.get("q") || context?.data?.searchTerm || "";
        const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : itemsPerPage;
        const correlationId = searchParams.get("correlationId") || undefined;
        const pageParam = searchParams.get("page") || 1;
        const page = pageParam === "0" ? 1 : Number(pageParam);
        const selectedFacets = getSelectedFacets();

        return {
            query,
            page,
            limit,
            correlationId,
            selectedFacets
        };
    }, [searchParams, context, itemsPerPage]);

    const onChangeFunction = async (url: URL) => {
        window.history.pushState(null, "", url)
        return true;
    }

    return (
        <SearchProvider initialState={initialState} onChange={onChangeFunction}>
            <ProductGallerySectionContext.Provider value={{filters, sort, itemsPerPage}}>
                <ProductGallerySectionContent/>
            </ProductGallerySectionContext.Provider>
        </SearchProvider>
    )
}
const ProductGallerySectionContent = () => {
    const pageContext = usePage<SearchPageContext>()
    const {state, setCorrelationId} = useSearchContext();

    const {data, error} = useSearchQuery({
        query: state.query || "",
        page: state.page,
        limit: state.limit,
        correlationId: state.correlationId,
        caseSensitiveFacetValues: true,
        filters: prepareFilters(state.selectedFacets),
        customFilteredFacets: prepareCustomFilteredFacets(state.selectedFacets),
        sortBy: state.sort?.sortBy,
        ordering: state.sort?.ordering,
    })

    useEffect(() => {
        if (data?.syneriseAISearch.search.extras.correlationId) {
            setCorrelationId(data?.syneriseAISearch.search.extras.correlationId)
        }
    }, [data]);

    return <div className={styles.productGallery}>
        <ProductGallery
            title={pageContext?.data?.title}
            searchTerm={state.query}
            searchTermLabel={"Showing results for:"}
            allFacets={data?.syneriseAISearch.search.extras.allFacets}
            filteredFacets={data?.syneriseAISearch.search.extras.filteredFacets}
            customFilteredFacets={data?.syneriseAISearch.search.extras.customFilteredFacets}
            totalCount={data?.syneriseAISearch.search.meta.totalCount}
            totalPages={data?.syneriseAISearch.search.meta.totalPages}
            totalCountLabel={"Results"}
        />
    </div>
}
