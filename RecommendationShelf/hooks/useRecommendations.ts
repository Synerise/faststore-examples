import { gql } from "@generated/gql";
import { SyneriseRecommendationsQueryQuery } from "@generated/graphql";
import { useQuery } from "src/sdk/graphql/useQuery";

import { RecommendationsByCampaignRequest } from "@synerise/faststore-api";

const query = gql(`query SyneriseRecommendationsQuery(
  $apiHost: String,
  $trackerKey: String
  $campaignId: String,
  $clientUUID: String,
  $items: [String],
  $itemsSource: ItemsSourceInput,
  $itemsExcluded: [String],
  $additionalFilters: String,
  $filtersJoiner: FilterJoiner,
  $additionalElasticFilters: String,
  $elasticFiltersJoiner: FilterJoiner,
  $displayAttributes: [String],
  $includeContextItems: Boolean
) {
  syneriseAIRecommendations(campaignId: $campaignId, apiHost: $apiHost, trackerKey: $trackerKey) {
    recommendations(
      campaignId: $campaignId,
      clientUUID: $clientUUID,
      items: $items,
      itemsSource: $itemsSource,
      itemsExcluded: $itemsExcluded,
      additionalFilters: $additionalFilters,
      filtersJoiner: $filtersJoiner,
      additionalElasticFilters: $additionalElasticFilters,
      elasticFiltersJoiner: $elasticFiltersJoiner,
      displayAttributes: $displayAttributes,
      includeContextItems: $includeContextItems
    ) {
      data {
        id: productID
        slug
        sku
        brand {
          brandName: name
        }
        name
        gtin
        isVariantOf {
          productGroupID
          name
        }
        image {
          url
          alternateName
        }
        brand {
          name
        }
        offers {
          lowPrice
          lowPriceWithTaxes
          offers {
            availability
            price
            listPrice
            listPriceWithTaxes
            quantity
            seller {
              identifier
            }
          }
        }
        additionalProperty {
          propertyID
          name
          value
          valueReference
        }
      }
      extras {
        correlationId
        contextItems {
          itemId
          additionalData
        }
        slots {
          id
          name
          itemIds
          error {
            status
            error
            message
          }
        }
      }
    }
  }
}
`);

const enhancePayload = (payload: RecommendationsByCampaignRequest) => {
  return {
    ...payload,
    apiHost: "https://example.com",
    trackerKey: "xxxx-xxxx-xxxx-xxxx",
  };
};

export const useRecommendations = (
  payload: RecommendationsByCampaignRequest
) => {
  const enhancedPayload = enhancePayload(payload);

  const { data, error } = useQuery<SyneriseRecommendationsQueryQuery>(
    query,
    enhancedPayload
  );

  return {
    data,
    error,
    loading: !data?.syneriseAIRecommendations.recommendations?.data && !error,
  };
};
