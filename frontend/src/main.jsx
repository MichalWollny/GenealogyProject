// npm's
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// local files
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <StrictMode>

  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>

  // </StrictMode>,
);
