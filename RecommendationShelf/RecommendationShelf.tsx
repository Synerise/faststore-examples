import React, { useEffect, useRef, useId } from "react";
import { useInView } from "react-intersection-observer";
import { usePDP } from "@faststore/core";
import { sendAnalyticsEvent } from "@faststore/sdk";
import { StoreProduct } from "@generated/graphql";

import { useRecommendationsQuery } from "@synerise/faststore-sdk";

import {
  ProductCard,
  ProductCardContent,
  ProductCardImage,
  ProductShelf,
  Carousel,
} from "@faststore/ui";
import { useFormattedPrice } from "src/sdk/product/useFormattedPrice";

import {
  RecommendationShelfProps,
  RecommendationViewEvent,
  RecommendationClickEvent,
} from "./RecommendationShelf.types";
import styles from "./RecommendationShelf.module.scss";

export const RecommendationShelf = ({
  title,
  itemsPerPage,
  campaignId,
  productCardConfiguration: { bordered, showDiscountBadge },
}: RecommendationShelfProps) => {
  const id = useId();
  const viewedOnce = useRef(false);
  const { data: contextData } = usePDP();
  const { ref, inView } = useInView();
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  const { data } = useRecommendationsQuery({
    campaignId,
    items: contextData?.product?.sku ? [contextData.product.sku] : [],
  });

  const items = data?.syneriseAIRecommendations.recommendations.data || [];
  const extras = data?.syneriseAIRecommendations.recommendations.extras;

  useEffect(() => {
    if (inView && !viewedOnce.current && items.length) {
      sendAnalyticsEvent<RecommendationViewEvent>({
        name: "recommendation_view",
        params: {
          campaignId,
          correlationId: extras?.correlationId,
          items: items.map((item) => item.sku),
        },
      });
      viewedOnce.current = true;
    }
  }, [inView, items, campaignId, extras]);

  if (items.length === 0) {
    return null;
  }

  const handleItemClick = (item: Pick<StoreProduct, "sku">) => {
    sendAnalyticsEvent<RecommendationClickEvent>({
      name: "recommendation_click",
      params: {
        campaignId,
        correlationId: extras?.correlationId,
        item: item.sku,
      },
    });
  };

  return (
    <section
      ref={ref}
      className={`${styles.recommendationShelf} section section-product-shelf layout__section`}
    >
      <h2 className="text__title-section layout__content">{title}</h2>
      <ProductShelf>
        <Carousel
          id={id}
          itemsPerPage={isMobile ? 1 : itemsPerPage}
          variant="scroll"
          infiniteMode={false}
        >
          {items.map((item) => (
            <ProductCard
              key={item.sku}
              bordered={bordered}
              onClick={() => handleItemClick(item)}
            >
              <ProductCardImage aspectRatio={3 / 4}>
                <img
                  data-fs-image
                  src={item.image[0].url}
                  alt={item.image[0].alternateName}
                />
              </ProductCardImage>
              <ProductCardContent
                linkProps={{
                  size: "regular",
                  variant: "default",
                  as: "a",
                  href: `/${item.slug}/p`,
                }}
                title={item.isVariantOf.name}
                price={{
                  value: item.offers.offers[0].price,
                  listPrice: item.offers.offers[0].listPrice,
                  formatter: useFormattedPrice,
                }}
                showDiscountBadge={showDiscountBadge}
              />
            </ProductCard>
          ))}
        </Carousel>
      </ProductShelf>
    </section>
  );
};
