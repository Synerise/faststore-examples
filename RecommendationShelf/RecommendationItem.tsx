import React from "react";
import NextLink from "next/link";

import {
  ProductCard,
  ProductCardContent,
  ProductCardImage,
} from "@faststore/ui";
import { StoreProduct } from "@generated/graphql";

import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'

type RecommendationItemProps = {
  item: StoreProduct;
  bordered?: boolean;
  showDiscountBadge?: boolean;
  onClick: () => void;
};

export const RecommendationItem = ({
  item,
  bordered,
  showDiscountBadge,
  onClick,
}: RecommendationItemProps) => {
  return (
    <ProductCard bordered={bordered} onClick={onClick}>
      <ProductCardImage aspectRatio={3 / 4}>
        <img
          data-fs-image
          src={item.image[0].url}
          alt={item.image[0].alternateName}
        />
      </ProductCardImage>
      <ProductCardContent
        linkProps={{
          as: NextLink,
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
  );
};
