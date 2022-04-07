/* eslint-disable array-callback-return */
/* eslint-disable no-useless-constructor */
import React from "react";
import { request } from "graphql-request";
import { Load_Product } from "../Graphql/Queries";
import { useParams } from "react-router-dom";
import NavBar from "./NavBar";
import {
	addProductToCart,
	updateCartPlus,
} from "../store/store";
import { connect } from "react-redux";
import swal from "sweetalert";
function withRouter(Component) {
	function ComponentWithRouter(props) {
		let params = useParams();
		return <Component {...props} params={params} />;
	}
	return ComponentWithRouter;
}
class ProductPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: "",
			prices: [],
			gallery: [],
			imgNum: 0,
			currentyType: 0,
			attributes: [],
		};
	}
	async fetch(query) {
		const id = this.props.params.id.slice(1);
		try {
			const data = await request(
				"http://localhost:4000/",
				query(id),
			);
			this.setState({ data: data.product });

			this.setState({ prices: data.product.prices });
			this.setState({ gallery: data.product.gallery });
			this.setState({
				attributes: data.product.attributes,
			});
		} catch (e) {
			console.log(e);
		}
	}
	componentDidMount() {
		this.fetch(Load_Product);
	}

	currentyTypeKnow = (currencyTypeState) => {
		this.setState({ currentyType: currencyTypeState });
	};
	addProductToCartt = (product, id) => {
		const exist = this.props.cartItems.find(
			(item) => item.id === product.id,
		);
		if (product.inStock) {
			if (exist) {
				this.props.updateCartPlus(exist);
			} else {
				this.props.addProductToCart({
					product: product,
					quantity: 1,
					id: id,
				});
			}
		} else {
			swal({
				text: "this product is finished from the stock",
				icon: "warning",
				buttons: "OK",
				dangerMode: true,
			});
		}
	};
	render() {
		console.log(this.state.data);
		const filteredGallery = this.state.gallery.filter(
			(photo, i) => i !== this.state.imgNum,
		);

		return (
			<>
				<NavBar
					prices={this.state.prices}
					currencyType={this.currentyTypeKnow}
				/>
				<div className="product-page">
					<div className="product-gallery">
						{filteredGallery.map((img, i) => (
							<img
								key={i}
								onClick={() =>
									this.setState({ imgNum: i + 1 })
								}
								src={img}
								alt="img"
							/>
						))}
					</div>
					<div className="main-photo">
						<img
							src={this.state.gallery[this.state.imgNum]}
							alt="mainImg"
						/>
					</div>
					<div className="product-info">
						<div className="product-name">
							<p>{this.state.data.name}</p>
						</div>
						{this.state.attributes.map((attribute, i) => (
							<div key={i} className="product-sizes">
								{attribute.items.map((item, i) => (
									<input
										className="size"
										key={i}
										defaultValue={item.value}
										type={
											attribute.type === "swatch"
												? "color"
												: attribute.type
										}
										name={attribute.name}
										id={attribute.id}
									/>
								))}
							</div>
						))}
						<div className="product-price">
							<span>PRICE :</span>
							<span>
								{
									this.state.prices[this.state.currentyType]
										?.currency.symbol
								}
								{
									this.state.prices[this.state.currentyType]
										?.amount
								}
							</span>
						</div>
						<div className="add-to-cart-button">
							<button
								onClick={() =>
									this.addProductToCartt(
										this.state.data,
										this.state.data.id,
									)
								}
								className="add">
								ADD TO CART
							</button>
						</div>
						<div
							dangerouslySetInnerHTML={{
								__html: this.state.data.description,
							}}
							className="product-description"></div>
					</div>
				</div>
			</>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		cartItems: state.cartItems,
	};
};
const mapDispatchToProps = () => {
	return {
		addProductToCart,
		updateCartPlus,
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps(),
)(withRouter(ProductPage));
