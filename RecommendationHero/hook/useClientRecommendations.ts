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
      host: "https://api.synerise.com",
      trackerKey: "aa689be3-670b-4972-9464-ce6c45d5d3cb",
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
