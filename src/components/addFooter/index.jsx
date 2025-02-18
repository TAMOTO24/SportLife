// import logo from './logo.svg';
import './style.css';
// import { Outlet, Link } from "react-router-dom";
// import "../../img-pack/logo-white.png";

function Footer() {
  return (
    <>
     <footer className="footer">
       <div><img src='./img-pack/logo2_white.png' style={{width: "10%"}} alt="Logo" />
        <div className="buttonBlock">
            <button >Privacy Policy</button>
            <button >Terms of Service</button>
            <button >About Us</button>
            <button >Contact Us</button>
            <button >Help Center</button>
        </div>
        </div> <div><img src='./img-pack/logo_white.png' alt="Logo" /></div>
        <div>
            <p className='description'>
                The "SportLife" add-on provides a wide range of options for athletes and coaches. 
                Trainers can review the rights for different groups of exercises, monitor their progress and select individual training plans, 
                separated at a distance. Trainers, in their own right, can create personalized programs, monitor the results of their students and give feedback in real time. 
                This will ensure effective interaction between athletes and coaches, aligned with the achievement of their fitness goals.
            </p>
        </div>
        
        <div><p className="policyText">- © Copyright Octafxt 2024</p></div>
    </footer>
    </>
  );
}

export default Footer;
