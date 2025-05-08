import { Button } from "neetoui";
import { isNil, paths } from "ramda";
import useCartItemsStore from "stores/useCartItemsStore";
import { shallow } from "zustand/shallow";
import useSelectedQuantity from "hooks/useSelectedQuantity";
import { useShowProduct } from "hooks/reactQuery/useProductsApi";
import ProductQuantity from "./ProductQuantity";

const AddToCart = ({ slug }) => {
    const { selectedQuantity, setSelectedQuantity } = useSelectedQuantity(slug);
    const { data: product = {} } = useShowProduct(slug);
    const { availableQuantity } = product;

  const handleClick = e => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedQuantity(1);
  };

  if (isNil(selectedQuantity)) {
    return <Button label="Add to cart" size="large" onClick={handleClick} />;
  }

  return <ProductQuantity {...{ slug }} />;
};

export default AddToCart;