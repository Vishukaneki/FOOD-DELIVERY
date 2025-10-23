import React from 'react';
import { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import './MyOrders.css';
// Import a parcel icon or any other asset you want to use
// import { assets } from '../../assets/assets'; 

const MyOrders = () => { // Renamed to MyOrders to match CSS
    const { URL, token } = useContext(StoreContext);
    const [data, setData] = useState([]);

    const fetchOrders = async () => {
        try {
            // Fix 1: Corrected axios.get syntax
            const response = await axios.get(`${URL}/api/order/userorders`, {
                headers: { token: token }
            });
            setData(response.data.data);
            console.log(response.data.data);
        } catch (error) {
            // Fix 2: Added error handling
            console.error("Error fetching orders:", error);
            // Optionally: alert("Failed to fetch orders.");
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    // Fix 3: Added UI to display the orders
    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            <div className="container">
                {data.length === 0 ? (
                    <p>You have no orders.</p>
                ) : (
                    data.map((order, index) => (
                        <div key={index} className='my-orders-order'>
                            {/* <img src={assets.parcel_icon} alt="" /> */}
                            <p className='my-orders-items'>
                                {order.items.map((item, itemIndex) => {
                                    // Display item name and quantity
                                    let itemString = `${item.name} x ${item.quantity}`;
                                    // Add a comma if it's not the last item
                                    if (itemIndex < order.items.length - 1) {
                                        itemString += ", ";
                                    }
                                    return <span key={itemIndex}>{itemString}</span>;
                                })}
                            </p>
                            <p className='my-orders-amount'>${order.amount}.00</p>
                            <p>Items: {order.items.length}</p>
                            <p className='my-orders-status'>
                                <span style={{ color: "red" }}>&#x25cf;</span> {/* Red dot */}
                                <b>{order.status}</b>
                            </p>
                            <button onClick={fetchOrders} className='my-orders-track-btn'>
                                Track Order
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default MyOrders;