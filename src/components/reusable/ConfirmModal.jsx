import { useEffect, useRef } from "react";

const ConfirmModal = ({ isOpen, onConfirm, onCancel, title, message }) => {
  const cancelRef = useRef(null);

  useEffect(() => {
    if (isOpen && cancelRef.current) cancelRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-message"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__icon" aria-hidden="true">
          ⚠️
        </div>
        <h2 className="modal__title" id="modal-title">
          {title}
        </h2>
        <p className="modal__message" id="modal-message">
          {message}
        </p>
        <div className="modal__actions">
          <button
            ref={cancelRef}
            className="modal__btn modal__btn--cancel"
            onClick={onCancel}
            type="button"
          >
            Cancelar
          </button>
          <button
            className="modal__btn modal__btn--confirm"
            onClick={onConfirm}
            type="button"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export { ConfirmModal };
