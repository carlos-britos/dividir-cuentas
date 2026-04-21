import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "../reusable/Icon";

const getInitialTheme = () => {
  const saved = localStorage.getItem("theme");
  if (saved) return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const Header = () => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => {
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <header className="app-header">
      <div className="app-header__brand">
        <span className="app-header__name-bold">Dividir</span>
        <span className="app-header__name-light">Cuentas</span>
      </div>
      <button
        className="app-header__theme-toggle"
        onClick={toggleTheme}
        aria-label={
          theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
        }
        type="button"
      >
        {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      </button>
    </header>
  );
};

export { Header };
