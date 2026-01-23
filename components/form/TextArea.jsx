const TextArea = ({ label, value, onChange }) => {
  return (
    <div style={{ marginBottom: "12px" }}>
      <label>{label}</label><br />
      <textarea
        value={value}
        onChange={onChange}
        rows="4"
        style={{ width: "100%", padding: "8px" }}
      />
    </div>
  );
};

export default TextArea;
