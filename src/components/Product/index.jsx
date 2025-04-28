import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import productsApi from "apis/products";
import { Typography, Spinner } from "neetoui";
import { isNotNil, append } from "ramda";
import Carousel from "./Carousel";
import { Header, PageNotFound, PageLoader } from "components/commons";

const Product = () => {
  const { slug } = useParams();
  const history = useHistory();
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchProduct = async () => {
    try {
      const product = await productsApi.show(slug);
      setProduct(product);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
  if (isError) return <PageNotFound />;

  useEffect(() => {
    fetchProduct();
  }, []);
  console.log(product);
  const { name, description, mrp, offerPrice, imageUrls, imageUrl } = product;
  const totalDiscounts = mrp - offerPrice;
  const discountPercentage = ((totalDiscounts / mrp) * 100).toFixed(1);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
    <Header title={name} />
      <div className="mt-6 flex gap-4">
        <div className="w-2/5">
          <div className="flex justify-center gap-16">
            {isNotNil(imageUrls) ? (
              <Carousel imageUrls={append(imageUrl, imageUrls)} title={name} />
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
        </div>
      </div>
    </>
  );
};

export default Product;
