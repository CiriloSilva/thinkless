import './Modal.css';

export default function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        {/* Arrumar alinhamento */}
        <header><h3>{title}</h3><button onClick={onClose}>✕</button></header>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
