import React, { useContext } from 'react';
import "./Cart.css";
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, URL } = useContext(StoreContext);
  const navigate = useNavigate();

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />

        {/* Suggestion: Added empty cart message */}
        {getTotalCartAmount() === 0 
          ? <p style={{textAlign: 'center', margin: '20px 0'}}>Your cart is empty.</p>
          : food_list.map((item, index) => {
              if (cartItems[item._id] > 0) {
                return (
                  <React.Fragment key={item._id}>
                    <div className="cart-items-title cart-items-item">
                      <img src={URL + "/images/" + item.image} alt={item.name} />
                      <p>{item.name}</p>
                      <p>${item.price}</p>
                      <p>{cartItems[item._id]}</p>
                      <p>${cartItems[item._id] * item.price}</p>
                      <p onClick={() => removeFromCart(item._id)} className='cross'>x</p>
                    </div>
                    <hr />
                  </React.Fragment>
                );
              }
              return null;
            })}
      </div>
      <div className='cart-bottom'>
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className='cart-total-details'>
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
            
            {/* Fix: Added onClick handler to navigate */}
            <button onClick={() => navigate('/order')}>Proceed to Payment</button>
          </div>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, enter it here</p>
            <div className='cart-promocode-input'>
              <input type="text" placeholder='promo-code' />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;