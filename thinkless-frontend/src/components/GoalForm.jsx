import { useState } from "react";
import dayjs from "dayjs";
import api from "../services/api";

export default function GoalForm({ onSaved }) {
  const [type, setType] = useState("REVENUE");
  const [amount, setAmount] = useState("");

  const save = async () => {
    if (!amount) return;

    const firstDay = dayjs().startOf("month").toDate();   // 1º dia do mês, tipo Date

    // grava meta
    const res = await api.post("/goals", {
      type,
      amount: parseFloat(amount),
      monthYear: firstDay,        // backend usa new Date(monthYear)
    });

    setAmount("");
    onSaved(res.data);            // devolve meta criada ao Dashboard
    };

  return (
    <>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="REVENUE">Receita</option>
        <option value="EXPENSE">Despesa</option>
      </select>

      <input
        placeholder="Valor (R$)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button className="primary" onClick={save}>
        Salvar
      </button>
    </>
  );
}
