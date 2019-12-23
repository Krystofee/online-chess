declare type PlayerDataState = 'CONNECTED' | 'DISCONNECTED';

declare interface IPlayerData extends Broadcaster {
  color: PieceColor;
  remaining: number;
  remainingTime: Time;
  state: PlayerDataState;

  loadState: (state: ServerPlayerDataState) => void;
}
