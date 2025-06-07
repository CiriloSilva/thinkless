import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";         /* ①  */
import jwtDecode from "jwt-decode";
import dayjs from "dayjs";
import api from "../services/api";
import Modal from "../components/Modal";
import ModalForm from "../components/ModalForm";
import GoalForm from "../components/GoalForm";
import ManageList from "../components/ManageList";
import "./Dashboard.css";

/* ---------- Helpers ---------- */
const greet = () => {
  const h = new Date().getHours();
  return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
};
const COLORS = {
  SALARIO: "#341462",
  EXTRAS: "#7c8ad7",
  ALUGUEIS: "#2f7f0b",
  MORADIA: "#17b88f",
  TRANSPORTE: "#52251c",
  SAUDE: "#d2332b",
  EDUCACAO: "#e5c90e",
  ASSINATURAS: "#30cdd1",
  ALIMENTACAO: "#f0b722",
  CUIDADOS_PESSOAIS: "#1c6df7",
  OUTROS: "#000",
};
const cap = (s) => s.charAt(0) + s.slice(1).toLowerCase().replace("_", " ");
const group = (list) => {
  const m = {};
  list.forEach((t) => {
    const k = `${t.title}_${t.category}_${t.isRecurring}`;
    m[k] ? (m[k].count += 1) : (m[k] = { ...t, count: 1 });
  });
  return Object.values(m);
};

