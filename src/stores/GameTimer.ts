import { observable, computed } from 'mobx';
import { toTime } from './helpers';

class GameTimer implements IChessTimer {
  game: IChessGameStore;
  @observable remainingWhite = 60;
  @observable remainingBlack = 60;

  constructor(game: IChessGameStore) {
    this.game = game;
  }

  loadState = (state: ServerTimer) => {
    this.remainingWhite = state.remaining_white;
    this.remainingBlack = state.remaining_black;
  };

  @computed get remainingWhiteTime() {
    return toTime(this.remainingWhite);
  }

  @computed get remainingBlackTime() {
    return toTime(this.remainingBlack);
  }
}

export default GameTimer;
