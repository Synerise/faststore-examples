import {useCallback, useEffect, useMemo, useState} from "react";
import {Filter, FilterFacets} from "@faststore/components";
import {FilterFacetBoolean, FilterFacetBooleanItem} from "@faststore/ui";
import {useSearchContext} from "@synerise/faststore-sdk"

import {useProductGallerySectionContext} from "./ProductGallery";
import {ProductGalleryRangeFilter} from "./ProductGalleryRangeFilter";

type FiltersProps = {
    testId: string;
    allFacets: Record<string, Record<string, number>>,
    filteredFacets: Record<string, Record<string, number>>,
    customFilteredFacets?: Record<string, Record<string, number>>,
}

const mergeFacets = (
    customFilteredFacets: Record<string, any>,
    filteredFacets: Record<string, any>
): Record<string, any> => {
    return Object.entries(filteredFacets).reduce((result, [key, baseValue]) => {
        if (key in customFilteredFacets) {
            const customValue = customFilteredFacets[key];
            if (typeof baseValue === 'object' && typeof customValue === 'object') {
                result[key] = {...baseValue, ...customValue};
            } else {
                result[key] = customValue;
            }
        } else {
            result[key] = baseValue;
        }
        return result;
    }, {...customFilteredFacets});
};

const renderFacetValues = (facetValues: Record<string, number>, testId: string, facetName: string) => {
    const {state: {selectedFacets}, toggleTextFacet} = useSearchContext();

    const isFacetSelected = useCallback((facetName: string, facetValue: string) => {
        return selectedFacets.text[facetName] && selectedFacets.text[facetName].includes(facetValue);
    }, [selectedFacets])

    return Object.keys(facetValues).map((facet) => {
        const itemsCount = facetValues[facet];
        return (
            <FilterFacetBooleanItem
                key={`${testId}-${facet}`}
                id={`${testId}-${facet}`}
                testId={testId}
                label={facet}
                selected={isFacetSelected(facetName, facet)}
                value={facet}
                facetKey={facetName}
                quantity={itemsCount}
                onFacetChange={({key, value}) => toggleTextFacet(key, value)}
            />
        );
    });
}

const renderFilterFacets = ({
    label,
    facetName,
    facetType,
}: {
    label: string;
    facetName: string;
    facetType: string;
}, index: number, facets: Record<string, any>, testId: string, allFacets: any, toggleIndices: (index: number) => void) => {
    const {state: {selectedFacets}} = useSearchContext();
    const facetValues = facets[facetName];

    useEffect(() => {
        if (facetValues && Object.keys(facetValues).length !== 0 &&
            (selectedFacets.text[facetName] || selectedFacets.range[facetName])
        ) {
            toggleIndices(index)
        }
    }, []);

    if (!facetValues || Object.keys(facetValues).length === 0) return null;

    return (
        <FilterFacets
            key={`${testId}-${facetName}-${index}`}
            testId={testId}
            index={index}
            type={facetType}
            label={label}
        >
            {facetType === "Text" && (
                <FilterFacetBoolean>
                    {renderFacetValues(facetValues, testId, facetName)}
                </FilterFacetBoolean>
            )}
            {facetType === "Range" && (
                <ProductGalleryRangeFilter
                    facetName={facetName}
                    allFacets={allFacets}
                />
            )}
        </FilterFacets>
    );
};

const ProductGalleryFilters = ({
  testId,
  customFilteredFacets,
  filteredFacets,
  allFacets,
}: FiltersProps) => {
    const [indicesExpanded, setIndicesExpanded] = useState<number[]>([])
    const {filters} = useProductGallerySectionContext()

    const facets = useMemo(() => {
        return mergeFacets(customFilteredFacets || {}, filteredFacets)
    }, [filteredFacets, customFilteredFacets])

    const toggleIndices = (index: number) => {
        setIndicesExpanded((prevIndices) =>
            prevIndices.includes(index)
                ? prevIndices.filter((item) => item !== index)
                : [...prevIndices, index]
        );
    };

    const filtersRendered = filters.map((filter, index) => {
        return renderFilterFacets(filter, index, facets, testId, allFacets, toggleIndices)
    });

    return (
        <Filter
            testId={`desktop-${testId}`}
            title={"Filters"}
            indicesExpanded={new Set(indicesExpanded)}
            onAccordionChange={toggleIndices}
        >
            <>
                { filtersRendered }
            </>
        </Filter>
    );
}

export default ProductGalleryFilters;
