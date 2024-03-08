import { Route, Routes } from 'react-router-dom'
import './App.scss'
import { Home } from './components/views/home/Home'

function App() {
  return (
    <div className="App">
      {/* Header */}

      <Routes>
        <Route path='/dividir-cuentas/' element={<Home />} />
      </Routes>
      
      {/* Footer */}
    </div>
  )
}

export default App
