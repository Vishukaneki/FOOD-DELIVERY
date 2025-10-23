import React, { useContext } from 'react'
import './Verify.css'
import {useSearchParams} from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const Verify = () => {
    const [searchParams,setSearchParams] = useSearchParams();
    const success= searchParams.get('success')
    const orderId= searchParams.get('orderId')
    const {URL} = useContext(StoreContext);
    const navigate = useNavigate();
    const verifyPayment = async() =>{
        const response = await axios.post(`${URL}/api/order/verify`,{success,orderId})
        if(response.data.success){
            navigate('/myorders')
        }else{
            navigate('/')
        }
    }
    useEffect(()=>{
    verifyPayment();
    },[])
    console.log(success ,orderId);
  return (
    <div className='verify'>
      <div className="spinner"></div>
    </div>
  )
}

export default Verify
