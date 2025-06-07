import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

export default function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  try{
    if(token) jwtDecode(token);       // valida formato
    else throw new Error();
    return children;                  // OK → renderiza dashboard
  }catch{
    return <Navigate to="/login" replace />;
  }
}
