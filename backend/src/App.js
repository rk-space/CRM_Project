import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./app/routes/AppRoutes";
import ThemeProvider from "./theme/ThemeProvider";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;


