import {ProductGrid as UIProductGrid, ProductGridItem as UIProductGridItem} from '@faststore/ui'
import {prepareCustomFilteredFacets, prepareFilters, useSearchContext, useSearchQuery} from "@synerise/faststore-sdk";

import ProductCard from "src/components/product/ProductCard"
import ProductGridSkeleton from 'src/components/skeletons/ProductGridSkeleton'
import Sentinel from 'src/sdk/search/Sentinel'

const ProductGalleryPage = ({page}: { page: number }) => {
    const aspectRatio = 1;
    const {state} = useSearchContext();

    const {data} = useSearchQuery({
        query: state.query || "",
        page: page,
        limit: state.limit,
        correlationId: state.correlationId,
        caseSensitiveFacetValues: true,
        filters: prepareFilters(state.selectedFacets),
        customFilteredFacets: prepareCustomFilteredFacets(state.selectedFacets),
        sortBy: state.sort?.sortBy,
        ordering: state.sort?.ordering,
    })

    const products = data?.syneriseAISearch.search?.data ?? []

    return (
        <>
            <Sentinel
                key={page}
                products={products.map(product => ({node: {...product}}))}
                page={page}
                pageSize={state.limit}
                title={"Test"}
            />
            <ProductGridSkeleton
                key={page}
                aspectRatio={aspectRatio}
                loading={!data?.syneriseAISearch.search?.data}
            >
                <UIProductGrid key={page}>
                    {products.map((product, idx) => (
                        <UIProductGridItem key={`${product.productID}`}>
                            <ProductCard
                                aspectRatio={aspectRatio}
                                imgProps={{
                                    width: 150,
                                    height: 150,
                                    sizes: '30vw',
                                    loading: idx === 0 ? 'eager' : 'lazy',
                                }}
                                bordered={true}
                                showDiscountBadge={true}
                                product={product}
                                index={state.limit * page + idx + 1}
                            />
                        </UIProductGridItem>
                    ))}
                </UIProductGrid>
            </ProductGridSkeleton>
        </>
    )
}

export default ProductGalleryPage
