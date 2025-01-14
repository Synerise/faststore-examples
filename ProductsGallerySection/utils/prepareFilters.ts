import {SelectedFacetsType} from "../SyneriseProductGallery.types";

function prepareFilters(
    selectedFacets: SelectedFacetsType
) {
    let filter = "";

    for(const facet in selectedFacets.text) {
        if(selectedFacets.text[facet]){
            const facetValues = selectedFacets.text[facet];
            if(facetValues.length > 0){
                if(filter.length > 1){
                    filter += ' AND '
                }

                filter += `${facet} IN [${facetValues.map(facetValue => `\"${facetValue}\"`).join(',')}]`
            }
        }
    }

    for(const facet in selectedFacets.range) {
        if(selectedFacets.range[facet]){
            const facetValues = selectedFacets.range[facet];
            if(filter.length > 1){
                filter += ' AND '
            }

            filter +=  `${facet} FROM ${facetValues.min} TO ${facetValues.max}`;
        }
    }

    return filter;
}

export default prepareFilters
