import "./App.css";
import Navbar from "./components/Navbar";

import Landing from "./components/Landing";
import {Route,Routes} from "react-router-dom"
import UserSignup from "./components/UserSignup";
import UserLogin from "./components/UserLogin"
import AdminSignup from "./components/AdminSignup"
import AdminLogin from "./components/AdminLogin"
import AdminDashBoard from "./components/AdminDashBoard";
import CreateCourse from "./components/CreateCourse";
import UserDashBoard from "./components/UserDashBoard";
import Success from "./components/Success";
import Cancel from "./components/Cancel";
import UserPurchasedCourses from "./components/UserPurchasedCourses";

function App() {
  return (
    <>

      
          
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing/>}/>
            <Route path="/signup" element={<UserSignup/>}/>
            <Route path="/login" element={<UserLogin/>}/>
            <Route path="/purchasedCourses" element={<UserPurchasedCourses/>}/>
            <Route path="/dashboard" element={<UserDashBoard/>}/>
            <Route path="/admin/signup" element={<AdminSignup/>}/>
            <Route path="/admin/login" element={<AdminLogin/>}/>
            <Route path="/admin/dashboard" element={<AdminDashBoard/>}/>
            <Route path="/admin/createcourse" element={<CreateCourse/>}/>
            <Route path="/success" element={<Success/>}/>
            <Route path="/cancel" element={<Cancel/>}/>
          </Routes>
          
   

    </>
  );
}

export default App;
