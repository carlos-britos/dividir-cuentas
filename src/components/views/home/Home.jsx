import { useState } from "react"
import { Hosts } from "./Hosts"
import { Guests } from "./Guests"
import { Total } from "./Total"

const Home = () => {
  const [partial, setPartial] = useState(0)
  
  // Objeto donde van id de anfitriones y lo que gastaron
  const [hosts, setHosts] = useState({0: 0})

  // Cantidad de invitados
  const [guests, setGuests] = useState(0)

  return (
    <main>
      <Hosts hosts={ hosts } setHosts={ setHosts } partial={ partial } />
      <Guests guests={ guests } setGuests={ setGuests } />
      <Total hosts={ hosts } guests={ guests } partial={ partial } setPartial={ setPartial } />
    </main>
  )
}

export { Home }