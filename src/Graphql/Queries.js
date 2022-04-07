import { gql } from "@apollo/client";

export const Load_Data = (type) => gql`
	query {
		category(input: { title: "${type}" }) {
			name
			products{
				id 
				name
				inStock
				description
				prices {
				  currency {
					label
					symbol
				  }
				  amount
				}
				gallery
				brand
				category
				attributes{
				  id
				  name
				  type
				  items{
					displayValue
					value
					id
				  }
				}
			  }
		}
	}
`;

export const Load_Product = (id) => gql`
		query {
			product( id: "${id}") {
				id 
				name
				inStock
				description
				prices {
				  currency {
					label
					symbol
				  }
				  amount
				}
				gallery
				brand
				category
				attributes{
				  id
				  name
				  type
				  items{
					displayValue
					value
					id
				  }
				}
			}
		}
	`;
