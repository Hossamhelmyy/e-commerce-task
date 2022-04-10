/* eslint-disable array-callback-return */
/* eslint-disable no-useless-constructor */
/* eslint-disable react-hooks/rules-of-hooks */
import { request } from "graphql-request";
import React from "react";
import IconImg from "../images/Common.png";
import { connect } from "react-redux";
import swal from "sweetalert";

import { Load_Data } from "../Graphql/Queries";

import {
	addProductToCart,
	updateCartPlus,
	updateCartMinus,
	addPrices,
} from "../store/store";
import Nav from "./NavBar";
import { Link } from "react-router-dom";
class Products extends React.Component {
	constructor(props) {
		super(props);
		console.log(props);
		this.state = {
			data: "",
			prices: [],
			active: "all",
			overlay: false,
			currentyType: 0,
			sympol: "$",
			selectOption: false,
		};
	}
	async fetch(fetchType) {
		try {
			const data = await request(
				"http://localhost:4000/",
				Load_Data(fetchType),
			);

			if (this.state.data.length === 0) {
				this.setState({ data: data.category });
				data.category.products.map((product) => {
					this.setState({
						prices: product.prices,
					});
				});
			}
		} catch (e) {
			console.log(e);
		}
	}
	componentDidMount() {
		this.fetch("all");
	}

	getFetchTypeState = (fetchType) => {
		this.setState({ data: "" });
		this.fetch(fetchType);
	};

	getOverlayState = (overlayState) => {
		this.setState({ overlay: !overlayState });
	};
	addProductToCartt = (product, id) => {
		const exist = this.props.cartItems.find(
			(item) => item.id === product.id,
		);
		if (this.state.selectOption === true) {
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
			this.setState({ selectOption: false });
		} else {
			swal({
				text: "you should select an option",
				icon: "warning",
				buttons: "OK",
				dangerMode: true,
			});
			this.setState({ selectOption: false });
		}
	};

	currentyTypeKnow = (currencyTypeState) => {
		this.setState({ currentyType: currencyTypeState });
	};
	render() {
		return (
			<div
				className={`home ${
					this.state.overlay && "overlay"
				}`}>
				<Nav
					getFetchTypeState={this.getFetchTypeState}
					currentyTypeKnow={this.currentyTypeKnow}
					prices={this.state.prices}
					getOverlayState={this.getOverlayState}
				/>
				<div className="title">
					<h1>{this.state.data.name}</h1>
				</div>
				<div className="products">
					{this.state.data.products?.map((product) => (
						<div className="productCard" key={product.id}>
							<div
								onClick={() =>
									this.addProductToCartt(
										product,
										product.id,
									)
								}
								className="cartIcon">
								<img src={IconImg} alt="cart" />
							</div>
							<Link to={`products/:${product.id}`}>
								<img
									className="product-img"
									src={product.gallery[0]}
									alt="img"
								/>
							</Link>

							<p>{product.name}</p>

							<span>
								{
									product.prices[this.state.currentyType]
										?.currency.symbol
								}
								{
									product.prices[this.state.currentyType]
										?.amount
								}
							</span>

							{product.attributes.map((attribute, i) => (
								<div key={i} className="attributes">
									{attribute.items.map((item, i) => (
										<input
											onClick={() =>
												this.setState({
													selectOption: true,
												})
											}
											className="attribute"
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
						</div>
					))}
				</div>
			</div>
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
		updateCartMinus,
		addPrices,
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps(),
)(Products);
