import { VStack, Input, Button, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import { socket } from "../socket";
import styled from "@emotion/styled";

const title = "redblack";

const renderAnimatedTitle = () => {
  return (
    <Flex>
      {title.split("").map((letter, index) => (
        <AnimatedLetter
          key={index}
          style={{
            animationDelay: `${index * 0.1}s`,
            color: index < 3 ? "#E53E3E" : "#dbdbdb", // First 3 letters red, rest black
          }}
        >
          {letter}
        </AnimatedLetter>
      ))}
    </Flex>
  );
};

const AnimatedLetter = styled.span`
  display: inline-block;
  opacity: 0;
  animation: fadeIn 0.5s forwards;
  color: ${(props) => props.color || "black"};
  font-family: "Inter", sans-serif;
  font-weight: 800;
  font-size: 36px;
  text-transform: lowercase;

  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateY(-20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export default function Home() {
  const [name, setName] = useState("");
  const [roomAlias, setRoomAlias] = useState("");

  const createGame = () => {
    if (!name) return;
    socket.emit("createSession", name, roomAlias ? roomAlias : name);
    console.log("client emit createSession");
  };

  const joinGame = () => {
    if (!name) return;
    socket.emit("joinSession", name, roomAlias);
    console.log("client emit joinSession");
  };

  return (
    <Flex direction="column" height="100vh">
      <VStack w="70vw" flex="1" justify="center">
        {/* <Heading size={"xl"}>redblack</Heading> */}
        {renderAnimatedTitle()}
        <Input
          placeholder="Enter a username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Enter a room ID to create or join"
          value={roomAlias}
          onChange={(e) => setRoomAlias(e.target.value)}
        />
        <Button onClick={createGame} disabled={!name}>
          Create Game
        </Button>
        <Button onClick={joinGame} disabled={!(name || roomAlias)}>
          Join Game
        </Button>
      </VStack>
      <VStack w="70vw" height="5vh" justify="center">
        <Text>made with 🥂</Text>
      </VStack>
    </Flex>
  );
}
