import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home, NewRoom, Room } from "./pages";
import { AuthContextProvider } from "./contexts/AuthContext/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms/new" element={<NewRoom />} />
          <Route path="/rooms/:id" element={<Room />} />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
