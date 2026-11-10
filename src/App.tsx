import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/context/ThemeContext";
import { AppRouter } from "@/routes/router";

export default function App() {
  return (
    <ThemeProvider>
      <Toaster position="top-right" richColors closeButton />
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ThemeProvider>
  );
}
