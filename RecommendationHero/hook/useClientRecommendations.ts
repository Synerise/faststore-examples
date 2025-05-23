import { useState, useEffect } from "react";
import {
  RecommendationsByCampaignResponse,
  SyneriseRecommendationsClient,
} from "@synerise/faststore-api";

const parseCookies = (): Record<string, string> => {
  return document.cookie
    .split("; ")
    .reduce((acc: Record<string, string>, cookie) => {
      const [key, value] = cookie.split("=");
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});
};

export const useClientRecommendations = (campaignId: string) => {
  const [data, setData] = useState<RecommendationsByCampaignResponse>();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const clientUUID = parseCookies()["_snrs_uuid"] || undefined;

  useEffect(() => {
    if (!campaignId) {
      setLoading(false);
      return;
    }

    const recommendationsClient = SyneriseRecommendationsClient({
      campaignId,
      host: "https://example.com",
      trackerKey: "xxxx-xxxx-xxxx-xxxx",
    });

    recommendationsClient
      .recommendationsByCampaign({ campaignId, clientUUID })
      .then((response) => {
        setData(response);
        setError(null);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [campaignId]);

  return { data, error, loading };
};
