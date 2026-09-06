import { createContext, useState, useEffect } from 'react';

//authentication data
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  //check if we have already token from the last connection
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [email, setEmail] = useState(localStorage.getItem('email'));

  //after successful login/register
  const login = (newToken, newRole, newEmail) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole);
    localStorage.setItem('email', newEmail);
    setToken(newToken);
    setRole(newRole);
    setEmail(newEmail);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    setToken(null);
    setRole(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}