import { useState,useEffect } from "react";
import axios from "axios";
import { Button, Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import successgif from "../assets/success.svg";
import "../styles/success.css"

const Success = () => {
  const navigate = useNavigate();
  const [loadingText, setLoadingText] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText( loadingText => {
        if (loadingText.length === 3) return '';
        return loadingText + '.'; 
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  setTimeout(()=>{
    navigate("/dashboard")
  },6000)
  return (
    <>
      <style>
        {`
        .css-1llqc3d {
          display : none
        }
        `}
      </style>
      
      <div className="sb">
          <div className="sbcont">
            <div className="sbimg">
              <img src={successgif}/>
            </div>
            
             <h1>Payment Received</h1>
             <span>Redirecting to DashBoard Please wait  {loadingText}</span>
           

          </div>
      </div>
    </>
  );
};

export default Success;
