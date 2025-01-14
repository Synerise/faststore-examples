import {useEffect, useMemo, useState} from "react";
import {Filter, FilterFacets} from "@faststore/components";

import {useSearchContext} from "../SearchProvider";
import ProductGalleryRangeFilter from "./ProductGalleryRangeFilter";
import ProductGalleryBooleanFilter from "./ProductGalleryBooleanFilter";

type FiltersProps = {
    testId: string;
    allFacets: Record<string, Record<string, number>>,
    filteredFacets: Record<string, Record<string, number>>,
    customFilteredFacets?: Record<string, Record<string, number>>,
}

const ProductGalleryFilters = ({
    testId,
    customFilteredFacets,
    filteredFacets,
    allFacets,
}: FiltersProps) => {
    const [indicesExpanded, setIndicesExpanded] = useState<number[]>([])
    const {state: {filters, selectedFacets}, setSelectedFacets} = useSearchContext()

    const facets = useMemo(() => {
        return Object.entries(filteredFacets).reduce(
            (result, [key, baseValue]) => ({
                ...result,
                [key]: customFilteredFacets && key in customFilteredFacets
                    ? (typeof baseValue === 'object' && typeof customFilteredFacets[key] === 'object'
                        ? {...baseValue, ...customFilteredFacets[key]}
                        : customFilteredFacets[key])
                    : baseValue,
            }),
            {...customFilteredFacets || {}}
        );
    }, [filteredFacets, customFilteredFacets])

    const toggleIndices = (index: number) => {
        setIndicesExpanded((prevIndices) =>
            prevIndices.includes(index)
                ? prevIndices.filter((item) => item !== index)
                : [...prevIndices, index]
        );
    };

    useEffect(() => {
        const indexes: number[] = [];

        filters.forEach((filter, index) => {
            const facetValues = facets[filter.facetName];
            const textFacetValues = selectedFacets.text[filter.facetName];
            const rangeFacetValues = selectedFacets.range[filter.facetName];

            if (facetValues && Object.keys(facetValues).length > 0) {
                if ((textFacetValues?.length ?? 0) > 0 || rangeFacetValues) {
                    indexes.push(index);
                }
            }
        });

        setIndicesExpanded(indexes);
    }, [facets, filters]);

    const onBooleanFacetChange = (facetName: string, value: string) => setSelectedFacets({
        ...selectedFacets,
        text: {
            ...selectedFacets.text,
            [facetName]: selectedFacets.text[facetName]?.includes(value)
                ? selectedFacets.text[facetName].filter((v) => v !== value)
                : [...(selectedFacets.text[facetName] || []), value],
        },
    });
    const onRangeFacetChange = (facetName: string, facetValue: {
        min: number,
        max: number
    }) => setSelectedFacets({
        ...selectedFacets,
        range: {
            ...selectedFacets.range,
            [facetName]: facetValue,
        }
    });

    return (
        <Filter
            testId={`desktop-${testId}`}
            title={"Filters"}
            indicesExpanded={new Set(indicesExpanded)}
            onAccordionChange={toggleIndices}
        >
            {
                filters.filter(filter => facets[filter.facetName] && Object.keys(facets[filter.facetName]).length > 0).map((filter, index) => (
                    <FilterFacets
                        key={`${testId}-${filter.label}-${index}`}
                        testId={testId}
                        index={index}
                        type={filter.facetType}
                        label={filter.label}
                    >
                        {filter.facetType === "Text" && (
                            <ProductGalleryBooleanFilter
                                testId={testId || ""}
                                facetName={filter.facetName}
                                facets={facets}
                                selectedFacets={selectedFacets}
                                onFacetChange={onBooleanFacetChange}
                            />
                        )}
                        {filter.facetType === "Range" && (
                            <ProductGalleryRangeFilter
                                facetName={filter.facetName}
                                allFacets={allFacets}
                                selectedFacets={selectedFacets}
                                onFacetChange={onRangeFacetChange}
                            />
                        )}
                    </FilterFacets>
                ))
            }
        </Filter>
    );
}

export default ProductGalleryFilters
