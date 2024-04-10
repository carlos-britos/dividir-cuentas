import { useEffect, useRef, useState } from "react";
import strings from "../../shared/Strings"

// Modifica el precio de uno de los anfitriones

const UserCard = ({ setHosts, host, partial }) => {
  const inputNumberRef = useRef(0);
  const [ payersCount, setPayersCount ] = useState(0) 
  const [ rest, setRest ] = useState(0) 

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

  useEffect(() => { // Calcula la cantidad de personas que deben pagarle
    const payers = diff / partial

    const payersFloor = Math.floor( payers )

    setPayersCount( payersFloor )

    const is_int = payers % 1 !== 0

    if (is_int) {
      setRest(diff - (payersFloor * partial))
    } else {
      setRest(0)
    }
  }, [ diff, partial ])


  return (
    <div className="user-card">
      <input className="name" placeholder={ strings.new_user } type="text" />

      <div className="price">
        $
        <input className="price__input" placeholder="0" ref={ inputNumberRef } onChange={ handleSetPrice } type="number" />
      </div>

      {/* TODO: Cambiar el label */}
      { diff !== 0 && (
        <>
          <div className="diff">
            {/* si es mayor a 0 : Debe recibir $ */}
            { diff > 0 ? (
              <span className="recibe"> Recibe : </span>
            ) : (
              <span className="pay"> Paga : </span>
            )}
            <span>$ { Math.abs(diff) }</span>
          </div>

          {payersCount > 0 && (
            <div className="payers">
              { payersCount > 1 ? 'Deben pagarle : ' : 'Debe pagarle : ' }
              { payersCount > 0 && (
                <>
                  { payersCount }
                  { payersCount > 1 ? ' personas ' : ' persona ' }
                </>
              )}
              { rest > 0 && '+ $' + rest }
            </div>
          )}
        </>
      )}
    </div>
  )
} 

export { UserCard }
