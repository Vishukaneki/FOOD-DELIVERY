import React from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { useState } from 'react'
import { useContext } from 'react'
import axios from 'axios'
import { StoreContext } from '../../context/StoreContext'

const LoginPopup = ({setShowLogin}) => {
    const [currState, setCurrState] = React.useState("login");
    const {URL ,setToken}=useContext(StoreContext);
    
    // 1. Added 'confirmPassword' and fixed 'name' -> 'username'
    const [data, setData]= useState({
        username:"",
        email:"",
        password:"",
        confirmPassword: "" // Added for sign-up
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const onLogin = async(event)=>{
        event.preventDefault();
        
        let newUrl= URL;
        let dataToSend; // We build this to send only what's needed

        if(currState==="login"){
            newUrl+="/api/user/login";
            dataToSend = {
                email: data.email,
                password: data.password
            };
        } else {
            newUrl+="/api/user/register";

            // 2. Add check for password match
            if (data.password !== data.confirmPassword) {
                alert("Passwords do not match!");
                return; // Stop if they don't match
            }

            // 3. Send 'username', not 'name'
            dataToSend = {
                username: data.username,
                email: data.email,
                password: data.password
            };
        }

        // 4. Added try...catch to prevent crashing on errors
        try {
            const response = await axios.post(newUrl, dataToSend);

            if(response.data.success){
                setShowLogin(false);
                setToken(response.data.token);
                localStorage.setItem("token",response.data.token); 
                console.log("Login/Register successful");
            }
            else{
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Login/Register error:", error);
            alert(error.response?.data?.message || "An error occurred. Please try again.");
        }
    }

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className='login-popup-container'>
                <div className='login-popup-title'>
                    <h2>{currState === "login" ? "Login" : "Sign up"}</h2>
                    <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className='login-popup-inputs'>
                    {/* 3. This input uses 'username' and only shows on sign-up */}
                    {currState==='login' ? <></> : <input 
                        name='username' 
                        onChange={onChangeHandler} 
                        value={data.username} 
                        type="text" 
                        placeholder='Your Name' 
                        required
                    />}
                    
                    <input 
                        name='email' 
                        onChange={onChangeHandler} 
                        value={data.email} 
                        type="email" 
                        placeholder='Your Email' 
                        required
                    />
                    <input 
                        type="password" 
                        name='password' 
                        onChange={onChangeHandler} 
                        value={data.password} 
                        placeholder='Password' 
                        required
                    />

                    {/* HERE IS YOUR CHANGE:
                      This 'Confirm Password' input now only appears when currState is NOT 'login'
                    */}
                    {currState==='login' ? <></> : <input 
                        type="password" 
                        name="confirmPassword" // 2. Hooked up to state
                        onChange={onChangeHandler} // 2. Hooked up to state
                        value={data.confirmPassword} // 2. Hooked up to state
                        placeholder='Confirm Password' 
                        required
                    />}
                </div>
                <button type='submit'>{currState === "Sign up" ? "Sign up" : "Login"}</button>
                <div className='login-popup-condition'>
                    <input type="checkbox" required />
                    <p>I agree to the terms and conditions</p>
                </div>
                {currState==='login' 
                    ? <p>Create a new account ? <span onClick={()=>setCurrState("Sign up")}>Click Here</span></p>
                    : <p>Already have an account? <span onClick={()=>setCurrState("login")}>Login here</span></p>
                }
            </form>
        </div>
    )
}

export default LoginPopup