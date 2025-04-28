import { NavLink, Route, Switch,Redirect } from "react-router-dom";

import ProductList from "./components/ProductList";
import { PageNotFound } from "components/commons";
import Product from "./components/Product";

const App = () => (
  <>
    <Switch>
    <Route exact component={Product} path="/products/:slug" />
      <Route exact component={ProductList} path="/products" />
      <Redirect exact from="/" to="/products" />
      <Route exact component={PageNotFound} path="*" />
    </Switch>
  </>
);

export default App;
