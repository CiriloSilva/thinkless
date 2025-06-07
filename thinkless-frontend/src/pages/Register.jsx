import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Auth.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/register", { name, email, password });
    alert("Conta criada! Faça login.");
    nav("/login");
  };

  return (
    <div className="auth-wrapper">
      <form className="auth-box" onSubmit={submit}>
        <h2>Cadastrar-se</h2>

        <input
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          placeholder="Email"
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
          Continuar
        </button>

        <p className="switch">
          Já sou cadastrado. <Link to="/login">Quero fazer login!</Link>
        </p>
      </form>
    </div>
  );
}
