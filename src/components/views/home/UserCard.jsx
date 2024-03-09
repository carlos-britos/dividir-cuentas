import { useEffect, useRef, useState } from "react";
import strings from "../../shared/Strings"

// Modifica el precio de uno de los anfitriones

const UserCard = ({ setHosts, host, partial }) => {
  const inputNumberRef = useRef(0);

  const [ diff, setDiff ] = useState(0) 
  const [ value, setValue ] = useState(0) 

  const handleSetPrice = () => {
    const newValue = parseInt(inputNumberRef.current.value)
    setValue( newValue )
    setHosts((prevHosts) => ({ ...prevHosts, [host]: newValue }));
  }

  // useEffect(() => {
  //   console.log(hosts)
  // }, [value, hosts, setHosts, host])

  useEffect(() => { // Calcula diferencia entre el total y el precio unitario
    setDiff( value - partial )
  }, [partial, value])


  return (
    <div className="user-card">
      <input className="name" placeholder={ strings.new_user } type="text" />

      <div className="price">
        $
        <input className="price__input" placeholder="0" ref={ inputNumberRef } onChange={ handleSetPrice } type="number" />
      </div>

      {/* TODO: Cambiar el label */}
      { diff !== 0 && (
        <div className="diff">
          {/* si es mayor a 0 : Debe recibir $ */}
          { diff > 0 ? (
            <span className="recibe"> Recibe : </span>
          ) : (
            <span className="pay"> Paga : </span>
          )}
          <span>$ { Math.abs(diff) }</span>
        </div>
      )}
    </div>
  )
} 

export { UserCard }