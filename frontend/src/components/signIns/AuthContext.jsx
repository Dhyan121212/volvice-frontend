import React, { createContext, useState, useEffect } from "react";

// Create the AuthContext
export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);

  // On mount, try to load saved auth info from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedEmployeeId = localStorage.getItem("employeeId");
    if (savedToken && savedEmployeeId) {
      setToken(savedToken);
      setEmployeeId(savedEmployeeId);
    }
  }, []);

  // Login function to save token and employeeId
  const login = (newToken, newEmployeeId) => {
    setToken(newToken);
    setEmployeeId(newEmployeeId);

    localStorage.setItem("token", newToken);
    localStorage.setItem("employeeId", newEmployeeId);
  };

  // Logout function to clear auth data
  const logout = () => {
    setToken(null);
    setEmployeeId(null);

    localStorage.removeItem("token");
    localStorage.removeItem("employeeId");
  };

  return (
    <AuthContext.Provider value={{ token, employeeId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
