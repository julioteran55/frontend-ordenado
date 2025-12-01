import React from "react";
import "./ModalConfirmar.css";

function ModalConfirmar({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay2">
      <div className="modal-container2">
        <h3>¿Seguro que deseas eliminar esta categoría?</h3>
        <div className="modal-buttons2">
          <button className="btn-eliminar2" onClick={onConfirm}>Eliminar</button>
          <button className="btn-cerrar2" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
export default ModalConfirmar;




