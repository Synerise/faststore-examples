import {FilterFacetRange} from "@faststore/ui";
import {useSearchContext} from "@synerise/faststore-sdk";

//@ts-ignore
import {useFormattedPrice} from "src/sdk/product/useFormattedPrice";


type FilterFacetRangeFilterProps = {
    facetName: string;
    allFacets: Record<string, Record<string, number>>
}

export const ProductGalleryRangeFilter = ({facetName, allFacets}: FilterFacetRangeFilterProps) => {
    const {state: { selectedFacets }, setRangeFacet} = useSearchContext();

    const facetAllValues = allFacets[facetName];
    const absoluteMin = facetAllValues ? facetAllValues.min : 0;
    const absoluteMax = facetAllValues ? facetAllValues.max : 0;

    const rangeFacet = selectedFacets.range[facetName]

    return facetAllValues ? <FilterFacetRange
        facetKey={facetName}
        min={{
            selected: rangeFacet ? rangeFacet.min : absoluteMin,
            absolute: absoluteMin
        }}
        max={{
            selected: rangeFacet ? rangeFacet.max : absoluteMax,
            absolute: absoluteMax
        }}
        formatter={useFormattedPrice}
        onFacetChange={(facet) => {
            const [min, max] = facet.value.split('-to-')
            setRangeFacet(facet.key, {
                min: Number(min),
                max: Number(max)
            })
        }}
    /> : null
}
