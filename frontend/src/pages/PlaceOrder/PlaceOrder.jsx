import React, { useContext, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import './PlaceOrder.css';
import axios from 'axios';
// Removed unused imports: useEffect, useNavigate
// Removed backend import: authMiddleware

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, URL } = useContext(StoreContext);
  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    
    // Fix: Used spread operator to avoid state mutation
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item, quantity: cartItems[item._id] };
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };

    try {
      let response = await axios.post(`${URL}/api/order/place`, orderData, { headers: { token: token } });
      if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url); // Correct for redirecting to external payment URL
      } else {
        // Improved error handling
        alert(response.data.message || "An error occurred while placing the order.");
      }
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("Error: Could not connect to the server.");
    }
  };

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className='title'>Delivery Information</p>
        <div className='multi-fields'>
          <input required name='first_name' onChange={onChangeHandler} value={data.first_name} type="text" placeholder='First name' />
          <input required name='last_name' onChange={onChangeHandler} value={data.last_name} type="text" placeholder='Last name' />
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
        <div className='multi-fields'>
          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
          <input required name='state' onChange={onChangeHandler} value={data.state} className='state' type="text" placeholder='State' />
        </div>
        <div className='multi-fields'>
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zipcode' />
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
      </div>
      <div className='place-order-right'>
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className='cart-total-details'>
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${2}</p> {/* Consider making this a constant if used elsewhere */}
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount() + 2}</b>
            </div>
            {/* Fix: Changed button to type="submit" to trigger the form's onSubmit */}
            <button type="submit">Checkout</button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default PlaceOrder;