const ConfirmDialog = ({ isOpen, message, onYes, onNo }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0,
      width: "100%", height: "100%",
      background: "rgba(0,0,0,0.5)"
    }}>
      <div style={{
        background: "white",
        width: "300px",
        margin: "150px auto",
        padding: "16px",
        textAlign: "center"
      }}>
        <p>{message}</p>
        <button onClick={onYes}>Yes</button>
        <button onClick={onNo}>No</button>
      </div>
    </div>
  );
};

export default ConfirmDialog;
