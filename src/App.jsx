import './App.scss'
import { Guests } from './components/views/home/Guests'
import { Hosts } from './components/views/home/Hosts'
import { Total } from './components/views/home/Total'

function App() {
  return (
    <>
      {/* Header */}
      <main>
        <section>
          <Hosts />
          <Guests />
          <Total />
        </section>
      </main>
      {/* Footer */}
    </>
  )
}

export default App
