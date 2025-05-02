import productsApi from "apis/products";
import { useState,useEffect } from "react";
import useDebounce from "hooks/useDebounce";
import ProductListItem from "./ProductListItems";
import { Header , PageLoader } from "components/commons";
import { Input } from "neetoui";
import { Search } from "neetoicons";
import { NoData } from "neetoui";
import { isEmpty } from "ramda";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKey, setSearchKey] = useState("");
  const debouncedSearchKey = useDebounce(searchKey);

  const fetchProducts = async () => {
    try {
      const data = await productsApi.fetch({
        searchTerm: debouncedSearchKey,
      });
      setProducts(data.products);
    } catch (error) {
      console.log("An error occurred:", error);
    }finally{
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [debouncedSearchKey]);

  if (isLoading) {
   return <PageLoader/>
  }

  return(
    <div className="flex h-screen flex-col">
     <Header
        title="Smile cart"
        shouldShowBackButton={false}
        actionBlock={
          <Input
            placeholder="Search products"
            prefix={<Search />}
            type="search"
            value={searchKey}
            onChange={event => setSearchKey(event.target.value)}
          />
        }
      />
        {isEmpty(products) ? (
          <NoData className="h-full w-full" title="No products to show" />
        ) : (
          <div className="grid grid-cols-2 justify-items-center gap-y-8 p-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map(product => (
              <ProductListItem key={product.slug} {...product} />
            ))}
          </div>
        )}
      </div>
  );
};

export default ProductList;
