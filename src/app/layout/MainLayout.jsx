import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const MainLayout = ({ children }) => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* LEFT: Sidebar */}
      <Sidebar />

      {/* RIGHT: Topbar + Page */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        <Topbar />

        <div style={{ padding: "16px", flex: 1, overflowY: "auto" }}>
          {children}
        </div>

      </div>
    </div>
  );
};

export default MainLayout;
