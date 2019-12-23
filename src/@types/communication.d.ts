declare type ServerAction = 'PLAYER_STATE' | 'GAME_STATE' | 'TIMER';

declare type PlayerState = 'INIT' | 'CONNECTED' | 'PLAYING';

declare type ServerPlayerState = {
  id: string;
  state: PlayerState;
  color: PieceColor;
};

declare type ServerPlayerDataState = {
  color: PieceColor;
  state: PlayerDataState;
  remaining_time: number;
};

declare type GameState = 'WAITING' | 'PLAYING';

declare type SerializedPiece = {
  id: string;
  type: PieceType;
  color: PieceColor;
  move_count: number;
  x: number;
  y: number;
};

declare type ServerGameState = {
  id: string;
  state: GameState;
  players: ServerPlayerDataState[];
  board: SerializedPiece[];
  on_move: PieceColor;
  timer: ServerTimer;
};

declare type ServerPreGame = {
  id: string;
  color: PieceColor;
};

declare type ServerTimer = {
  server_time: number;
  players: ServerPlayerDataState[];
};

declare type ServerData = ServerPlayerState | ServerGameState | ServerPreGame | ServerTimer;

declare type ServerMessage = [ServerAction, ServerData];

declare type ClientAction = 'CONNECT' | 'MOVE' | 'IDENTIFY';

declare type ClientSendData = object;

declare interface Broadcaster {
  loadState(data: any): void;
}
