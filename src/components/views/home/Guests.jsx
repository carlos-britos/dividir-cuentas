import { AddIcon, Icon } from "../../reusable/Icon"
import strings from "../../shared/Strings"

const Guests = () => {
  return (
    <section>
      <div className="user-list anfitriones-section">
        <div className="user-list__header">
          {strings.guests}

          {/* <div className="add-new-user" onClick={() => handleNewUser(newId)}> */}
          <div className="add-new-user">
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