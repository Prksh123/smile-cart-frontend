import {  Route, Switch,Redirect } from "react-router-dom";
import routes from "routes";
import ProductList from "./components/ProductList";
import { PageNotFound } from "components/commons";
import Product from "./components/Product";
import { useState } from "react";
import CartItemsContext from "./contexts/CartItemsContext";


const App = () =>{
      const [cartItems, setCartItems] = useState([]);

  return (
  <>
  <CartItemsContext.Provider value={[cartItems, setCartItems]}>
    <Switch>
    <Route exact component={Product} path={routes.products.show} />
      <Route exact component={ProductList} path={routes.products.index} />
      <Redirect exact from={routes.root} to={routes.products.index} />
      <Route exact component={PageNotFound} path="*" />
    </Switch>
    </CartItemsContext.Provider>
  </>
)};

export default App;
