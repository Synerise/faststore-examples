import {useMemo} from "react";
import {gql} from "@generated/gql";
import {SyneriseAutocompleteQueryQuery, SyneriseAutocompleteQueryQueryVariables} from "@generated/graphql";

import {useQuery} from "src/sdk/graphql/useQuery";

const query = gql(`query SyneriseAutocompleteQuery(
    $indexId: String!,
    $apiHost: String!,
    $trackerKey: String!,
    $query: String!,
) {
    syneriseAISearch(indexId: $indexId, apiHost: $apiHost, trackerKey: $trackerKey) {
        autocomplete(
            query: $query,
        ) {
            data {
                ...ProductSummary_product
            }
        }
    }
}`)

function useAutocomplete(args: SyneriseAutocompleteQueryQueryVariables) {
    const variables = useMemo(
        () => ({...args}),
        [args]
    )

    const {
        data,
        error
    } = useQuery<SyneriseAutocompleteQueryQuery>(query, variables)

    return {
        data,
        error,
    }
}

export default useAutocomplete;
