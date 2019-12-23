declare interface IChessTimer extends Broadcaster {
  loadState: (state: ServerTimer) => void;
}
