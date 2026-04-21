import { useEffect, useState } from "react";
import { CloseIcon } from "../../reusable/Icon";
import strings from "../../shared/Strings";

const formatNumber = (n) => (n > 0 ? n.toLocaleString("es-AR") : "");
const parseFormattedNumber = (str) => parseInt(str.replace(/\D/g, "")) || 0;

const UserCard = ({
  setHosts,
  host,
  partial,
  onRemove,
  canRemove,
  initialPrice = 0,
  initialName = "",
  isFirstVisit,
  onInteraction,
}) => {
  const [payersCount, setPayersCount] = useState(0);
  const [rest, setRest] = useState(0);
  const [diff, setDiff] = useState(0);
  const [value, setValue] = useState(initialPrice);
  const [inputText, setInputText] = useState(formatNumber(initialPrice));
  const [name, setName] = useState(initialName);

  useEffect(() => {
    setValue(initialPrice);
    setInputText(formatNumber(initialPrice));
  }, [initialPrice]);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const handleSetPrice = (e) => {
    const raw = e.target.value;
    const numeric = parseFormattedNumber(raw);
    setValue(numeric);
    setInputText(formatNumber(numeric));
    setHosts((prev) => ({
      ...prev,
      [host]: { ...prev[host], price: numeric },
    }));
    if (numeric > 0 && onInteraction) onInteraction();
  };

  const handleSetName = (e) => {
    const newName = e.target.value;
    setName(newName);
    setHosts((prev) => ({ ...prev, [host]: { ...prev[host], name: newName } }));
    if (newName && onInteraction) onInteraction();
  };

  const handleKeyDown = (e) => {
    if (["-", "+"].includes(e.key)) e.preventDefault();
  };

  useEffect(() => {
    setDiff(value - partial);
  }, [partial, value]);

  useEffect(() => {
    if (partial <= 0) {
      setPayersCount(0);
      setRest(0);
      return;
    }
    const payers = diff / partial;
    const payersFloor = Math.floor(payers);
    setPayersCount(payersFloor);

    if (payers % 1 !== 0) {
      setRest(diff - payersFloor * partial);
    } else {
      setRest(0);
    }
  }, [diff, partial]);

  return (
    <div className="user-card">
      {canRemove && (
        <button
          className="user-card__remove"
          onClick={() => onRemove(host)}
          aria-label="Eliminar pagador"
          type="button"
        >
          <CloseIcon />
        </button>
      )}

      <input
        className="name"
        placeholder={
          isFirstVisit ? strings.placeholder_name_hint : strings.new_payer
        }
        type="text"
        value={name}
        onChange={handleSetName}
        aria-label="Nombre del pagador"
      />

      <div className="price">
        $
        <input
          className="price__input"
          placeholder={isFirstVisit ? strings.placeholder_price_hint : "0"}
          value={inputText}
          onChange={handleSetPrice}
          onKeyDown={handleKeyDown}
          type="text"
          inputMode="numeric"
          aria-label="Monto pagado"
        />
      </div>

      {diff !== 0 && (
        <>
          <div className="diff">
            {diff > 0 ? (
              <span className="recibe">{strings.receives}: </span>
            ) : (
              <span className="pay">{strings.owes}: </span>
            )}
            <span>$ {Math.abs(diff).toLocaleString()}</span>
          </div>

          {payersCount > 0 && (
            <div className="payers">
              {payersCount > 1
                ? strings.should_pay_plural
                : strings.should_pay_singular}
              : {payersCount}{" "}
              {payersCount > 1 ? strings.people : strings.person}
              {rest > 0 && ` + $${rest.toLocaleString()}`}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export { UserCard };
