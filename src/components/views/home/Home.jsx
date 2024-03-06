import { useState } from "react"
import { Hosts } from "./Hosts"
import { Guests } from "./Guests"
import { Total } from "./Total"

const Home = () => {
  // Objeto donde van id de anfitriones y lo que gastaron
  const [hosts, setHosts] = useState({0: 0})

  // Cantidad total de Usuarios
  const [users, setUsers] = useState(undefined)

  return (
    <main>
      <Hosts hosts={hosts} setHosts={setHosts} />
      <Guests />
      <Total />
    </main>
  )
}

export { Home }