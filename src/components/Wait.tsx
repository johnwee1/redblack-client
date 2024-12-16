import { VStack, Button, Text, List, Heading } from "@chakra-ui/react";
// import { useState } from "react";
import { socket } from "../socket";
import { GameSession } from "../types";

export default function Wait({ session }: { session: GameSession }) {
  console.log("Wait screen session state:");
  console.log(session);
  const startGame = () => {
    console.log("Click start game");
    socket.emit("startGame");
  };
  const backToHome = () => {
    console.log("User clicked back to home");
    socket.emit("leaveSession");
  };

  return (
    <VStack w="70vw" height="100vh" justify="center">
      <Heading size="xl">Waiting Room</Heading>
      <Text>Room ID: {session.alias}</Text>
      <List.Root>
        {Array.from(session.players).map(([id, player]) => (
          <List.Item key={id}>
            {player.id === session.creatorID
              ? `👑   ${player.name}`
              : player.name}
          </List.Item>
        ))}
      </List.Root>
      {session.creatorID === socket.id ? (
        <Button onClick={startGame} disabled={session.players.size < 2}>
          Start Game
        </Button>
      ) : (
        <Text>Waiting for the game owner to start the game.</Text>
      )}
      <Button onClick={backToHome} variant="outline">
        Back to Home
      </Button>
    </VStack>
  );
}
