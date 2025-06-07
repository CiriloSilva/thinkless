import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);
      nav("/");
    } catch {
      alert("Login ou senha inválidos");
    }
  };

  return (
    <div className="auth-wrapper">
      <form className="auth-box" onSubmit={submit}>
        <h2>Iniciar sessão</h2>

        <input
          placeholder="Login"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="Senha"
          type="password"
          value={password}
          onChange={(e) => setPass(e.target.value)}
          required
        />

        <button className="primary" type="submit">
          Iniciar sessão
        </button>

        <p className="switch">
          Não possui uma conta? <Link to="/register">Crie uma conta</Link>
        </p>
      </form>
    </div>
  );
}
