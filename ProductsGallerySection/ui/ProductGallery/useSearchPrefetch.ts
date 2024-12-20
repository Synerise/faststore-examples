import {useCallback, useEffect} from "react";
import gql from "graphql-tag";
import {useSWRConfig} from 'swr';
import {
    prefetchQuery,
    prepareCustomFilteredFacets,
    prepareFilters,
    QueryOptions,
    SearchArgs,
    SYNERISE_SEARCH_QUERY,
    useSearchContext
} from "@synerise/faststore-sdk";

export const useSearchQueryPrefetch = (
    variables: SearchArgs,
    options?: QueryOptions
) => {
    const {cache} = useSWRConfig()

    return useCallback(
        () => prefetchQuery(
            "SyneriseSearchQuery",
            gql(SYNERISE_SEARCH_QUERY),
            variables,
            {...options, cache}
        ),
        [cache, options, variables]
    )
}

export const useSearchPrefetch = (page: number | null) => {
    const {state} = useSearchContext()

    const prefetch = useSearchQueryPrefetch({
        query: state.query || "",
        page: page || 1,
        limit: state.limit,
        correlationId: state.correlationId,
        caseSensitiveFacetValues: true,
        filters: prepareFilters(state.selectedFacets),
        customFilteredFacets: prepareCustomFilteredFacets(state.selectedFacets),
        sortBy: state.sort?.sortBy,
        ordering: state.sort?.ordering,
        includeFacets: "all",
        facets: ["*"]
    })

    useEffect(() => {
        if (page !== null) {
            prefetch()
        }
    }, [page, prefetch])
}
