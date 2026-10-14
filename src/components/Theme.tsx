import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
type Choice = "system" | "light" | "dark";
const ThemeContext = createContext<{
  choice: Choice;
  resolved: "light" | "dark";
  setChoice: (v: Choice) => void;
}>({ choice: "system", resolved: "light", setChoice: () => {} });
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [choice, setChoice] = useState<Choice>(() => {
    try {
      const v = localStorage.getItem("lidldev-theme");
      return v === "light" || v === "dark" ? v : "system";
    } catch {
      return "system";
    }
  });
  const [system, setSystem] = useState<"light" | "dark">(() =>
    matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
  );
  const resolved = choice === "system" ? system : choice;
  useEffect(() => {
    const m = matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystem(m.matches ? "dark" : "light");
    m.addEventListener("change", update);
    return () => m.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = resolved;
    document.documentElement.classList.toggle("dark", resolved === "dark");
    document.documentElement.style.colorScheme = resolved;
    try {
      localStorage.setItem("lidldev-theme", choice);
    } catch {
      /* Storage is optional. */
    }
  }, [choice, resolved]);
  return (
    <ThemeContext.Provider value={{ choice, resolved, setChoice }}>
      {children}
    </ThemeContext.Provider>
  );
}
export const useTheme = () => useContext(ThemeContext);
