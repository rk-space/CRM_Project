const FormSection = ({ title, children }) => {
  return (
    <div style={{ marginBottom: "24px" }}>
      <h3>{title}</h3>
      <hr />
      {children}
    </div>
  );
};

export default FormSection;

