import React, { useEffect, useState } from 'react';
import { StoreContext } from './StoreContext'; // Import the context
import axios from 'axios';

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = React.useState({});
    const URL = "http://localhost:4000";
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({
                ...prev,
                [itemId]: 1
            }));
        } else {
            setCartItems((prev) => ({
                ...prev,
                [itemId]: prev[itemId] + 1
            }));
        }
        if (token) {
            await axios.post(`${URL}/api/cart/add`, { itemId }, {
                headers: { token: token }
            });
        }
    };

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => {
            const newCart = { ...prev };
            if (newCart[itemId] > 1) {
                newCart[itemId] -= 1; // Decrease count
            } else {
                delete newCart[itemId]; // Remove item
            }
            // --- FIX 1: Return the new state ---
            return newCart;
        });

        if (token) {
            await axios.post(`${URL}/api/cart/remove`, { itemId }, {
                headers: { token: token }
            });
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                
                // --- FIX 2: Check if itemInfo exists before using it ---
                if (itemInfo) {
                    totalAmount += cartItems[item] * itemInfo.price;
                }
            }
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        const response = await axios.get(`${URL}/api/food/list`);
        setFoodList(response.data.data);
    }

    // --- FIX 3: Function to load cart from DB ---
    const loadCartData = async (token) => {
        try {
            const response = await axios.post(URL + "/api/cart/get", {}, { headers: { token } });
            setCartItems(response.data.cartData);
        } catch (error) {
            console.error("Error loading cart data:", error);
            // Handle error, e.g., clear cart if token is invalid
        }
    }

    useEffect(() => {
        async function loadData() {
            await fetchFoodList(); // Load food
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
                // --- FIX 3: Load user's cart after setting token ---
                await loadCartData(storedToken);
            }
        }
        loadData();
    }, []); // Runs once on app load

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        URL, token, setToken,
        loadCartData // You might need this for login/logout
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;