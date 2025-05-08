import { Button } from "neetoui";
import { paths } from "ramda";
import useCartItemsStore from "stores/useCartItemsStore";
import { shallow } from "zustand/shallow";
import useSelectedQuantity from "hooks/useSelectedQuantity";
import TooltipWrapper from "./TooltipWrapper";
import { Input } from "neetoui";
import { Toastr } from "neetoui";
import { useRef } from "react";
import { useShowProduct } from "hooks/reactQuery/useProductsApi";

const ProductQuantity = ({ slug}) => {
    const { selectedQuantity, setSelectedQuantity } = useSelectedQuantity(slug);
    const parsedSelectedQuantity = parseInt(selectedQuantity) || 0;
    const { data: product = {} } = useShowProduct(slug);
    const { availableQuantity } = product;

    const isNotValidQuantity = parsedSelectedQuantity >= availableQuantity;
    const VALID_COUNT_REGEX = /^(?:\d*|)$/;
    const countInputFocus = useRef(null);

  const preventNavigation = e => {
    e.stopPropagation();
    e.preventDefault();
  };
  const handleSetCount = event => {
    const { value } = event.target;
    const isNotValidInputQuantity = parseInt(value) > availableQuantity;

    if (isNotValidInputQuantity) {
      Toastr.error(`Only ${availableQuantity} units are available`, { autoClose: 2000 });
      setSelectedQuantity(availableQuantity);
      countInputFocus.current.blur();
    } else if (VALID_COUNT_REGEX.test(value)) {
      setSelectedQuantity(value);
    }
  };

  return (
    <div className="neeto-ui-border-black neeto-ui-rounded inline-flex flex-row items-center border">

      <Button
        className="focus-within:ring-0"
        label="-"
        style="text"
        onClick={e => {
            preventNavigation(e);
            setSelectedQuantity(parsedSelectedQuantity - 1);}}
      />
      <Input
        nakedInput
        className="ml-2"
        contentSize="2"
        ref={countInputFocus}
        value={selectedQuantity}
        onClick={preventNavigation}
        onChange={handleSetCount}
      />
      <TooltipWrapper
        content="Reached maximum units"
        position="top"
        showTooltip={isNotValidQuantity}
      >
      <Button
        className="focus-within:ring-0"
        disabled = {isNotValidQuantity}
        label="+"
        style="text"
        onClick={e => {
            preventNavigation(e);
            setSelectedQuantity(parsedSelectedQuantity + 1);}}
      />
      </TooltipWrapper>
    </div>
  );
};

export default ProductQuantity;