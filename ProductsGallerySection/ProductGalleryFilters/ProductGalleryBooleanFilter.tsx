import {useCallback} from "react";
import dynamic from 'next/dynamic';

import type {FilterFacetBooleanItemProps as UIFilterFacetBooleanItemProps} from '@faststore/ui'
import {SelectedFacetsType} from "../SyneriseProductGallery.types";

const UIFilterFacetBoolean = dynamic<{ children: React.ReactNode }>(() =>
    /* webpackChunkName: "UIFilterFacetBoolean" */
    import('@faststore/ui').then((mod) => mod.FilterFacetBoolean)
)
const UIFilterFacetBooleanItem = dynamic<UIFilterFacetBooleanItemProps>(() =>
    /* webpackChunkName: "UIFilterFacetBooleanItem" */
    import('@faststore/ui').then((mod) => mod.FilterFacetBooleanItem)
)

export interface ProductGalleryBooleanFilterProps {
    facetName: string;
    facets: Record<string, Record<string, number>>
    testId: string
    selectedFacets: SelectedFacetsType
    onFacetChange: (key: string, value: string) => void
}

function ProductGalleryBooleanFilter({
    facetName,
    facets,
    testId,
    selectedFacets,
    onFacetChange
}: ProductGalleryBooleanFilterProps) {
    const facetValues = facets[facetName];

    const isFacetSelected = useCallback((facetName: string, facetValue: string) => {
        if (!selectedFacets.text[facetName]) {
            return false;
        }

        return selectedFacets.text[facetName].includes(facetValue);
    }, [selectedFacets])


    return (
        <UIFilterFacetBoolean key={`${testId}-${facetName}`}>
            {
                Object.keys(facetValues).map((facetValue) => (
                    <UIFilterFacetBooleanItem
                        key={`${testId}-${facetValue}`}
                        id={`${testId}-${facetValue}`}
                        testId={testId}
                        label={facetValue}
                        selected={isFacetSelected(facetName, facetValue)}
                        value={facetValue}
                        facetKey={facetName}
                        quantity={facetValues[facetValue]}
                        onFacetChange={({key, value}) => onFacetChange(key, value)}
                    />
                ))
            }
        </UIFilterFacetBoolean>
    )
}

export default ProductGalleryBooleanFilter;
