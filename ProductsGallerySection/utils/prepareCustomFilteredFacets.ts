import {SelectedFacetsType} from "../SyneriseProductGallery.types";

const flattenFacets = (
    facets: Record<string, Record<string, any>>
): Record<string, any> => {
    return Object.entries(facets).reduce((flat, [_groupKey, group]) => {
        Object.entries(group).forEach(([key, values]) => {
            flat[key] = values;
        });
        return flat;
    }, {} as Record<string, any>);
};

const prepareCustomFilteredFacets = (selectedFacets: SelectedFacetsType): Record<string, string> => {
    const flattenedFacets = flattenFacets(selectedFacets);
    return Object.keys(flattenedFacets).reduce((result, currentKey) => {
        const otherKeys = Object.keys(flattenedFacets).filter(key => key !== currentKey);

        const conditions = otherKeys.map(key => {
            const value = flattenedFacets[key];

            if (Array.isArray(value) && value.length > 0) {
                return `(${value.map(v => `${key} == "${v}"`).join(" OR ")})`;
            } else if (value && typeof value === "object" && "min" in value && "max" in value) {
                return `(${key} >= ${value.min} AND ${key} <= ${value.max})`;
            }

            return "";
        });

        result[currentKey] = conditions.filter(Boolean).join(" AND ");
        return result;
    }, {} as Record<string, string>);
}


export default prepareCustomFilteredFacets;
