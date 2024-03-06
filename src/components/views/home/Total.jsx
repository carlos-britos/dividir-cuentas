import { useEffect, useState } from "react"
import strings from "../../shared/Strings"

const Total = ({ hosts , guests }) => {
  const [total, setTotal] = useState(0)
  const [partial, setPartial] = useState(0)

  useEffect(() => {
    // TODO: arreglar funcionamiento de la calculadora
    const priceArray = Object.values(hosts);
    
    // Suma todos los precios cada vez que cambian
    const totalSum = priceArray.reduce((acc, price) => acc + price , 0);
    setTotal(totalSum);

    const users = priceArray.length + guests
    const partialPrice = total / users

    setPartial(partialPrice)
    
  }, [hosts, guests])

  return (
    <section>
      <div className="user-list total-section">
        <div className="user-list__header">
          {strings.total} ({ total })
        </div>
        <div className="user-list__body">
          Cada uno paga $({ partial })
        </div>
      </div>
    </section>
  )
}

export { Total }