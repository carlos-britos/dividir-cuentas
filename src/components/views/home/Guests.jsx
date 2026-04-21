import { AddIcon, Icon, RemoveIcon } from "../../reusable/Icon";
import strings from "../../shared/Strings";

const Guests = ({ guests, setGuests, isFirstVisit }) => {
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
            {strings.participants}{" "}
            <span className="user-list__count">{guests}</span>
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
        {isFirstVisit && (
          <p className="user-list__hint">{strings.section_hint_participants}</p>
        )}
      </div>
    </section>
  );
};

export { Guests };
