import React from "react";

import { Header, PageNotFound, PageLoader } from "components/commons";
import AddToCart from "components/commons/AddToCart";
import { useShowProduct } from "hooks/reactQuery/useProductsApi";
import useSelectedQuantity from "hooks/useSelectedQuantity";
import { Button, Typography } from "neetoui";
import { isNotNil } from "ramda";
import { useParams } from "react-router-dom";
import routes from "routes";

import Carousel from "./Carousel";

const Product = () => {
  const { slug } = useParams();

  const { selectedQuantity, setSelectedQuantity } = useSelectedQuantity(slug);
  const { data: product = {}, isLoading, isError } = useShowProduct(slug);

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError) {
    return <PageNotFound />;
  }

  const {
    name,
    description,
    mrp,
    offerPrice,
    imageUrls,
    imageUrl,
    availableQuantity,
  } = product;
  const totalDiscounts = mrp - offerPrice;
  const discountPercentage = ((totalDiscounts / mrp) * 100).toFixed(1);

  return (
    <>
      <Header title={name} />
      <div className="mt-6 flex gap-4">
        <div className="w-2/5">
          <div className="flex justify-center gap-16">
            {isNotNil(imageUrls) ? (
              <Carousel />
            ) : (
              <img alt={name} className="w-48" src={imageUrl} />
            )}
          </div>
        </div>
        <div className="w-3/5 space-y-4">
          <Typography>{description}</Typography>
          <Typography>MRP: {mrp}</Typography>
          <Typography className="font-semibold">
            Offer price: {offerPrice}
          </Typography>
          <Typography className="font-semibold text-green-600">
            {discountPercentage}% off
          </Typography>
          <div className="flex space-x-10">
            <AddToCart {...{ availableQuantity, slug }} />
            <Button
              className="bg-neutral-800 hover:bg-neutral-950"
              label="Buy now"
              size="large"
              to={routes.checkout}
              onClick={() => setSelectedQuantity(selectedQuantity || 1)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
