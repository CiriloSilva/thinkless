import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';
import jarImg from '../assets/jar.jpg';

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="landing">
      <header className="landing-header">
        {/* Lembrar de Colocar uma logo */}
        <div className="logo">● Thinkless</div>
        <div>
          <button className="ghost" onClick={() => navigate('/login')}>Login</button>
          <button className="outline" onClick={() => navigate('/register')}>Comece já!</button>
        </div>
      </header>
      <section className="hero">
        <div className="text">
          <h1>Controle financeiro pessoal com praticidade</h1>
          <p>Não perca tempo com planilhas! Organize as suas finanças com o sistema de controle financeiro Thinkless. Tenha o controle de finanças que você sempre quis!</p>
          <button className="primary" onClick={() => navigate('/register')}>Teste agora</button>
        </div>
        <img src={jarImg} alt="jar" className="hero-img" />
      </section>
      <footer className="landing-footer">
        {/* Lembrar de Colocar uma logo */}
        <div>● Thinkless</div>
        <small>©2025 Thinkless Tecnologia Ltda.</small>
        {/* Arrumar isso aq */}
        <small style={{ marginLeft: 'auto' }}>Créditos: Cirilo Silva</small>
      </footer>
    </div>
  );
}
