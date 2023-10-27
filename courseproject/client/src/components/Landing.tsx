import {useEffect} from "react";
import "../styles/Landing.css";
import { navam } from '../../store/atoms/navbaratom';
import { useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import mainpng from "../assets/main.png"


const Landing = () => {
  const navamset = useSetRecoilState(navam)
  useEffect(()=>{ navamset("Landing")},[navamset])
  const navigate = useNavigate()

 
  return (
    <>
   
    <div className="mbody" style={{ overflow: "hidden",height : "100%" }}>
      <div className="LandCont">
        <div className="LandmCont">
          <div className="Landm1">
            <div className="Landm1-cont">
              <h1>Build your skill to enchnace your career path</h1>
              <div>
                <span style={{ color: "grey", fontSize: "large" }}>
                  The best and largest online course company in india.
                </span>
                <br />
                <span style={{ color: "grey", fontSize: "large" }}>
                  {" "}
                  signup and enjoy our features
                </span>
              </div>
              <div className="landbuttoncont">
                <button
                onClick={()=>{navigate("/login")}}
                  style={{
                    padding: ".8em 2em",
                    backgroundColor: "#3CCAA1",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Get Started
                </button>{" "}
                &nbsp; &nbsp; &nbsp;
                <button
                  style={{
                    padding: ".8em 2em",
                    backgroundColor: "black",
                    color: "white",
                    fontWeight: "bold",
                  }}
                  onClick={()=>{
                    navigate("/admin/login")
                  }}
                >
                  Teach on CourseCo
                </button>
              </div>
            </div>
          </div>
          <div className="Landm2">
            <img  style={{height : "100%"}} src= {mainpng} />
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Landing;
