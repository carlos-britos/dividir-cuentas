import { useEffect, useState } from "react"
import { Icon, AddIcon } from "../../reusable/Icon"
import strings from "../../shared/Strings"

const Hosts = ({ hosts, setHosts }) => {
  const [newId, setNewId] = useState(1)
  const [hostsArray, setHostsArray] = useState([])


  useEffect(() => {
    // Array de precios
    const keysArray = Object.keys(hosts);
    setHostsArray(keysArray)
  }, [hosts])


  const handleNewUser = () => {
    // Agarrar el objeto de y agregarle un id y el precio 0
    setHosts((prevHosts) => ({ ...prevHosts, [newId]: 0 }));

    // Se modifica el id para el proximo user
    setNewId(newId + 1)
  }

  // Modifica el precio de uno de los anfitriones
  const handleSetPrice = (element, host) => {
    const value = parseInt(element.value)
    setHosts((prevHosts) => ({ ...prevHosts, [host]: value }));
  }

  return (
    <section>
      <div className="user-list anfitriones-section">
        <div className="user-list__header">
          <div className="">
            <b>{hostsArray.length} </b>
            {strings.hosts}
          </div>

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