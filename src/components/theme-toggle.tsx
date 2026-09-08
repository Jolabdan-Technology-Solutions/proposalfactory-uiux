import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const KEY = "tpf.theme";

/** Applies the saved theme before React hydrates, so there is no flash. */
export const themeScript = `(function(){try{var t=localStorage.getItem("${KEY}")||"dark";document.documentElement.classList.toggle("light",t==="light");}catch(e){}})();`;

/** Floating light / dark switch, available on every screen. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem(KEY);
    } catch {
      /* ignore */
    }
    const next = saved === "light" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("light", next === "light");
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("light", next === "light");
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-dashed border-wireline bg-card/90 px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground shadow-lg backdrop-blur transition-colors hover:border-accent hover:text-foreground"
    >
      {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
