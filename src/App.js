import "./App.css";
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	from,
	HttpLink,
} from "@apollo/client";
import {
	BrowserRouter,
	Routes,
	Route,
} from "react-router-dom";
import ProductPage from "./components/productPage";
import { onError } from "@apollo/client/link/error";
import Products from "./components/Home";
import Cart from "./components/Cart";
const errorLink = onError(
	({ graphqlErrors, networkError }) => {
		if (graphqlErrors) {
			// eslint-disable-next-line array-callback-return
			graphqlErrors.map(({ message, location, path }) => {
				alert(`Graphql error ${message}`);
			});
		}
	},
);
const link = from([
	errorLink,
	new HttpLink({ uri: "http://localhost:4000/" }),
]);
const client = new ApolloClient({
	cache: new InMemoryCache(),
	link: link,
});
function App() {
	return (
		<ApolloProvider client={client}>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Products />}></Route>
					<Route path="/cart" element={<Cart />}></Route>
					<Route
						path="products/:id"
						element={<ProductPage />}
					/>
				</Routes>
			</BrowserRouter>
		</ApolloProvider>
	);
}

export default App;
