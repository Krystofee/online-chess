declare interface IChessTimer {
  remainingWhite: number;
  remainingWhiteTime: Time;
  remainingBlack: number;
  remainingBlackTime: Time;

  loadState: (state: ServerTimer) => void;
}
