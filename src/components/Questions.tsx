import { socket } from "../socket";
import { GameSession } from "../types";
import { useState } from "react";
import { VStack, Button, Text, Input, Heading } from "@chakra-ui/react";

export default function Questions({ session }: { session: GameSession }) {
  const [question, setQuestion] = useState("");
  const submitQuestion = () => {
    socket.emit("submitQuestion", question);
  };

  const isCreator = session.creatorID === socket.id;

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  return (
    <VStack w="70vw" height="100vh" justify="center">
      <Heading size="xl">Question Phase</Heading>
      {isCreator ? (
        <>
          <Text>Key in your question here</Text>
          <Input
            placeholder="Enter your question"
            onChange={handleTextChange}
          />
          <Button onClick={submitQuestion}>Submit</Button>
        </>
      ) : (
        <Text>Sit tight, the host is keying in a question...</Text>
      )}
    </VStack>
  );
}
