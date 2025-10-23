import React, { useEffect } from 'react';
import './Verify.css';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Verify = () => {
    // 1. Read the status from the URL
    const [searchParams] = useSearchParams();
    const success = searchParams.get('success');
    
    const navigate = useNavigate();

    // 2. Automatically redirect the user after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            if (success === "true") {
                navigate('/myorders');
            } else {
                navigate('/');
            }
        }, 3000); // 3-second delay

        // Cleanup the timer if the component unmounts
        return () => clearTimeout(timer);
    }, [success, navigate]); // Dependencies

    // 3. Show a spinner and a message
    return (
        <div className='verify'>
            <div className="spinner"></div>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                {success === "true" ? (
                    <>
                        <h2>Payment Successful!</h2>
                        <p>Your order is being processed. Redirecting to your orders...</p>
                    </>
                ) : (
                    <>
                        <h2>Payment Failed or Cancelled.</h2>
                        <p>Redirecting to the homepage...</p>
                    </>
                )}
            </div>
        </div>
    );
}

export default Verify;