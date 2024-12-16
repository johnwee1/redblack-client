type GameState = "home" | "wait" | "questions" | "answer" | "guess" | "reveal";
// type Answer = "red" | "black";
type Player = { id: string; name: string };
export interface GameSession {
  state: GameState;
  players: Map<string, Player>;
  creatorID: string;
  question: string;
  alias: string;
}
