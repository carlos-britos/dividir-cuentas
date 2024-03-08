import { useEffect, useState } from "react"
import strings from "../../shared/Strings"

const Total = ({ hosts , guests }) => {
  const [total, setTotal] = useState(0)
  const [partial, setPartial] = useState(0)
  const [arrayHosts, setArrayHosts] = useState([])

  useEffect(() => {
    // Array de precios
    setArrayHosts(Object.values(hosts))
  }, [hosts, guests])

  useEffect(() => {
    // Suma todos los precios cada vez que cambian
    const totalSum = arrayHosts.reduce((acc, price) => acc + price , 0);
    setTotal(totalSum);
  }, [arrayHosts])

  useEffect(() => {
    // Suma anfitriones e invitados
    const users = arrayHosts.length + guests

    // Divide cuanto paga cada uno
    console.log(users)
    console.log(total)

    const partialPrice = users !== 0 ? total / users : 0;

    setPartial(partialPrice)
  }, [total])

  return (
    <section>
      <div className="user-list total-section">
        <div className="user-list__header">
          <div className="">
            { strings.total } 
          </div>
          <b>
            $ { total }
          </b>
        </div>
        <div className="user-list__body">
          Cada uno paga $ { partial }
        </div>
      </div>
    </section>
  )
}

export { Total }