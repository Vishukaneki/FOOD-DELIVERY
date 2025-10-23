import React, { useContext } from 'react'; // Corrected import
import "./Cart.css";
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
// Assuming food_list is also in context, or imported elsewhere.

const Cart = () => {
  const { cartItems, food_list, removeFromCart ,getTotalCartAmount ,URL} = useContext(StoreContext); // Corrected useContext usage
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
        
        {/* Map through the items and render each one with a separator */}
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              // Use a React Fragment to group the row and its line
              <React.Fragment key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={URL+"/images/"+item.image} alt={item.name} />
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
          return null; // It's good practice to return null if the condition is not met
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
              <p>${getTotalCartAmount()===0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount()===0 ? 0: getTotalCartAmount() + 2}</b>
            </div>
            <button>Proceed to Payment</button>
          </div>
          <div className="cart-promocode">
            <div>
              <p>IF you have a promocode , enter it here</p>
              <div className='cart-promocode-input'>
                <input type="text" placeholder='promo-code' />
                <button>Submit</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Cart;