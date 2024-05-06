import { useParams } from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import { Button, RoomCode } from "../../components";

import "./room.scss";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { database } from "../../services/firebase";

type FirebaseQuestions = Record<
  string,
  {
    author: {
      displayName: string;
      photoURL: string;
    };
    content: string;
    isHighlighted: boolean;
    isAnswered: boolean;
  }
>;

type QuestionsProps = {
  id: string;
  author: {
    displayName: string;
    photoURL: string;
  };
  content: string;
  isHighlighted: boolean;
  isAnswered: boolean;
};

type RoomParams = {
  id: string;
};

export function Room() {
  const { user } = useAuth();
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState("");
  const [questions, setQuestions] = useState<QuestionsProps[]>([]);
  const [title, setTitle] = useState("");

  async function handleCreateNewQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === "") {
      return;
    }

    if (!user) {
      throw new Error("Você não está logado!");
    }

    const question = {
      content: newQuestion,
      author: {
        displayName: user.displayName,
        photoURL: user.photoURL,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    await database.ref(`rooms/${params.id}/questions`).push(question);

    setNewQuestion("");
  }

  useEffect(() => {
    const roomRef = database.ref(`rooms/${params.id}`);

    roomRef.on("value", (room) => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestions ?? {}).map(
        ([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            isHighlighted: value.isHighlighted,
            isAnswered: value.isAnswered,
          };
        }
      );

      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    });
  }, [params.id]);

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logo} alt="Logo" />
          <RoomCode code={params.id!} />
        </div>
      </header>
      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && (
            <span>
              {questions.length === 1
                ? `${questions.length} pergunta`
                : `${questions.length} perguntas`}
            </span>
          )}
        </div>

        <form onSubmit={handleCreateNewQuestion}>
          <textarea
            placeholder="O que você deseja perguntar?"
            onChange={(event) => setNewQuestion(event.target.value)}
            value={newQuestion}
          />
          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.photoURL} alt={user.displayName} />
                <span>{user.displayName}</span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta, <button>faça seu login</button>.
              </span>
            )}
            <Button type="submit" disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>

        {JSON.stringify(questions)}
      </main>
    </div>
  );
}
