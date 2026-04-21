import { Route, Routes } from "react-router-dom";
import "./App.scss";
import { Home } from "./components/views/home/Home";
import { Header } from "./components/shared/Header";

function App() {
  return (
    <div className="App">
      <Header />
      <div className="app-content">
        <Routes>
          <Route path="/dividir-cuentas/" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
