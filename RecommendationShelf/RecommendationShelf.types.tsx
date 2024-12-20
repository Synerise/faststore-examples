export type RecommendationShelfProps = {
  title: string;
  campaignId: string;
  itemsPerPage: number;
  productCardConfiguration: {
    showDiscountBadge: boolean;
    bordered: boolean;
  };
};

export type RecommendationViewEvent = {
  name: "recommendation_view";
  params: {
    campaignId: string;
    correlationId?: string;
    items: string[];
  };
};

export type RecommendationClickEvent = {
  name: "recommendation_click";
  params: { campaignId: string; correlationId?: string; item: string };
};
