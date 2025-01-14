import {SyneriseSearchStateProps} from "../SearchProvider";

const prepareUrl = ({ page, selectedFacets, query, correlationId, sortKey }: SyneriseSearchStateProps, base?: string): URL => {
    const isBrowser = typeof window !== 'undefined';
    const url = new URL(isBrowser ? window.location.href : base || "http://localhost");

    const excludeParams = ['sort', 'q', 'page', 'orderBy', 'ordering', 'correlationId', ...Object.keys(selectedFacets.text), ...Object.keys(selectedFacets.range)];

    excludeParams.forEach(param => {
        if (url.searchParams.has(param)) {
            url.searchParams.delete(param);
        }
    });

    if (query) {
        url.searchParams.set('q', query)
    }

    for(const textFacetName in selectedFacets.text) {
        const facetValues = selectedFacets.text[textFacetName];
        facetValues.forEach((value) => url.searchParams.append(textFacetName, value));
    }
    for(const rangeFacetName in selectedFacets.range) {
        const facetValues = selectedFacets.range[rangeFacetName];
        url.searchParams.append(rangeFacetName, `${facetValues.min};${facetValues.max}`)
    }

    const textFacets = Object.keys(selectedFacets.text);
    if (textFacets.length > 0) {
        url.searchParams.set('sFacets', Array.from(new Set(textFacets)).join(','))
    }

    const rangeFacets = Object.keys(selectedFacets.range)
    if(rangeFacets.length > 0) {
        url.searchParams.set('rangeFacets', Array.from(new Set(rangeFacets)).join(','))
    }

    if(correlationId){
        url.searchParams.set('correlationId', correlationId)
    }

    if(sortKey){
        url.searchParams.set('sort', sortKey)
    }

    url.searchParams.set('page', page.toString())

    return url
}

export default prepareUrl;
