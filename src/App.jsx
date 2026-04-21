import { Route, Routes } from "react-router-dom";
import "./App.scss";
import { Home } from "./components/views/home/Home";
import { Header } from "./components/shared/Header";
import { BackgroundShapes } from "./components/shared/BackgroundShapes";
import { InstallBanner } from "./components/shared/InstallBanner";

function App() {
  return (
    <div className="App">
      <BackgroundShapes />
      <Header />
      <div className="app-content">
        <Routes>
          <Route path="/dividir-cuentas/" element={<Home />} />
        </Routes>
      </div>
      <InstallBanner />
    </div>
  );
}

export default App;
