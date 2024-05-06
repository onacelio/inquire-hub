import { useNavigate } from "react-router-dom";

import ilustration from "../../assets/images/illustration.svg";
import logo from "../../assets/images/logo.svg";
import googleIcon from "../../assets/images/google-icon.svg";

import "./home.scss";
import { Button } from "../../components/Button";
import { useAuth } from "../../hooks/useAuth";
import { FormEvent, useState } from "react";
import { database } from "../../services/firebase";

export function Home() {
  const navigate = useNavigate();
  const { user, SignInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState("");

  async function handleCrateRoom() {
    if (!user) {
      await SignInWithGoogle();
    }

    navigate("/rooms/new");
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if(roomCode.trim() === '') {
      return
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if(!roomRef.exists()) {
      alert('Essa sala não existe')
      return
    }

    navigate(`rooms/${roomCode}`)
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={ilustration} alt="Ilustration" />
        <h1>Toda pergunta tem uma resposta.</h1>
        <p>Aprenda e compartilhe conhecimento com outras pessoas</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logo} alt="Logo" />
          <button className="create-room" onClick={handleCrateRoom}>
            <img src={googleIcon} alt="Logo do google" />
            Crie sua sala com o google
          </button>
          <div className="separator">Ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={(event) => {
                setRoomCode(event.target.value);
              }}
              value={roomCode}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
