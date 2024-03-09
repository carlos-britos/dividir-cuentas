import { useEffect, useState } from "react"
import strings from "../../shared/Strings"

const Total = ({ hosts , guests, partial, setPartial }) => {
  const [total, setTotal] = useState(0)
  const [arrayHosts, setArrayHosts] = useState([])
  const [users, setUsers] = useState(0)

  useEffect(() => {
    // Array de precios
    setArrayHosts(Object.values(hosts))
  }, [hosts])

  useEffect(() => {
    // Suma todos los precios cada vez que cambian
    const totalSum = arrayHosts.reduce((acc, price) => acc + price , 0);
    setTotal(totalSum);
  }, [arrayHosts])

  useEffect(() => {
    // Suma anfitriones e invitados
    const usersCount = arrayHosts.length + guests
    setUsers( usersCount )

    // Divide cuanto paga cada uno
    const partialPrice = usersCount !== 0 ? Math.floor(total / usersCount) : 0;
    
    setPartial(partialPrice)
  }, [total, arrayHosts, guests, setPartial, setUsers])

  return (
    <section>
      <div className="user-list total-section">
        <div className="user-list__header">
          <div className="">
            <b>{ users } </b>
            { strings.total } 
          </div>
          <b>
            $ { total.toLocaleString() }
          </b>
        </div>
        <div className="user-list__body">
          Cada uno paga $ { partial.toLocaleString() }
        </div>
      </div>
    </section>
  )
}

export { Total }