import React, { useEffect, useState } from 'react';
import assets from '../../assets/assets.js';
import './Add.css';
import axios from 'axios';
import { toast } from 'react-toastify';
const Add = ({URL}) => {
    // 1. Renamed URL to backendUrl to avoid conflict
    const backendUrl = URL;
    // 2. Changed initial state to null (more conventional than false)
    const [image, setImage] = useState(null); 
    const [data, setData] = useState({
        name: "",
        description: "",
        category: "Salad",
        price: ""
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    // This useEffect is great for debugging
    useEffect(() => {
        console.log(data);
    }, [data]);

    const onsubmitHandler = async (event) => {
        event.preventDefault();
        
        const formData = new FormData();
        formData.append('image', image);
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('category', data.category);
        formData.append('price', Number(data.price));

        // 3. Added try...catch block for error handling
        try {
            const response = await axios.post(`${backendUrl}/api/food/add`, formData);
            
            if (response.data.success) {
                setData({
                    name: "",
                    description: "",
                    category: "Salad",
                    price: ""
                });
                setImage(null);
               toast.success('Product added successfully!');
            } 
        } catch (error) {
            // 5. Added alert for network/server errors
            console.error("Error adding product:", error);
            toast.error('An error occurred while adding the product.');
        }
    };

    return (
        <div className='add'>
            <form className='flex-col' onSubmit={onsubmitHandler}>
                <div className='add-img-upload flex-col'>
                    <p>Upload image</p>
                    <label htmlFor="image">
                        {/* 6. This now works because 'URL' is the browser's object */}
                        <img src={image ? window.URL.createObjectURL(image) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required />
                </div>
                <div className="add-product-name flex-col">
                    <p>product name</p>
                    <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type here' required />
                </div>
                <div className="add-product-description flex-col">
                    <p>product description</p>
                    <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder='write here' required></textarea>
                </div>
                <div className="add-category-price">
                    <div className="add-category flex-col">
                        <p>product category</p>
                        <select onChange={onChangeHandler} value={data.category} name="category">
                            <option value="Salad">Salad</option>
                            <option value="Rolls">Rolls</option>
                            <option value="Deserts">Deserts</option>
                            <option value="Sandwich">Sandwich</option>
                            <option value="Cake">Cake</option>
                            <option value="Pure Veg">Pure veg</option>
                            <option value="Pasta">Pasta</option>
                            <option value="Noodles">Noodles</option>
                        </select>
                    </div>
                    <div className="add-price flex-col">
                        <p>Product price</p>
                        <input onChange={onChangeHandler} value={data.price} type="number" name="price" placeholder='$20' required />
                    </div>
                </div>
                <button type='submit' className='add-btn'>Add</button>
            </form>
        </div>
    );
};

export default Add;