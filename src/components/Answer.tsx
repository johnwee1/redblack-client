import { socket } from "../socket";
import { GameSession } from "../types";
import { useState } from "react";
import { VStack, Box, Button, Text } from "@chakra-ui/react";

export default function Answer({ session }: { session: GameSession }) {
  const [selectedColor, setSelectedColor] = useState("black");
  const [submitted, setSubmitted] = useState(false);

  const submitAnswer = () => {
    socket.emit("submitAnswer", selectedColor);
    setSubmitted(true);
  };

  const handleCardClick = () => {
    setSelectedColor((prevColor) => (prevColor === "red" ? "black" : "red"));
  };

  return (
    <VStack w="70vw" height="100vh" justify="center">
      <Text fontSize="xl">Answer the question:</Text>
      <Text>{session.question}</Text>
      {submitted ? (
        <Text>Answer submitted</Text>
      ) : (
        <>
          <Box
            onClick={handleCardClick}
            style={{ perspective: "1000px" }}
            cursor="pointer"
          >
            <Box
              position="relative"
              width="400px"
              height="600px"
              textAlign="center"
              transition="transform 0.6s"
              transformStyle="preserve-3d"
              transform={
                selectedColor === "red" ? "rotateY(180deg)" : "rotateY(0deg)"
              }
            >
              {/* Front Side */}
              <Box
                position="absolute"
                width="100%"
                height="100%"
                backfaceVisibility="hidden"
                backgroundColor="#2d2d2d"
                color="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="2xl"
                borderRadius="md"
              >
                Black
              </Box>
              {/* Back Side */}
              <Box
                position="absolute"
                width="100%"
                height="100%"
                backfaceVisibility="hidden"
                backgroundColor="#ac1818"
                color="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="2xl"
                transform="rotateY(180deg)"
                borderRadius="md"
              >
                Red
              </Box>
            </Box>
          </Box>
          <Button onClick={submitAnswer}>Submit</Button>
        </>
      )}
    </VStack>
  );
}
