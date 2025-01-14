import {useMemo} from "react";
import {SearchArgs} from '@synerise/faststore-api'
import {gql} from '@generated/gql';
import {SyneriseListingQueryQuery, SyneriseSearchQueryQuery} from "@generated/graphql";
import {useQuery} from "src/sdk/graphql/useQuery";


export const searchQuery = gql(`query syneriseSearchQuery(
  $apiHost: String,
  $trackerKey: String,
  $indexId: String,
  $query: String!,
  $page: Int,
  $limit: Int
  $sortBy: String,
  $ordering: SyneriseSearchOrdering,
  $filters: String,
  $correlationId: String,
  $customFilteredFacets: JSONObject,
  $clientUUID: String,
  $caseSensitiveFacetValues: Boolean,
  $includeFacets: SyneriseSearchIncludeFacets,
  $facets: [String]
) {
    syneriseAISearch(apiHost: $apiHost, trackerKey: $trackerKey, indexId: $indexId) {
        search(
            query: $query,
            page: $page,
            limit: $limit,
            sortBy: $sortBy,
            ordering: $ordering,
            filters: $filters,
            correlationId: $correlationId,
            customFilteredFacets: $customFilteredFacets,
            clientUUID: $clientUUID,
            caseSensitiveFacetValues: $caseSensitiveFacetValues,
            includeFacets: $includeFacets,
            facets: $facets
        ) {
            data {
                ...ProductSummary_product
            }
            extras {
                correlationId
                allFacets
                customFilteredFacets
                filteredFacets
            }
            meta {
                page
                totalCount
                totalPages
                limit
                links {
                    rel
                    url
                }
            }
        }
    }
}`);

export const listingQuery = gql(`query SyneriseListingQuery(
  $apiHost: String,
  $trackerKey: String,
  $indexId: String,
  $page: Int,
  $limit: Int
  $sortBy: String,
  $ordering: SyneriseSearchOrdering,
  $filters: String,
  $correlationId: String,
  $customFilteredFacets: JSONObject,
  $clientUUID: String,
  $caseSensitiveFacetValues: Boolean,
  $includeFacets: SyneriseSearchIncludeFacets,
  $facets: [String]
) {
    syneriseAISearch(apiHost: $apiHost, trackerKey: $trackerKey, indexId: $indexId) {
        listing(
            page: $page,
            limit: $limit,
            sortBy: $sortBy,
            ordering: $ordering,
            filters: $filters,
            correlationId: $correlationId,
            customFilteredFacets: $customFilteredFacets,
            clientUUID: $clientUUID,
            caseSensitiveFacetValues: $caseSensitiveFacetValues,
            includeFacets: $includeFacets,
            facets: $facets
        ) {
            data {
                ...ProductSummary_product
            }
            extras {
                correlationId
                allFacets
                customFilteredFacets
                filteredFacets
            }
            meta {
                page
                totalCount
                totalPages
                limit
                links {
                    rel
                    url
                }
            }
        }
    }
}`);


function useSearch(args: Omit<SearchArgs, "query"> & { apiHost: string, trackerKey: string, indexId: string, query?: string }) {
    const variables = useMemo(
        () => ({
            ...args,
            ordering: args.ordering?.toUpperCase()
        }),
        [args]
    )

    const {
        data,
        error
    } = useQuery<SyneriseSearchQueryQuery | SyneriseListingQueryQuery>(args.query ? searchQuery : listingQuery, variables);

    if (data && "search" in data.syneriseAISearch) {
        return {
            data: data.syneriseAISearch.search,
            error
        }
    }

    if (data && "listing" in data.syneriseAISearch) {
        return {
            data: data.syneriseAISearch.listing,
            error
        }
    }

    return {
        data: undefined,
        error
    }
}


export default useSearch;
