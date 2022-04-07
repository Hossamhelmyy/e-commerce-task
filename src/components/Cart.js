/* eslint-disable array-callback-return */
/* eslint-disable no-useless-constructor */
import React from "react";
import { connect } from "react-redux";
import { request } from "graphql-request";

import {
	updateCartPlus,
	updateCartMinus,
} from "../store/store";

import NavBar from "./NavBar";
import { Load_Data } from "../Graphql/Queries";
class Cart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			prices: [],
			currentyType: 0,
		};
	}
	async fetch() {
		try {
			const data = await request(
				"http://localhost:4000/",
				Load_Data("all"),
			);
			console.log(data);

			data.category.products.map((product) => {
				this.setState({ prices: product.prices });
			});
		} catch (e) {
			console.log(e);
		}
	}
	componentDidMount() {
		this.fetch();
	}
	getCurrentType = (currencyTypeState) => {
		this.setState({ currentyType: currencyTypeState });
		console.log(currencyTypeState);
	};

	render() {
		console.log(this.state.prices);
		return (
			<>
				<NavBar
					getCurrentType={this.getCurrentType}
					prices={this.state.prices}
				/>
				<div className="title-Cartpage">
					<h1>cart</h1>
				</div>
				<div className="cartItemsPage">
					{this.props.cartItems.map((obj, i) => (
						<div key={i} className="productDetailsPage">
							<div className="left-page">
								<p className="name-page">
									{obj.product.name}
								</p>
								<p className="price-page">
									{
										obj.product.prices[
											this.state.currentyType
										].currency.symbol
									}
									{(
										obj.product.prices[
											this.state.currentyType
										].amount * +obj.quantity
									).toFixed(2)}
								</p>
								<div className="sizesPage">
									<span className="small-page">S</span>
									<span className="medium-page">M</span>
								</div>
							</div>

							<div className="right-page">
								<div className="signs">
									<span
										onClick={() =>
											this.props.updateCartPlus(obj.product)
										}
										className="plus-page">
										+
									</span>
									<span className="quantity-page">
										{obj.quantity}
									</span>
									<span
										onClick={() =>
											this.props.updateCartMinus(
												obj.product,
											)
										}
										className="minus-page">
										-
									</span>
								</div>
								<img
									className="productCartImg-page"
									src={obj.product.gallery[0]}
									alt="img"
								/>
							</div>
						</div>
					))}
					<div className="checkDetails-page">
						<div className="total-page">
							<span className="key-page">Total</span>
							<div className="value-page">
								{
									this.state.prices[this.state.currentyType]
										?.currency.symbol
								}
								{this.props.cartItems &&
									this.props.cartItems
										.reduce(
											(a, c) =>
												a +
												c.quantity *
													+c.product.prices[
														this.state.currentyType
													].amount,
											0,
										)
										.toFixed(2)}
							</div>
						</div>
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
		updateCartPlus,
		updateCartMinus,
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps(),
)(Cart);
