import {useEffect} from "react";
import {useSearch} from "@faststore/sdk";
import {
    Button as UIButton,
    Icon as UIIcon,
    LinkButton as UILinkButton,
    Skeleton as UISkeleton,
    useUI
} from "@faststore/ui"

import FilterSkeleton from "src/components/skeletons/FilterSkeleton";
import ProductGridSkeleton from 'src/components/skeletons/ProductGridSkeleton'
import useScreenResize from "src/sdk/ui/useScreenResize";

import {useSearchPrefetch, usePagination} from "./hooks";
import {prepareUrl} from "./utils";
import {ProductGalleryFilters, ProductGalleryFiltersMobile} from "./ProductGalleryFilters";
import ProductGallerySort from "./ProductGallerySort";
import ProductGalleryPage from "./ProductGalleryPage";
import {useSearchContext} from "./SearchProvider";

type ProductGalleryProps = {
    isLoading: boolean
    title?: string
    searchTerm?: string
    totalCount?: number | null
    searchTermLabel?: string
    totalCountLabel?: string
    totalPages?: number | null
    allFacets?: Record<string, Record<string, number>>
    filteredFacets?: Record<string, Record<string, number>>
    customFilteredFacets?: Record<string, Record<string, number>>
}

export const ProductGallery = ({
   isLoading,
   searchTerm,
   searchTermLabel,
   totalCount,
   totalCountLabel,
   allFacets,
   filteredFacets,
   customFilteredFacets
}: ProductGalleryProps) => {
    const {pages, addNextPage, addPrevPage, resetInfiniteScroll} = useSearch();
    const {openFilter, filter: displayFilter} = useUI()
    const {state} = useSearchContext()
    const {next, prev} = usePagination(totalCount || 0, pages, state)
    const {isDesktop} = useScreenResize();

    useSearchPrefetch((prev && state.correlationId) ? prev.cursor : null)
    useSearchPrefetch((next && state.correlationId) ? next.cursor : null)

    useEffect(() => {
        resetInfiniteScroll(state.page)
    }, [state.selectedFacets, state.sortKey])

    const hasFacetsLoaded = Boolean(allFacets)

    return (
        <section data-testid="product-gallery" data-fs-product-listing>
            {searchTerm && (
                <header data-fs-product-listing-search-term data-fs-content="product-gallery">
                    <h1>{searchTermLabel} <span>{searchTerm}</span></h1>
                </header>
            )}
            <div data-fs-product-listing-content-grid data-fs-content="product-gallery">
                {isDesktop && (
                    <div data-fs-product-listing-filters>
                        <FilterSkeleton loading={isLoading || !allFacets}>
                            <div className="hidden-mobile">
                                <ProductGalleryFilters
                                    testId='fs-filter'
                                    filteredFacets={filteredFacets || {}}
                                    customFilteredFacets={customFilteredFacets || {}}
                                    allFacets={allFacets || {}}
                                />
                            </div>
                        </FilterSkeleton>
                    </div>
                )}
                {!isDesktop && displayFilter && (
                    <div data-fs-product-listing-filters>
                        <ProductGalleryFiltersMobile
                            allFacets={allFacets || {}}
                            filteredFacets={filteredFacets || {}}
                            customFilteredFacets={customFilteredFacets}
                        />
                    </div>
                )}
                <div data-fs-product-listing-results-count data-count={totalCount}>
                    <UISkeleton
                        data-fs-product-listing-results-count-skeleton
                        size={{ width: '100%', height: '1.5rem' }}
                        loading={isLoading || typeof totalCount === 'undefined'}
                    >
                        <h2 data-testid="total-product-count">
                            {totalCount} {totalCountLabel}
                        </h2>
                    </UISkeleton>
                </div>
                <div data-fs-product-listing-sort>
                    <UISkeleton
                        data-fs-product-listing-sort-skeleton
                        size={{ width: 'auto', height: '1.5rem' }}
                        loading={isLoading || !state.sort}
                    >
                        <ProductGallerySort options={state.sort} />
                    </UISkeleton>

                    <UISkeleton
                        data-fs-product-listing-filter-button-skeleton
                        size={{width: '6rem', height: '1.5rem'}}
                        loading={isLoading || !hasFacetsLoaded}
                    >
                        {hasFacetsLoaded && state.filters?.length > 0 && (
                            <UIButton
                                variant="tertiary"
                                data-testid="open-filter-button"
                                icon={
                                    <UIIcon
                                        width={16}
                                        height={16}
                                        name="FadersHorizontal"
                                    />
                                }
                                iconPosition="left"
                                onClick={openFilter}
                            >
                                Open Filters
                            </UIButton>
                        )}
                    </UISkeleton>
                </div>
                <div data-fs-product-listing-results>
                    {prev ? (
                        <div data-fs-product-listing-pagination="top">
                            <UILinkButton
                                testId="show-more"
                                rel="next"
                                variant="secondary"
                                onClick={(e) => {
                                    e.currentTarget.blur()
                                    e.preventDefault()
                                    addPrevPage()
                                }}
                                href={prepareUrl({...state, page: prev.cursor}).toString()}
                            >
                                Previous Page
                            </UILinkButton>
                        </div>
                    ) : undefined}
                    {!isLoading && state.correlationId ? pages.map((page) => (
                        <ProductGalleryPage page={page}/>
                    )) : (
                        <ProductGridSkeleton loading/>
                    )}
                    {next && (
                        <div data-fs-product-listing-pagination="bottom">
                            <UILinkButton
                                testId="show-more"
                                rel="next"
                                variant="secondary"
                                onClick={(e) => {
                                    e.currentTarget.blur()
                                    e.preventDefault()
                                    addNextPage()
                                }}
                                href={prepareUrl({...state, page: next.cursor}).toString()}
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
