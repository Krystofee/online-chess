declare type PlayerDataState = 'CONNECTED' | 'DISCONNECTED' | 'PLAYING' | 'ENDED';

declare interface IPlayerData extends Broadcaster {
  color: PieceColor;
  remaining: number;
  remainingTime: Time;
  state: PlayerDataState;

  loadState: (state: ServerPlayerDataState) => void;
}
