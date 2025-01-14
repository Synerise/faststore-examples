import {useCallback, useEffect} from "react";
import {useSWRConfig} from 'swr';
import {SearchArgs} from "@synerise/faststore-api";

import {prefetchQuery} from 'src/sdk/graphql/prefetchQuery'

import {useSearchContext} from "../SearchProvider";
import {prepareCustomFilteredFacets, prepareFilters, getSorting} from "../utils";
import { searchQuery, listingQuery } from './useSearchQuery'


export const useSearchQueryPrefetch = (
    variables: Omit<SearchArgs, "query"> & { apiHost: string, trackerKey: string, indexId: string, query?: string }
) => {
    const {cache} = useSWRConfig()

    return useCallback(
        () => prefetchQuery(variables.query ? searchQuery : listingQuery, variables, { cache }),
        [cache, variables]
    )
}

function useSearchPrefetch(page: number | null) {
    const {state} = useSearchContext()

    const sorting = state.sortKey ? getSorting(state.sortKey, state.sort) : undefined

    const prefetch = useSearchQueryPrefetch({
        indexId: state.indexId,
        apiHost: state.apiHost,
        trackerKey: state.trackerKey,
        query: state.query,
        page: page !== null ? page + 1 : 1,
        limit: state.limit,
        correlationId: state.correlationId,
        caseSensitiveFacetValues: true,
        filters: prepareFilters(state.selectedFacets),
        customFilteredFacets: prepareCustomFilteredFacets(state.selectedFacets),
        sortBy: sorting?.sortBy,
        ordering: sorting?.ordering,
        includeFacets: "all",
        facets: ["*"]
    })

    useEffect(() => {
        if (page !== null) {
            prefetch()
        }
    }, [page])
}

export default useSearchPrefetch
