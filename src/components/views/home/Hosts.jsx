import { useEffect, useState } from "react"
import { Icon, AddIcon } from "../../reusable/Icon"
import strings from "../../shared/Strings"

const Hosts = ({ hosts, setHosts }) => {
  const [newId, setNewId] = useState(1)

  // Array de ids
  const [hostsArray, setHostsArray] = useState([0])

  const handleNewUser = () => {
    // Agarrar el objeto de y agregarle un id y el precio 0
    setHosts((prevHosts) => ({ ...prevHosts, [newId]: 0 }));

    setHostsArray([...hostsArray , newId])

    // Se modifica el id para el proximo user
    setNewId(newId + 1)
  }

  const handleSetPrice = (element, host) => {
    const value = parseInt(element.value)
    setHosts((prevHosts) => ({ ...prevHosts, [host]: value }));
  }

  return (
    <section>
      <div className="user-list anfitriones-section">
        <div className="user-list__header">
          {/* Se usa newId como contador */}
          {strings.hosts} ({newId})

          <div className="add-new-user" onClick={() => handleNewUser(newId)}>
            <Icon iconSvg={<AddIcon />} />
          </div>
        </div>
        <div className="user-list__body">
          {/* Array de usuarios anfitriones creados por el boton de más */}
          {
            hostsArray.map((host) => (
              <div className="user-card" key={host}>
                <input className="name" placeholder={strings.new_user} type="text" />

                <div className="price">
                  $
                  <input className="price__input" placeholder={ hosts[host] } onChange={(e) => handleSetPrice(e.target, host)} type="number" />
                </div>
              </div>  
            ))
          }
        </div>
      </div>
    </section>
  )
}

export { Hosts }