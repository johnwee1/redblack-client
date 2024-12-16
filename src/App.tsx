import { useState, useEffect } from "react";
import { GameSession } from "./types";
import { socket } from "./socket";
import { Provider } from "@/components/ui/provider";
import { Toaster, toaster } from "@/components/ui/toaster";
import { Box, VStack } from "@chakra-ui/react";
import Home from "./components/Home";
import Wait from "./components/Wait";
import Questions from "./components/Questions";
import Answer from "./components/Answer";
import Guess from "./components/Guess";
import Reveal from "./components/Reveal";
export default function App() {
  const [session, setSession] = useState<GameSession>({
    state: "home",
    players: new Map(),
    creatorID: "",
    question: "",
    alias: "",
  });
  const [numberOfReds, setNumberOfReds] = useState<number>(-1);
  const [guessMap, setGuessMap] = useState<Map<string, number>>(new Map());

  // should not associate registration with UI state
  // handle all socket events here
  useEffect(() => {
    console.log("Socket URL: ", import.meta.env.VITE_SOCKET_URL);
    function updateSessionState(gameSession: GameSession) {
      // hehe. the type info is missing at runtime. gameSession is not quite a GameSession yet
      // need to create the map object
      setSession({ ...gameSession, players: new Map(gameSession.players) });
    }
    function updateGuessInfo({
      numberOfReds,
      guesses,
    }: {
      numberOfReds: number;
      guesses: Map<string, number>;
    }) {
      console.log("UPDATE GUESS INFO: ");
      console.log(numberOfReds);
      setNumberOfReds(numberOfReds);
      setGuessMap(new Map(guesses));
    }
    function showToast(message: string) {
      toaster.create({
        description: message,
        type: "info",
      });
    }

    function printDebug(message: JSON) {
      console.log(message);
    }

    function leaveSession() {
      setSession({
        state: "home",
        players: new Map(),
        creatorID: "",
        question: "",
        alias: "",
      });
      setNumberOfReds(-1);
      setGuessMap(new Map());
    }

    socket.on("sessionInfo", updateSessionState);
    socket.on("revealInfo", updateGuessInfo);
    socket.on("message", showToast);
    socket.on("debug", printDebug);
    socket.on("leaveSessionOnClientSide", leaveSession);
    socket.on("connect", () => {
      console.log("Connected to server!");
    });
    socket.on("connect_error", (err) => {
      console.log(`Connection error: ${err}`);
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.off("sessionInfo", updateSessionState);
      socket.off("revealInfo", updateGuessInfo);
      socket.off("message", showToast);
      socket.off("debug", printDebug);
      socket.off("leaveSessionOnClientSide", leaveSession);
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
    };
  }, []);

  const renderComponent = () => {
    switch (session.state) {
      case "home":
        return <Home />;
      case "wait":
        return <Wait session={session} />;
      case "questions":
        return <Questions session={session} />;
      case "answer":
        return <Answer session={session} />;
      case "guess":
        return <Guess session={session} />;
      case "reveal":
        return (
          <Reveal
            session={session}
            numberOfReds={numberOfReds}
            guesses={guessMap}
          />
        );
    }
  };

  return (
    <Provider>
      <Box>
        <VStack>{renderComponent()}</VStack>
        <Toaster />
      </Box>
    </Provider>
  );
}
