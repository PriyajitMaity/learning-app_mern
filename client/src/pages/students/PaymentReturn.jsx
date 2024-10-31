import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { captureAndFinalizePayment } from "@/services";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentReturn = () => {
    const location =useLocation();
    const params =new URLSearchParams(location.search);
    const paymentId =params.get('paymentId');
    const PayerId =params.get('PayerID');
    const navigate =useNavigate();
    
    useEffect(() =>{
        if(paymentId && PayerId){
            async function capturePayment(){
                const orderId =JSON.parse(sessionStorage.getItem("currOrderID"));
                const response =await captureAndFinalizePayment(paymentId, PayerId, orderId);

                 console.log(response)
                if(response?.success){
                    sessionStorage.removeItem("currOrderID");
                    // window.location.href ="/student-courses";
                    navigate('/student-courses');
                }
             }
            capturePayment();
        }
    }, [paymentId, PayerId])

  return (
    <Card>
        <CardHeader>
            <CardTitle>Processing Payment......., Please wait!!</CardTitle>
        </CardHeader>
    </Card>
  );
};

export default PaymentReturn;
