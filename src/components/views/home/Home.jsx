import { useState, useEffect, useRef, useCallback } from "react";
import { Hosts } from "./Hosts";
import { Guests } from "./Guests";
import { Total } from "./Total";
import { PaymentFlow } from "./PaymentFlow";
import { ResetIcon, ShareIcon } from "../../reusable/Icon";
import strings from "../../shared/Strings";

const STORAGE_KEY = "dividir-cuentas-state";

const migrateHosts = (hosts) => {
  const migrated = {};
  for (const [id, val] of Object.entries(hosts)) {
    if (typeof val === "number") {
      migrated[id] = { price: val, name: "" };
    } else {
      migrated[id] = val;
    }
  }
  return migrated;
};

const loadState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const hosts = parsed.hosts
        ? migrateHosts(parsed.hosts)
        : { 0: { price: 0, name: "" } };
      return {
        hosts,
        guests: typeof parsed.guests === "number" ? parsed.guests : 0,
        guestNames: parsed.guestNames || {},
      };
    }
  } catch {
    // corrupted data
  }
  return null;
};

const Home = () => {
  const saved = useRef(loadState());
  const [partial, setPartial] = useState(0);
  const [hosts, setHosts] = useState(
    saved.current?.hosts || { 0: { price: 0, name: "" } },
  );
  const [guests, setGuests] = useState(saved.current?.guests || 0);
  const [guestNames, setGuestNames] = useState(saved.current?.guestNames || {});
  const [toast, setToast] = useState(null);
  const saveTimer = useRef(null);

  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ hosts, guests, guestNames }),
      );
    }, 500);
    return () => clearTimeout(saveTimer.current);
  }, [hosts, guests, guestNames]);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleReset = () => {
    if (window.confirm(strings.confirm_reset)) {
      localStorage.removeItem(STORAGE_KEY);
      setHosts({ 0: { price: 0, name: "" } });
      setGuests(0);
      setGuestNames({});
      setPartial(0);
    }
  };

  const handleShare = async () => {
    const hostValues = Object.values(hosts);
    const total = hostValues.reduce((a, b) => a + b.price, 0);
    const lines = hostValues
      .filter((h) => h.price > 0)
      .map(
        (h) => `- ${h.name || "Sin nombre"}: pagó $${h.price.toLocaleString()}`,
      )
      .join("\n");

    const text = `Dividimos cuentas:\nTotal: $${total.toLocaleString()}\nCada uno paga: $${partial.toLocaleString()}\nPersonas: ${hostValues.length + guests}\n\n${lines}\n\nHecho con DividirCuentas`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Dividir Cuentas", text });
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        showToast(strings.copied);
      } catch {
        // clipboard not available
      }
    }
  };

  const isEmpty = Object.keys(hosts).length === 0;
  const hasData = Object.values(hosts).some((v) => v.price > 0) || guests > 0;

  if (isEmpty) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon">💰</div>
        <h1 className="empty-state__title">{strings.empty_title}</h1>
        <p className="empty-state__subtitle">{strings.empty_subtitle}</p>
        <button
          className="empty-state__cta"
          onClick={() => setHosts({ 0: { price: 0, name: "" } })}
          type="button"
        >
          {strings.start}
        </button>
      </div>
    );
  }

  return (
    <>
      <Total
        hosts={hosts}
        guests={guests}
        partial={partial}
        setPartial={setPartial}
      />
      <Hosts hosts={hosts} setHosts={setHosts} partial={partial} />
      <Guests guests={guests} setGuests={setGuests} />

      {hasData && partial > 0 && (
        <PaymentFlow
          hosts={hosts}
          setHosts={setHosts}
          guests={guests}
          guestNames={guestNames}
          setGuestNames={setGuestNames}
          partial={partial}
        />
      )}

      <div className="actions">
        {hasData && (
          <button
            className="actions__btn actions__btn--share"
            onClick={handleShare}
            type="button"
          >
            <ShareIcon />
            {strings.share}
          </button>
        )}
        <button
          className="actions__btn actions__btn--reset"
          onClick={handleReset}
          type="button"
        >
          <ResetIcon />
          {strings.new_split}
        </button>
      </div>

      {toast && (
        <div className="toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </>
  );
};

export { Home };
