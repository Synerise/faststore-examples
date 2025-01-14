import {FilterFacetRange} from "@faststore/ui";

import {useFormattedPrice} from "src/sdk/product/useFormattedPrice";
import {SelectedFacetsType} from "../SyneriseProductGallery.types";

type FilterFacetRangeFilterProps = {
    facetName: string;
    allFacets: Record<string, Record<string, number>>,
    selectedFacets: SelectedFacetsType
    onFacetChange: (facetName: string, facetValue: { min: number, max: number }) => void,
}

function ProductGalleryRangeFilter({
    facetName,
    allFacets,
    selectedFacets,
    onFacetChange
}: FilterFacetRangeFilterProps) {
    const facetAllValues = allFacets[facetName];
    const absoluteMin = facetAllValues ? facetAllValues.min : 0;
    const absoluteMax = facetAllValues ? facetAllValues.max : 0;

    const rangeFacet = selectedFacets.range[facetName]

    return <FilterFacetRange
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
        onFacetChange={({key, value}) => {
            const [min, max] = value.split('-to-')
            onFacetChange(key, {min: Number(min), max: Number(max)})
        }}
    />
}


export default ProductGalleryRangeFilter;
