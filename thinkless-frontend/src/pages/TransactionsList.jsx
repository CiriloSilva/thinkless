import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import api from "../services/api";
import "./TransactionsList.css";

dayjs.locale("pt-br");

/* agrupa itens por AAAA-MM */
const groupByMonth = (arr) => {
  const m = {};
  arr.forEach((t) => {
    const key = dayjs(t.createdAt).format("YYYY-MM");
    (m[key] ||= []).push(t);
  });
  return m;
};

export default function TransactionsList() {
  const type = new URLSearchParams(useLocation().search).get("type") || "EXPENSE";
  const [list, setList] = useState([]);
  const [ascMap, setAscMap] = useState({});            // { "2025-05": true }
  const nav = useNavigate();

  useEffect(() => {
    api.get("/transactions").then((r) => {
      setList(r.data.filter((t) => t.type === type));
    });
  }, [type]);

  const today = dayjs();
  const history = list.filter((t) => dayjs(t.createdAt).isBefore(today.endOf("month")));
  const future = list.filter((t) => dayjs(t.createdAt).isAfter(today.endOf("month")));

  const monthsHist = groupByMonth(history);
  const monthsFuture = groupByMonth(future);

  const toggle = (month) =>
    setAscMap((p) => ({ ...p, [month]: !p[month] }));

  return (
    <>
      <header className="dash-header">
        <div className="wrap"><div className="logo">● Thinkless</div></div>
      </header>

      <main className="tx-container">
        <div className="title-row">
          <h2>Histórico de {type === "INCOME" ? "Receitas" : "Despesas"}</h2>
          <button className="back-btn" onClick={() => nav(-1)}>← Voltar</button>
        </div>

        {/* HISTÓRICO */}
        {Object.entries(monthsHist).map(([month, items]) => (
          <MonthSection
            key={month}
            month={month}
            items={items}
            asc={!!ascMap[month]}
            onToggle={() => toggle(month)}
          />
        ))}

        {/* FUTURAS */}
        {future.length > 0 && (
          <>
            <h2 className="futuras">Despesas Futuras</h2>
            {Object.entries(monthsFuture)
              .sort(([a], [b]) => (dayjs(a).isAfter(dayjs(b)) ? 1 : -1))
              .map(([month, items]) => (
                <MonthSection
                  key={month}
                  month={month}
                  items={items}
                  asc={!!ascMap[month]}
                  onToggle={() => toggle(month)}
                  showDate
                />
              ))}
          </>
        )}
      </main>

      <footer className="app-footer">
        <div className="wrap">
          <div className="logo">● Thinkless</div>
          <small>©2025 Thinkless Tecnologia Ltda.</small>
        </div>
      </footer>
    </>
  );
}

/* ---------- SECTION COMPONENT ---------- */
function MonthSection({ month, items, asc, onToggle, showDate }) {
  const label =
    dayjs(month).format("MMMM YYYY").replace(/^\w/, (c) => c.toUpperCase());

  const sorted = [...items].sort((a, b) =>
    asc ? a.amount - b.amount : b.amount - a.amount
  );

  return (
    <section className="month-section">
      <div className="sub-head">
        <h3>{label}</h3>
        <button className="sort-icon" onClick={onToggle}>
          {asc ? "▲" : "▼"}
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th className="w70">Nome da Despesa</th>
            <th className="w30">Valor (R$)</th>
            {showDate && <th className="w30">Data</th>}
          </tr>
        </thead>
        <tbody>
          {sorted.map((t) => (
            <tr key={t.id}>
              <td>{t.title}</td>
              <td>{t.amount.toFixed(2)}</td>
              {showDate && <td>{dayjs(t.createdAt).format("DD/MM/YYYY")}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
