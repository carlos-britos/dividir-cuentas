import { useEffect, useState } from "react"
import { Icon, AddIcon } from "../../reusable/Icon"
import strings from "../../shared/Strings"
import { UserCard } from "./UserCard"

const Hosts = ({ hosts, setHosts, partial }) => {
  const [newId, setNewId] = useState(1)
  const [hostsArray, setHostsArray] = useState([])


  useEffect(() => { //Crear array con las llaves del objeto
    // Array de precios
    const keysArray = Object.keys(hosts);
    setHostsArray(keysArray)
  }, [hosts])

  const handleNewUser = () => {
    // Agarrar el objeto de hosts y agregarle un id y el precio 0
    setHosts((prevHosts) => ({ ...prevHosts, [newId]: 0 }));

    // Se modifica el id para el proximo user
    setNewId(newId + 1)
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
              <UserCard key={host} setHosts={setHosts} host={host} partial={partial} />
            ))
          }
        </div>
      </div>
    </section>
  )
}

export { Hosts }