/* eslint-disable array-callback-return */
/* eslint-disable no-useless-constructor */
import React from "react";
import { AiOutlineMinusSquare } from "react-icons/ai";
import { FiPlusSquare } from "react-icons/fi";
import small from "../images/Group 401.png";
import medium from "../images/Group 402.png";
import img from "../images/Group (1).png";
import { connect } from "react-redux";
import {
	updateCartPlus,
	updateCartMinus,
} from "../store/store";
import { BsCurrencyDollar, BsCart2 } from "react-icons/bs";
import {
	IoIosArrowDown,
	IoIosArrowUp,
} from "react-icons/io";
import { Link } from "react-router-dom";

class Nav extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showCart: false,
			active: "all",
			showCurrency: false,
			currentyType: 0,
			sympol: "$",
			prices: [],
		};
	}
	componentDidMount() {
		this.props.cartItems.map((obj) => {
			this.setState({ prices: obj.product.prices });
		});
	}
	fetchTech = () => {
		this.setState({
			active: "tech",
		});
		this.setState({ typeOfQuery: "tech" });
		this.props.getFetchTypeState("tech");
	};

	fetchClothes = () => {
		this.setState({
			active: "clothes",
		});
		this.setState({ typeOfQuery: "clothes" });
		this.props.getFetchTypeState("clothes");
	};
	fetchAll = () => {
		this.setState({
			active: "all",
		});
		this.setState({ typeOfQuery: "all" });
		this.props.getFetchTypeState("all");
	};
	showCarthandle = () => {
		this.setState({
			showCurrency: false,
		});
		this.setState({
			showCart: !this.state.showCart,
		});
	};
	showCurrencyDropdown = () => {
		this.setState({
			showCart: false,
		});
		this.setState({
			showCurrency: !this.state.showCurrency,
		});
	};
	handleCurrencyType = () => {
		this.props.currentyTypeHandle(this.state.currentyType);
	};
	render() {
		console.log(this.props.prices);
		return (
			<nav className="container">
				<div className="nav-left">
					<span
						onClick={this.fetchAll}
						className={`category ${
							this.state.active === "all" ? "active" : ""
						}`}>
						All
					</span>
					<span
						onClick={this.fetchTech}
						className={`category ${
							this.state.active === "tech" ? "active" : ""
						}`}>
						Tech
					</span>
					<span
						onClick={this.fetchClothes}
						className={`category ${
							this.state.active === "clothes"
								? "active"
								: ""
						}`}>
						Clothes
					</span>
				</div>
				<div className="nav-middle">
					<Link to="/">
						<img className="nav-img" src={img} alt="img" />
					</Link>
				</div>
				<div className="nav-right">
					<span
						onClick={this.showCurrencyDropdown}
						className="currency">
						<BsCurrencyDollar className="dolar" />
						{this.state.showCurrency ? (
							<IoIosArrowUp className="arrow" />
						) : (
							<IoIosArrowDown className="arrow" />
						)}
					</span>
					<span
						onClick={this.showCarthandle}
						className="cart">
						<span>{this.props.cartItems?.length}</span>
						<BsCart2 />
					</span>
				</div>
				<div
					className={`cartItems ${
						this.state.showCart ? "show" : ""
					}`}>
					<div className="cart-title">
						<span className="Bag">my Bag,</span>
						<span className="itemsNum">
							{this.props.cartItems?.length} items
						</span>
					</div>
					{this.props.cartItems.map((obj, i) => (
						<div key={i} className="productDetails">
							<div className="left">
								<p className="name">{obj.product.name}</p>
								<p className="price">
									{
										obj.product.prices[
											this.state.currentyType
										]?.currency.symbol
									}
									{(
										obj.product.prices[
											this.state.currentyType
										]?.amount * +obj.quantity
									).toFixed(2)}
								</p>
								<div className="sizes">
									<img
										src={small}
										alt="small"
										className="small"
									/>
									<img
										src={medium}
										alt="medium"
										className="medium"
									/>
								</div>
							</div>
							<div className="middle">
								<span
									onClick={() =>
										this.props.updateCartPlus(obj.product)
									}
									className="plus">
									<FiPlusSquare />
								</span>
								<span className="quantity">
									{obj.quantity}
								</span>
								<span
									onClick={() =>
										this.props.updateCartMinus(obj.product)
									}
									className="minus">
									<AiOutlineMinusSquare />
								</span>
							</div>
							<div className="right">
								<img
									className="productCartImg"
									src={obj.product.gallery[0]}
									alt="img"
								/>
							</div>
						</div>
					))}
					<div className="checkDetails">
						<div className="total">
							<span className="key">Total</span>
							<div className="value">
								{
									this.props.prices[this.state.currentyType]
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
						<div className="buttons">
							<Link to="/cart">
								<button className="view">VIEW BAG</button>
							</Link>
							<button className="checkout">
								CHECK OUT
							</button>
						</div>
					</div>
				</div>
				<div
					className={`currencyDropdown ${
						this.state.showCurrency ? "display" : ""
					}`}>
					<div className="containerOfOptions">
						{this.props.prices.map((price, i) => (
							<div
								onClick={() => {
									this.setState({
										currentyType: i,
										symbol: price.currency.symbol,
									});
									if (this.props.currentyTypeKnow) {
										this.props.currentyTypeKnow(i);
									} else if (this.props.getCurrentType) {
										this.props.getCurrentType(i);
									} else if (this.props.currencyType) {
										this.props.currencyType(i);
									}
								}}
								className="flex"
								key={i}>
								<span>{price.currency.symbol} </span>
								<span>{price.currency.label}</span>
							</div>
						))}
					</div>
				</div>
			</nav>
		);
	}
}
const mapStateToProps = (state) => {
	return {
		cartItems: state.cartItems,
		pricesArr: state.prices,
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
)(Nav);
