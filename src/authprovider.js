import { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const token = Cookies.get("token");
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

      Cookies.set("token", token, { expires: 1 });
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser({ token });

      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Authorisation error:", error);
      message.error(error.response.data.message);
    }
  };
  const signup = async (email, username, name, lastname, password, phone, profile, gender, role, navigate, message) => { 
    // logout(navigate);
    const userData = {
      email: email,
      username: username,
      name: name,
      last_name: lastname,
      password: password,
      phone: phone,
      profile_picture: profile,
      gender: gender,
      role: role
    };

    try {
      const response = await axios.post("/newuser", userData);

      const { token } = response.data;
      Cookies.set("token", token, { expires: 1 });
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser({ token });
      navigate("/");
      message.success("User registered successfully!");
    } catch (error) {
      console.error("Error sending POST request:", error);
      message.error("Error during registration.");
    }
  };

  const logout = (navigate) => {
    delete axios.defaults.headers.common["Authorization"];
    Cookies.remove("token");
    setUser(null);

    navigate("/");
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
