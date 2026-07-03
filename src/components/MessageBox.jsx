import { useNotification } from "../context/NotificationContext";
import "./MessageBox.css";

export default function MessageBox() {
  const { notifications, removeNotification } = useNotification();

  // لو مفيش رسائل، ما يظهرش حاجة
  if (notifications.length === 0) return null;

  // نجيب أحدث رسالة فقط
  const latest = notifications[0];

  return (
    <div className="message-box-container">
      <div
        key={latest.id}
        className={`message-box message-box-${latest.type}`}
        onClick={() => removeNotification(latest.id)}
      >
        <div className="message-box-icon">
          {latest.type === "success" && "✅"}
          {latest.type === "error" && "❌"}
          {latest.type === "warning" && "⚠️"}
          {latest.type === "info" && "ℹ️"}
        </div>
        <p className="message-box-text">{latest.message}</p>
        <button
          className="message-box-close"
          onClick={(e) => {
            e.stopPropagation();
            removeNotification(latest.id);
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
