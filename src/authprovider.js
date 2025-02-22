import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser({ token });
    }
  }, []);

  const login = async (email, password, navigate, message) => {
    try {
      const response = await axios.post("/login", {
        email,
        password,
      });
      const { token } = response.data;

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser({ token });

      navigate("/");
    } catch (error) {
      console.error("Authorisation error:", error);
      message.error(error.response.data.message);
    }
  };
  const signup = async (email, username, password, navigate, message) => {
    logout(navigate);
    const userData = {
      email: email,
      username: username,
      password: password,
    };

    console.log("User data:", userData);

    try {
      const response = await axios.post("/newuser", userData);

      const { token } = response.data;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser({ token });

      console.log("Response:", response.data);
      message.success("User registered successfully!");
    } catch (error) {
      console.error("Error sending POST request:", error);
      message.error("Error during registration.");
    }
  };

  const logout = (navigate) => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
