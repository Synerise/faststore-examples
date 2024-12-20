export type ProductGallerySectionProps = {
    filters: {
        label: string,
        facetName: string,
        facetType: "Range" | "Text"
    }[],
    sort: {
        label: string,
        sortBy: string,
        ordering: "desc" | "asc"
    }[]
    itemsPerPage: number
}
