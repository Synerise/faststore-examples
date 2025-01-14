import {useEffect, useMemo, useState} from "react";
import dynamic from 'next/dynamic';
import {
    FilterFacetsProps as UIFilterFacetsProps,
    FilterProps as UIFilterProps,
    FilterSliderProps as UIFilterSliderProps
} from '@faststore/ui'

import {useSearchContext} from "../SearchProvider";
import {SelectedFacetsType} from "../SyneriseProductGallery.types";

import ProductGalleryBooleanFilter from "./ProductGalleryBooleanFilter";
import ProductGalleryRangeFilter from "./ProductGalleryRangeFilter";

import styles from './ProductGalleryFiltersMobile.module.scss'

const UIFilter = dynamic<{ children: React.ReactNode } & UIFilterProps>(() =>
    /* webpackChunkName: "UIFilter" */
    import('@faststore/ui').then((mod) => mod.Filter)
)
const UIFilterSlider = dynamic<UIFilterSliderProps>(() =>
    /* webpackChunkName: "UIFilterSlider" */
    import('@faststore/ui').then((mod) => mod.FilterSlider)
)
const UIFilterFacets = dynamic<
    { children: React.ReactNode } & UIFilterFacetsProps
>(() =>
    /* webpackChunkName: "UIFilterFacets" */
    import('@faststore/ui').then((mod) => mod.FilterFacets)
)

export interface ProductGalleryFiltersMobileProps {
    testId?: string
    title?: string
    clearButtonLabel?: string
    allFacets: Record<string, Record<string, number>>,
    filteredFacets: Record<string, Record<string, number>>,
    customFilteredFacets?: Record<string, Record<string, number>>,
}

function ProductGalleryFiltersMobile({
    testId,
    title,
    clearButtonLabel,
    allFacets,
    filteredFacets,
    customFilteredFacets = {}
}: ProductGalleryFiltersMobileProps) {
    const {state: {selectedFacets, filters}, setSelectedFacets} = useSearchContext();
    const [selected, setSelected] = useState<SelectedFacetsType>(selectedFacets)
    const [indicesExpanded, setIndicesExpanded] = useState<number[]>([])

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

    const onBooleanFacetChange = (facetName: string, value: string) => setSelected((prevState) => ({
        ...prevState,
        text: {
            ...prevState.text,
            [facetName]: prevState.text[facetName]?.includes(value)
                ? prevState.text[facetName].filter((v) => v !== value)
                : [...(prevState.text[facetName] || []), value],
        },
    }));

    const onRangeFacetChange = (facetName: string, facetValue: {
        min: number,
        max: number
    }) => setSelected((prevState) => ({
        ...prevState,
        range: {
            ...prevState.range,
            [facetName]: facetValue
        },
    }))

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

    return (
        <UIFilterSlider
            overlayProps={{
                className: `section ${styles.section} section-filter-slider`,
            }}
            title={title}
            size="partial"
            direction="rightSide"
            clearBtnProps={{
                variant: 'secondary',
                onClick: () => setSelected({text: {}, range: {}}),
                children: clearButtonLabel ?? 'Clear All',
            }}
            applyBtnProps={{
                variant: 'primary',
                onClick: () => setSelectedFacets(selected),
                children: clearButtonLabel ?? 'Apply',
            }}
            onClose={() => {
            }}
        >
            <UIFilter
                testId={`mobile-${testId}`}
                indicesExpanded={new Set(indicesExpanded)}
                onAccordionChange={toggleIndices}
            >
                {
                    filters.filter(filter => facets[filter.facetName]).map((filter, index) => (
                        <UIFilterFacets
                            key={`${testId}-${filter.label}-${index}`}
                            testId={`mobile-${testId}`}
                            index={index}
                            type={filter.facetType}
                            label={filter.label}
                        >
                            {filter.facetType === "Text" && (
                                <ProductGalleryBooleanFilter
                                    testId={testId || ""}
                                    facetName={filter.facetName}
                                    facets={facets}
                                    selectedFacets={selected}
                                    onFacetChange={onBooleanFacetChange}
                                />
                            )}
                            {filter.facetType === "Range" && (
                                <ProductGalleryRangeFilter
                                    facetName={filter.facetName}
                                    allFacets={allFacets}
                                    selectedFacets={selected}
                                    onFacetChange={onRangeFacetChange}
                                />
                            )}
                        </UIFilterFacets>
                    ))
                }
            </UIFilter>
        </UIFilterSlider>
    )
}

export default ProductGalleryFiltersMobile;
