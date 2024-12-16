import { useEffect, useState } from "react";
import { Text, Button, VStack, Heading } from "@chakra-ui/react";
import { socket } from "../socket";
import { GameSession } from "../types";

export default function Reveal({
  session,
  numberOfReds,
  guesses,
}: {
  session: GameSession;
  numberOfReds: number;
  guesses: Map<string, number>;
}) {
  const isCreator = session.creatorID === socket.id;
  const [playerHasSelected, setPlayerHasSelected] = useState<boolean>(false);
  const [playerAnswerMap, setPlayerAnswerMap] = useState<Map<string, string>>(
    new Map(),
  );
  // handle edge case of undefined socket in the future
  const playerGuessedCorrectly = guesses.get(socket.id!) === numberOfReds;

  const clickButtonEvent = (name: string) => {
    if (!playerGuessedCorrectly || playerHasSelected) return;
    socket.emit("getPlayerGuess", name);
    setPlayerHasSelected(true);
  };
  const handlePlayAgain = () => {
    socket.emit("resetRound");
  };

  // antipattern, but least messy.
  useEffect(() => {
    const handlePlayerAnswer = (playerAnswer: {
      name: string;
      answer: string;
    }) => {
      setPlayerAnswerMap(
        (prev) => new Map(prev.set(playerAnswer.name, playerAnswer.answer)),
      );
    };
    socket.on("playerAnswer", handlePlayerAnswer);
    return () => {
      socket.off("playerAnswer", handlePlayerAnswer);
    };
  }, []);

  return (
    <VStack w="70vw" height="100vh" justify="center">
      <Heading size="4xl">Reveal</Heading>
      <Text marginY="25px">
        <b>{session.question}</b>
      </Text>
      <Text>
        There{" "}
        <span style={{ color: "red" }}>
          {numberOfReds === 1 ? "was only 1 red" : `were ${numberOfReds} reds`}{" "}
        </span>
        to the question.
      </Text>
      {numberOfReds > 0 ? (
        <Text marginBottom="20px">
          If you guessed correctly, press to guess!
        </Text>
      ) : (
        <Text>What?! Nobody picked red this round. How boring.</Text>
      )}
      {numberOfReds > 0 &&
        Array.from(session.players.entries()).map(([id, player]) => (
          <Button
            key={id}
            marginBottom="5px"
            onClick={() => clickButtonEvent(player.name)}
            minW="20vw"
            colorPalette={
              playerAnswerMap.get(player.name) === "red" ? "red" : "gray"
            }
            variant={(() => {
              const playerAnswer = playerAnswerMap.get(player.name);
              if (playerAnswer === "red") return "solid";
              if (playerAnswer === "black") return "surface";
              return "solid";
            })()}
          >
            {(() => {
              const playerAnswer = playerAnswerMap.get(player.name);
              if (playerAnswer === "red") return `🟥 ${player.name}`;
              if (playerAnswer === "black") return `⬛️ ${player.name}`;
              return player.name;
            })()}
          </Button>
        ))}

      {isCreator && (
        <Button
          onClick={handlePlayAgain}
          variant="surface"
          colorPalette="orange"
          marginTop="20px"
        >
          Play Again?
        </Button>
      )}
    </VStack>
  );
}
