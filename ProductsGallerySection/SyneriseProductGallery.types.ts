export type Filter = {
    label: string,
    facetName: string,
    facetType: "Range" | "Text"
}

export type SortOption = {
    label: string,
    key: string,
    sortBy: string,
    ordering: "asc" | "desc",
    isDefault: boolean
}

export type SelectedFacetsType = {
    text: Record<string, string[]>
    range: Record<string, { min: number, max: number }>
}
