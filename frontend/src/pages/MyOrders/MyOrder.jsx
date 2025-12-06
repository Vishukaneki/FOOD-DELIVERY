import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import './MyOrders.css';

const MyOrders = () => {
    const { URL, token } = useContext(StoreContext);
    const [data, setData] = useState([]);

    const fetchOrders = async () => {
        try {
            // Note: Update this header if you changed your backend to use Bearer tokens
            const response = await axios.get(`${URL}/api/order/userorders`, {
                headers: { token: token } 
            });
            setData(response.data.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            {/* You could add a single refresh button here if you want */}
            {/* <button onClick={fetchOrders}>Refresh</button> */}
            <div className="container">
                {data.length === 0 ? (
                    <p>You have no orders.</p>
                ) : (
                    // FIX 1: Using 'order._id' as the key
                    data.map((order) => ( 
                        <div key={order._id} className='my-orders-order'>
                            {/* <img src={assets.parcel_icon} alt="" /> */}
                            <p className='my-orders-items'>
                                {order.items.map((item, itemIndex) => {
                                    let itemString = `${item.name} x ${item.quantity}`;
                                    if (itemIndex < order.items.length - 1) {
                                        itemString += ", ";
                                    }
                                    return <span key={itemIndex}>{itemString}</span>;
                                })}
                            </p>
                            {/* FIX 2: Using .toFixed(2) for currency */}
                            <p className='my-orders-amount'>${order.amount.toFixed(2)}</p>
                            <p>Items: {order.items.length}</p>
                            <p className='my-orders-status'>
                                <span style={{ color: "red" }}>&#x25cf;</span>
                                <b>{order.status}</b>
                            </p>
                            {/* FIX 3: Removed the confusing button from the loop */}
                            {/* <button>Track Order</button> */}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default MyOrders;