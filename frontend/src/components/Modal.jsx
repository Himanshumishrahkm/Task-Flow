import { X } from "lucide-react";

export default function Modal({ title, onClose, children, size = "normal" }) {
  return (
    <div className="modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="modal-panel" style={size === "small" ? { maxWidth: 390 } : undefined}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="icon-btn" type="button" onClick={onClose} aria-label="Close modal">
            <X size={19} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}