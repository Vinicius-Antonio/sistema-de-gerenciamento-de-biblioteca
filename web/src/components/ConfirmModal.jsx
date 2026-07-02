import React from 'react';

export default function ConfirmModal({ isOpen, title, message, confirmText = 'Confirmar', cancelText = 'Cancelar', onConfirm, onCancel, isDanger = false }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}>
      <div className="card modal-card" style={{ maxWidth: '400px', zIndex: 1100 }}>
        <h3 className="modal-title">{title}</h3>
        <p style={{ marginTop: '1rem', marginBottom: '2rem', color: 'var(--text-muted)' }}>
          {message}
        </p>
        <div className="modal-actions">
          <button className="btn" onClick={onCancel}>{cancelText}</button>
          <button 
            className={`btn ${isDanger ? '' : 'btn-primary'}`} 
            style={isDanger ? { background: '#ef4444', color: 'white' } : {}}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
