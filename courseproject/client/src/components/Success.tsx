import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button ,Spinner} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const [sustate, setSustate] = useState(false);
  const [spin,setSpin] = useState(false)
  const data = localStorage.getItem("courseid");
  const token = localStorage.getItem("token");
  const navigate = useNavigate()
  return (
    <><div style={{height : 300 ,display : "flex",alignItems : "center",justifyContent : "center"}}>
    <center >
      <Button 
      marginBottom={10}
        colorScheme="blue"
        onClick={async () => {
          try {
            const response = await axios.post(
              `http://localhost:3000/user/purchaseCourse/${data}`,
              null,
              {
                headers: {
                  Authorization: token,
                },
              }
            );

              setSpin(true)

            if (response.status === 200) {
              setSustate(true);
              setTimeout(()=>{navigate("/dashboard")},3000)
            }
          } catch (err) {
            console.log(err);
          }
        }}
      >
        check Status
      </Button>
      &nbsp;&nbsp;&nbsp;
      <br/>
      <div>
        {sustate
          ? "Payment Successful redirecting to DashBoard Please Wait "
          :null}
      </div>
      <br/>
      <div >
      {spin ? <Spinner /> : null}
      </div>
      </center>
      </div>
    </>
  );
};

export default Success;