/* ---------- Dashboard ---------- */
export default function Dashboard() {
  const [txs, setTxs] = useState([]);
  const [sum, setSum] = useState({ INCOME: {}, EXPENSE: {} });
  const [goals, setGoals] = useState([]);
  const [open, setOpen] = useState(null);
  const [incAsc, setIncAsc] = useState(false);
  const [expAsc, setExpAsc] = useState(false);

  const navigate = useNavigate();                          /* ② */

  const user = jwtDecode(localStorage.getItem("token") || "{}");

  /* ---- Fetch ---- */
  const load = async () => {
    const ym = dayjs().format("YYYY-MM");
    const [t, s, g] = await Promise.all([
      api.get("/transactions"),
      api.get("/summary"),
      api.get("/goals?month=" + ym),
    ]);
    setTxs(t.data);
    setSum(s.data);
    setGoals(g.data);
  };
  useEffect(() => { load(); }, []);

  /* ---- Calc do mês ---- */
  const monthInc = Object.values(sum.INCOME).reduce((a, b) => a + b, 0);
  const monthExp = Object.values(sum.EXPENSE).reduce((a, b) => a + b, 0);

  const incList = group(txs.filter((t) => t.type === "INCOME"))
    .sort((a, b) => (incAsc ? a.amount - b.amount : b.amount - a.amount));

  const expEntries = Object.entries(sum.EXPENSE)
    .sort((a, b) => (expAsc ? a[1] - b[1] : b[1] - a[1]));

  /* ---- metas ---- */
  const goalInc = goals.find((g) => g.type === "REVENUE");
  const goalExp = goals.find((g) => g.type === "EXPENSE");

  const metaArr = [
    goalInc && {
      color: "#168039",
      current: monthInc,
      target: goalInc.amount,
      label: "Meta de Receitas",
    },
    goalExp && {
      color: "#d2332b",
      current: monthExp,
      target: goalExp.amount,
      label: "Meta de Despesas",
    },
  ].filter(Boolean);

  return (
    <div className="dash">
      {/* ---------- HEADER ---------- */}
      <header className="dash-header">
        <div className="wrap">
          <div className="logo">● Thinkless</div>
          <div className="icons">
            ❓ ⚙️
            <span
              style={{ cursor: "pointer" }}
              onClick={() => {
                localStorage.removeItem("token");
                window.location = "/login";
              }}
            >
              🚪
            </span>
          </div>
        </div>
      </header>

      {/* ---------- MAIN ---------- */}
      <main className="dash-container">
        {/* welcome card */}
        <section className="welcome-card">
          {/* esquerda */}
          <div>
            <p className="small">{greet()},</p>
            <h2>{user.name || "Usuário"}!</h2>
            <div className="mini-stats">
              <button className="mini-btn">
                <span>receita mensal</span>
                <strong>R$ {monthInc.toFixed(2)}</strong>
              </button>
              <button className="mini-btn">
                <span>despesa mensal</span>
                <strong>R$ {monthExp.toFixed(2)}</strong>
              </button>
              <button className="mini-btn dark">Ver relatórios</button>
            </div>
          </div>

          {/* direita */}
          <div className="quick-block">
            <strong style={{ marginTop: 8, fontSize: 20 }}>Acesso rápido</strong>
            <div className="quick-access">
              <Quick label="Receita"  c="#168039" on={() => setOpen("income")}  />
              <Quick label="Despesa" c="#d2332b" on={() => setOpen("expense")} />
              <Quick label="Metas"   c="#38023B" on={() => setOpen("goal")}    />
              <Quick label="Invest." c="#0077B6" icon="💰" on={() => setOpen("invest")} />
              <Quick label="Cadastros" c="#333" icon="📄" on={() => setOpen("manage")} />
            </div>
          </div>
        </section>

        {/* ---------- GRID 2 × 2 ---------- */}
        <div className="grid-two">
          {/* ---------- Minhas Receitas ---------- */}
          <SortableCard
            title="Minhas receitas"
            asc={incAsc}
            onToggle={() => setIncAsc(!incAsc)}
          >
            <UL data={incList} />
          </SortableCard>

          {/* ---------- HISTÓRICO ---------- */}
          <Card title="Histórico de despesas">
            <UL data={group(txs.filter((t) => t.type === "EXPENSE"))} />
              <More t="EXPENSE" />
          </Card>

          {/* ---------- Meus Gastos ---------- */}
          <SortableCard
            title="Meus gastos nos últimos 30 dias"
            asc={expAsc}
            onToggle={() => setExpAsc(!expAsc)}
          >
            <ul className="list">
              {expEntries.map(([c, v]) => (
                <li key={c}>
                  <span className="dot" style={{ background: COLORS[c] || "#666" }}></span>
                  {cap(c)}
                  <span className="right">R$ {v.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </SortableCard>

          {/* ---------- METAS ---------- */}
          <Card title={`Metas de ${dayjs().format("MMMM").replace(/^./, c=>c.toUpperCase())}`}>
            {metaArr.length === 0 ? (
              <p style={{ fontSize: 14 }}>
                Nenhuma meta definida. Utilize o botão <strong>Metas</strong> no acesso rápido.
              </p>
            ) : (
              metaArr.map((m, i) => <Progress key={i} {...m} />)
            )}
          </Card>
        </div>
      </main>

      {/* ---------- FOOTER ---------- */}
      <footer className="app-footer">
        <div className="wrap">
          <div className="logo">● Thinkless</div>
          <small>©2025 Thinkless Tecnologia Ltda.</small>
        </div>
      </footer>

      {/* ---------- MODAIS ---------- */}
      <Modal open={open === "income"} title="Nova receita"  onClose={() => setOpen(null)}>
        <ModalForm type="INCOME" onSaved={() => { setOpen(null); load(); }} />
      </Modal>

      <Modal open={open === "expense"} title="Nova despesa" onClose={() => setOpen(null)}>
        <ModalForm type="EXPENSE" onSaved={() => { setOpen(null); load(); }} />
      </Modal>

      <Modal open={open === "invest"} title="Novo investimento" onClose={() => setOpen(null)}>
        <ModalForm type="INVESTMENT" onSaved={() => { setOpen(null); load(); }} />
      </Modal>

      <Modal open={open === "goal"} title="Nova meta" onClose={() => setOpen(null)}>
        <GoalForm
          onSaved={(g) => {
            setOpen(null);
            setGoals((prev) => [...prev.filter((x) => x.type !== g.type), g]);
          }}
        />
      </Modal>

      <Modal open={open === "manage"} title="Cadastros" onClose={() => setOpen(null)}>
        <ManageList
          transactions={txs}
          onDelete={async (id) => {
            await api.delete("/transactions/" + id);
            load();
          }}
        />
      </Modal>
    </div>
  );
}

/* ---------- Aux ---------- */
const UL = ({ data }) => (
  <ul className="list">
    {data.slice(0, 10).map((t) => (
      <li key={t.id}>
        <span className="dot" style={{ background: COLORS[t.category] || "#666" }}></span>
        {t.title}
        <span className="right">
          R$ {t.amount.toFixed(2)}
          {t.count > 1 && <small>{t.count}x</small>}
        </span>
      </li>
    ))}
  </ul>
);

const Card = ({ title, children }) => (
  <div className="card">
    <h3>{title}</h3>
    {children}
  </div>
);

const SortableCard = ({ title, asc, onToggle, children }) => (
  <Card
    title={
      <div className="card-title">
        {title}
        <button className="sort-btn" onClick={onToggle}>
          {asc ? "▲" : "▼"}
        </button>
      </div>
    }
  >
    {children}
  </Card>
);

const Quick = ({ label, c, on, icon }) => (
  <div className="quick-item" onClick={on}>
    <div className="circle" style={{ color: c }}>{icon || "+"}</div>
    <span>{label}</span>
  </div>
);

const More = ({ t }) => {
  const navigate = useNavigate();
  return (
    <button className="link-btn" onClick={() => navigate(`/list?type=${t}`)}>
      Ver mais detalhes
    </button>
  );
};

const Progress = ({ color, current, target, label }) => {
  const pct = target ? Math.min(100, (current / target) * 100) : 0;
  return (
    <div className="goal-row">
      <div className="bar" style={{ "--c": color, "--pct": pct + "%" }}></div>
      <span className="label">{label}</span>
      <span className="pct">{pct.toFixed(0)}%</span>
      <span className="value">R$ {target}</span>
    </div>
  );
};
