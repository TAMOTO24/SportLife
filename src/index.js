import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InfPage from './components/addInfPage/index'; 
import Home from './components/addHomePage/index'; 
import Header from './components/addHeader/index'; 

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Header />} >
          <Route index element={<Home />} />
          <Route path="infpage" element={<InfPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
