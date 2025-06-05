import './style.css';
import { Outlet, Link, useLocation } from "react-router-dom";

function Footer() {
  const location = useLocation();
  return (
    <>
     {location.pathname !== "/workoutprogress" && (
       <footer className="footer">
         <div>
           <img src='/img-pack/logo/logo2_white.png' style={{ width: "10%" }} alt="Логотип" />
           <div className="buttonBlock">
             <button>Політика конфіденційності</button>
             <button>Умови користування</button>
             <button>Про нас</button>
             <button>Зв’язатися з нами</button>
             <button>Центр допомоги</button>
           </div>
         </div>

         <div>
           <img src='/img-pack/logo/logo_white.png' alt="Логотип" />
         </div>

         <div>
           <p className='description'>
             Додаток "SportLife" надає широкий спектр можливостей для спортсменів і тренерів.
             Тренери можуть переглядати права для різних груп вправ, стежити за прогресом і підбирати індивідуальні плани тренувань дистанційно.
             У свою чергу спортсмени можуть проходити персоналізовані програми, відстежувати свої результати та отримувати зворотний зв’язок у реальному часі.
             Це забезпечить ефективну взаємодію між спортсменами та тренерами задля досягнення їхніх фітнес-цілей.
           </p>
         </div>

         <div>
           <p className="policyText">- © Всі права захищено Octafxt 2024</p>
         </div>
       </footer>
     )}
    </>
  );
}

export default Footer;
