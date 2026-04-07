import "../styles/Toast.css";

function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div className="toast-container">
      <div className={`toast-item toast-${toast.type} pixel-card-sm`}>
        <span className="toast-dot"></span>
        <p>{toast.message}</p>
      </div>
    </div>
  );
}

export default Toast;