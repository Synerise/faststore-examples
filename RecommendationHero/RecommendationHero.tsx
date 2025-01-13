import React from "react";

import { Hero, HeroImage, HeroHeader, Skeleton } from "@faststore/ui";

import styles from "./RecommendationHero.module.scss";
import { useClientRecommendations } from "./hooks";

export const RecommendationHero = ({
  campaignId,
  heroConfiguration: { showTitle, showCta, showSubtitle },
}: {
  campaignId: string;
  heroConfiguration: {
    showTitle: boolean;
    showSubtitle: boolean;
    showCta: boolean;
  };
}) => {
  const { data, loading } = useClientRecommendations(campaignId);

  const section = data?.data[0];

  if (!section && !loading) {
    return null;
  }

  return (
    <section className={`${styles.recommendationHero} section`}>
      {loading ? (
        <Skeleton size={{ width: "100%", height: "464px" }} />
      ) : (
        <Hero>
          <HeroImage>
            <img alt={section?.heroAlt} src={section?.heroImage} />
          </HeroImage>
          <HeroHeader
            link={section?.heroLink}
            title={showTitle && section?.heroTitle}
            linkText={showCta && section?.heroLinkText}
            subtitle={showSubtitle && section?.heroSubtitle}
          />
        </Hero>
      )}
    </section>
  );
};
