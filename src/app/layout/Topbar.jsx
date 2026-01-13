import { useContext } from "react";
import { ThemeContext } from "../../theme/ThemeProvider";

const Topbar = () => {
  const { toggleTheme } = useContext(ThemeContext);

  return (
    <div
      style={{
        height: "56px",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
      }}
    >
      <strong>ERP System</strong>

      <button onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
};

export default Topbar;
