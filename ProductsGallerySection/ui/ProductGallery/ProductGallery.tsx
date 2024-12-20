import React, {useEffect} from "react";
import {useSearch} from "@faststore/sdk";
import {LinkButton as UILinkButton} from '@faststore/ui'
import {useSearchContext, prepareUrl} from "@synerise/faststore-sdk";

import FilterSkeleton from 'src/components/skeletons/FilterSkeleton'
import ProductGridSkeleton from 'src/components/skeletons/ProductGridSkeleton'

import {useProductGallerySectionContext} from "../../ProductGallery";
import ProductGalleryFilters from "./ProductGalleryFilters";
import ProductGalleryPage from "./ProductGalleryPage";
import ProductGallerySort from "./ProductGallerySort";
import {useSearchPrefetch} from "./useSearchPrefetch";

type ProductGalleryProps = {
    title?: string
    searchTerm?: string
    totalCount?: number
    searchTermLabel?: string
    totalCountLabel?: string
    totalPages?: number
    allFacets?: Record<string, Record<string, number>>
    filteredFacets?: Record<string, Record<string, number>>
    customFilteredFacets?: Record<string, Record<string, number>>
}

export const ProductGallery = ({
    searchTerm,
    searchTermLabel,
    totalCount,
    totalCountLabel,
    totalPages,
    allFacets,
    filteredFacets,
    customFilteredFacets
}: ProductGalleryProps) => {
    const {state} = useSearchContext()
    const {sort} = useProductGallerySectionContext()
    const { pages, addNextPage, addPrevPage, resetInfiniteScroll } = useSearch();

    const prev = pages[0] - 1;
    const next = Number(pages[pages.length - 1]) + 1;
    const isNext = next <= (totalPages || 0);

    useSearchPrefetch(prev)
    useSearchPrefetch(next)

    useEffect(() => {
        resetInfiniteScroll(state.page)
    }, [resetInfiniteScroll]);

    useEffect(() => {
        resetInfiniteScroll(state.page)
    }, [state.selectedFacets, state.sort])

    return (
        <section data-testid="product-gallery" data-fs-product-listing data-test-server>
            {searchTerm && (
                <header
                    data-fs-product-listing-search-term
                    data-fs-content="product-gallery"
                >
                    <h1>{searchTermLabel} <span>{searchTerm}</span></h1>
                </header>
            )}
            <div
                data-fs-product-listing-content-grid
                data-fs-content="product-gallery"
            >
                <div data-fs-product-listing-filters>
                    <FilterSkeleton loading={!allFacets}>
                        <ProductGalleryFilters
                            testId='fs-filter'
                            filteredFacets={filteredFacets || {}}
                            customFilteredFacets={customFilteredFacets || {}}
                            allFacets={allFacets || {}}
                        />
                    </FilterSkeleton>
                </div>
                <div data-fs-product-listing-results-count data-count={totalCount}>
                    {totalCount} {totalCountLabel}
                </div>
                <div data-fs-product-listing-sort>
                    {sort && <ProductGallerySort
                        options={sort}
                    />}
                </div>
                <div data-fs-product-listing-results>
                    {prev ? (
                        <div data-fs-product-listing-pagination="top">
                            <UILinkButton
                                testId="show-more"
                                rel="next"
                                variant="secondary"
                                //@ts-ignore
                                onClick={(e: MouseEvent<HTMLElement>) => {
                                    e.currentTarget.blur()
                                    e.preventDefault()
                                    addPrevPage()
                                }}
                                href={prepareUrl({...state, page: prev}).toString()}
                            >
                                Previous Page
                            </UILinkButton>
                        </div>
                    ) : undefined}
                    {state.correlationId ? pages.map((page) => (
                        <ProductGalleryPage page={page} />
                    )) : (
                        <ProductGridSkeleton loading/>
                    )}
                    {isNext && (
                        <div data-fs-product-listing-pagination="bottom">
                            <UILinkButton
                                testId="show-more"
                                rel="next"
                                variant="secondary"
                                //@ts-ignore
                                onClick={(e: MouseEvent<HTMLElement>) => {
                                    e.currentTarget.blur()
                                    e.preventDefault()
                                    addNextPage()
                                }}
                                href={prepareUrl({...state, page: next}).toString()}
                            >
                                Load more products
                            </UILinkButton>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
