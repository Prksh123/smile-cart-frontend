import productsApi from "apis/products";
import useQueryParams from "hooks/useQueryParams";
import routes from "routes";
import { useState,useEffect } from "react";
import useDebounce from "hooks/useDebounce";
import ProductListItem from "./ProductListItems";
import { Header , PageLoader } from "components/commons";
import { Input,Pagination } from "neetoui";
import { Search } from "neetoicons";
import { NoData } from "neetoui";
import { filterNonNull } from "neetocist";
import { isEmpty } from "ramda";
import { without,mergeLeft } from "ramda";
import { useFetchProducts } from "hooks/reactQuery/useProductsApi";
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_INDEX } from './constants';
import { useHistory } from "react-router-dom";
import { buildUrl } from "utils/url";
import useFuncDebounce from "hooks/useFuncDebounce";
import { useFetchCartProducts } from "hooks/reactQuery/useProductsApi";

const ProductList = () => {
  // const [products, setProducts] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE_INDEX);
  const history = useHistory();
  const queryParams = useQueryParams();
  const { page, pageSize, searchTerm = "" } = queryParams;

  const [searchKey, setSearchKey] = useState(searchTerm);

  const debouncedSearchKey = useDebounce(searchKey);
  const { data: { products = [],totalProductsCount } = {}, isLoading } = useFetchProducts({
    searchTerm,
    page: Number(page) || DEFAULT_PAGE_INDEX,
    pageSize: Number(pageSize) || DEFAULT_PAGE_SIZE,
  });

  const handlePageNavigation = page =>
    history.replace(
      buildUrl(
        routes.products.index,
        mergeLeft({ page, pageSize: DEFAULT_PAGE_SIZE }, queryParams)
      )
    );
  const updateQueryParams = useFuncDebounce(value => {
      const params = {
        page: DEFAULT_PAGE_INDEX,
        pageSize: DEFAULT_PAGE_SIZE,
        searchTerm: value || null,
      };

      history.replace(buildUrl(routes.products.index, filterNonNull(params)));
    });

  // const fetchProducts = async () => {
  //   try {
  //     const data = await productsApi.fetch({
  //       searchTerm: debouncedSearchKey,
  //     });
  //     setProducts(data.products);
  //     console.log(products);
  //   } catch (error) {
  //     console.log("An error occurred:", error);
  //   }finally{
  //     setIsLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   fetchProducts();
  // }, [debouncedSearchKey]);

  if (isLoading) {
   return <PageLoader/>
  }

  const toggleIsInCart = slug =>
    setCartItems(prevCartItems =>
      prevCartItems.includes(slug)
        ? without([slug], cartItems)
        : [slug, ...cartItems]
    );

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
            onChange={({ target: { value } }) => {
              updateQueryParams(value);
              setSearchKey(value);
            }}
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
        <div className="mb-5 self-end">
      <Pagination
          navigate={handlePageNavigation}
          count={totalProductsCount}
          pageNo={Number(page) || DEFAULT_PAGE_INDEX}
          pageSize={Number(pageSize) || DEFAULT_PAGE_SIZE}
        />
    </div>
      </div>

  );
};

export default ProductList;
