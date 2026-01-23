const Select = ({ label, options, value, onChange }) => {
  return (
    <div style={{ marginBottom: "12px" }}>
      <label>{label}</label><br />
      <select value={value} onChange={onChange} style={{ width: "100%", padding: "8px" }}>
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
