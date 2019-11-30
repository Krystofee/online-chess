declare type ServerAction = 'PLAYER_STATE' | 'GAME_STATE' | 'PRE_GAME';

declare type PlayerState = 'INIT' | 'CONNECTED' | 'PLAYING';

declare type ServerPlayerState = {
  id: string;
  state: PlayerState;
  color: PieceColor;
};

declare type GameState = 'WAITING' | 'PLAYING';

declare type ServerGameState = {
  id: string;
  state: GameState;
  players: string[];
  board: (PieceType | null)[][];
  on_move: PieceColor;
};

declare type ServerPreGame = {
  id: string;
  color: PieceColor;
};

declare type ServerData = ServerPlayerState | ServerGameState | ServerPreGame;

declare type ServerMessage = [ServerAction, ServerData];

declare type ClientAction = 'CONNECT' | 'MOVE';
