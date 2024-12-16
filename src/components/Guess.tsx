import { useState } from "react";
import { socket } from "../socket";
import {
  VStack,
  Text,
  Button,
  NumberInputValueChangeDetails,
  Heading,
} from "@chakra-ui/react";
import { StepperInput } from "./ui/stepper-input";

import { GameSession } from "../types";

export default function Guess({ session }: { session: GameSession }) {
  const [guess, setGuess] = useState(0);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const submitGuess = () => {
    socket.emit("submitGuess", guess);
    setSubmitted(true);
  };

  return (
    <VStack w="70vw" height="100vh" justify="center">
      <Heading>Guess:</Heading>
      <Text fontSize="xl">How many people answered red to the question?</Text>
      <Text>Question: {session.question}</Text>
      <StepperInput
        defaultValue={String(guess)}
        min={0}
        max={session.players.size}
        onValueChange={(d: NumberInputValueChangeDetails) =>
          setGuess(d.valueAsNumber)
        }
        disabled={submitted}
      />
      {submitted ? (
        <Text>Guess submitted... Sit tight!</Text>
      ) : (
        <Button onClick={submitGuess}>Submit</Button>
      )}
    </VStack>
  );
}
