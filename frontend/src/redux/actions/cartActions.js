import { ADD_TO_CART } from "../actionTypes/actionTypes";
import axios from "axios";

export const addToCart = (productId, quantity) => async (dispatch) => {
  // console.log(productId);
  // console.log(quantity);
  const { data } = await axios.get(`/api/products/get-one/${productId}`);
  dispatch({
    type: ADD_TO_CART,
    payload: {
      productID: data._id,
      name: data.name,
      price: data.price,
      image: data.images[0] ?? null,
      count: data.count,
      quantity,
    },
  });
};
