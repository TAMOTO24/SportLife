import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import InfPage from "./components/addInfPage/index";
import Home from "./components/addHomePage/index";
import Header from "./components/addHeader/index";
import AuthPage from "./components/addAuthPage/index";
import { AuthProvider } from "./authprovider";
import Footer from "./components/addFooter/index";
import ProtectedRoute from "./protectedRoot";
import AccountPage from "./components/addAccountPage/index";
import NewsInfoPage from "./components/addNewsInfoPage";
import CreatePostPage from "./components/addCreatePostPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header /> 
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/protected" element={<ProtectedRoute />} /> */} 
          <Route path="/infpage" element={<InfPage />} />
          <Route path="/authpage" element={<AuthPage />} />
          <Route path="/newsandinf" element={<NewsInfoPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/account" element={<AccountPage />} />
            <Route path="/createpost" element={<CreatePostPage />} />
          </Route>
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
