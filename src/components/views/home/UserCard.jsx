import { useEffect, useState } from "react";
import { CloseIcon } from "../../reusable/Icon";
import strings from "../../shared/Strings";

const UserCard = ({
  setHosts,
  host,
  partial,
  onRemove,
  canRemove,
  initialPrice = 0,
  initialName = "",
}) => {
  const [payersCount, setPayersCount] = useState(0);
  const [rest, setRest] = useState(0);
  const [diff, setDiff] = useState(0);
  const [value, setValue] = useState(initialPrice);
  const [inputText, setInputText] = useState(
    initialPrice > 0 ? String(initialPrice) : "",
  );
  const [name, setName] = useState(initialName);

  const handleSetPrice = (e) => {
    const raw = e.target.value;
    setInputText(raw);
    const newValue = parseInt(raw) || 0;
    setValue(newValue);
    setHosts((prev) => ({
      ...prev,
      [host]: { ...prev[host], price: newValue },
    }));
  };

  const handleSetName = (e) => {
    const newName = e.target.value;
    setName(newName);
    setHosts((prev) => ({ ...prev, [host]: { ...prev[host], name: newName } }));
  };

  const handleKeyDown = (e) => {
    if (["e", "E", "-", "+", "."].includes(e.key)) {
      e.preventDefault();
    }
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
        placeholder={strings.new_payer}
        type="text"
        value={name}
        onChange={handleSetName}
        aria-label="Nombre del pagador"
      />

      <div className="price">
        $
        <input
          className="price__input"
          placeholder="0"
          value={inputText}
          onChange={handleSetPrice}
          onKeyDown={handleKeyDown}
          type="number"
          min="0"
          step="1"
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
