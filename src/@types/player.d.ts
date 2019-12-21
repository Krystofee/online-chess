declare interface IPlayer extends Broadcaster {
  id: string;
  color: PieceColor | null;
  state: PlayerState;
}
