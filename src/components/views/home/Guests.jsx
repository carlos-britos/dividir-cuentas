import { AddIcon, Icon, RemoveIcon } from "../../reusable/Icon"
import strings from "../../shared/Strings"

const Guests = ({ guests, setGuests }) => {

  const removeGuest = () => {
    if ( guests !== 0 ) {
      setGuests( guests - 1 )
    }
  }

  const addGuest = () => {
    setGuests( guests + 1 )
  }
  
  return (
    <section>
      <div className="user-list invitados-section">
        <div className="user-list__header">
          <div className="">
            <b>{ guests } </b>
            {strings.guests}
          </div>

          {/* <div className="add-new-user" onClick={() => handleNewUser(newId)}> */}
          <div className="remove-guest" onClick={removeGuest}>
            <Icon iconSvg={<RemoveIcon />} />
          </div>
          <div className="add-guest" onClick={addGuest}>
            <Icon iconSvg={<AddIcon />} />
          </div>
        </div>
        <div className="user-list__body">
        </div>
      </div>
    </section>
  )
}

export { Guests }