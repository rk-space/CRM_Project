const Modal = ({ children, onClose }) => {
  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0,
      width: "100%", height: "100%",
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "white",
        borderRadius: "8px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        maxWidth: "90vw",
        maxHeight: "90vh",
        overflow: "auto"
      }}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
