import { useState } from "react";
import api from "../services/api";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "../constants/categories";

export default function ModalForm({ type, onSaved }) {
  const blank = {
    title: "",
    amount: "",
    category: type === "INCOME" ? "SALARIO" : "MORADIA",
    isRecurring: false,
    endDate: "",
  };
  const [data, setData] = useState(blank);

  const options =
    type === "INCOME"
      ? INCOME_CATEGORIES
      : type === "EXPENSE"
      ? EXPENSE_CATEGORIES
      : [{ value: "INVEST", label: "Investimento" }];

  const save = async () => {
    await api.post("/transactions", {
      ...data,
      type,
      amount: parseFloat(data.amount),
    });
    setData(blank);          // limpa formulário
    onSaved();
  };

  return (
    <>
      <input
        placeholder="Título"
        value={data.title}
        onChange={(e) => setData({ ...data, title: e.target.value })}
      />
      <input
        placeholder="Valor"
        value={data.amount}
        onChange={(e) => setData({ ...data, amount: e.target.value })}
      />
      <select
        value={data.category}
        onChange={(e) => setData({ ...data, category: e.target.value })}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {type !== "INVESTMENT" && (
        <>
          <label className="rec-label">
            <input
              type="checkbox"
              checked={data.isRecurring}
              onChange={(e) =>
                setData({ ...data, isRecurring: e.target.checked })
              }
            />
            Recorrente
          </label>
          {data.isRecurring && (
            <input
              type="date"
              value={data.endDate}
              onChange={(e) => setData({ ...data, endDate: e.target.value })}
            />
          )}
        </>
      )}

      <button className="primary" onClick={save}>
        Salvar
      </button>
    </>
  );
}
