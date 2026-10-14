import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
// Retire only this portfolio's legacy caches and workers, leaving unrelated origin data alone.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then((registrations) =>
      Promise.all(
        registrations
          .filter((r) =>
            [r.active, r.waiting, r.installing].some(
              (w) => w && new URL(w.scriptURL).pathname === "/sw.js",
            ),
          )
          .map((r) => r.unregister()),
      ),
    )
    .catch(() => {});
}
if ("caches" in window)
  caches
    .keys()
    .then((keys) =>
      Promise.all(
        keys
          .filter((k) => /^lidldev-(portfolio|static|dynamic)-/.test(k))
          .map((k) => caches.delete(k)),
      ),
    )
    .catch(() => {});
createRoot(document.getElementById("root")!).render(<App />);
