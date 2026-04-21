import { AddIcon, Icon, RemoveIcon } from "../../reusable/Icon";
import strings from "../../shared/Strings";

const Guests = ({ guests, setGuests }) => {
  const removeGuest = () => {
    if (guests > 0) {
      setGuests(guests - 1);
    }
  };

  const addGuest = () => {
    setGuests(guests + 1);
  };

  return (
    <section>
      <div className="user-list participants-section">
        <div className="user-list__header">
          <div>
            <b>{guests} </b>
            {strings.participants}
          </div>
          <button
            className="remove-guest"
            onClick={removeGuest}
            aria-label="Quitar participante"
            type="button"
            disabled={guests === 0}
          >
            <Icon iconSvg={<RemoveIcon />} />
          </button>
          <button
            className="add-guest"
            onClick={addGuest}
            aria-label="Agregar participante"
            type="button"
          >
            <Icon iconSvg={<AddIcon />} />
          </button>
        </div>
      </div>
    </section>
  );
};

export { Guests };
