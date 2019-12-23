import { observable, action, computed } from 'mobx';
import { toTime } from './helpers';

class PlayerData implements IPlayerData {
  @observable color: PieceColor;
  @observable remaining: number = 0;
  @observable state: PlayerDataState = 'CONNECTED';

  constructor(color: PieceColor) {
    this.color = color;
  }

  @action loadState = (state: ServerPlayerDataState) => {
    if (state.color === this.color) {
      this.state = state.state;
      this.remaining = state.remaining_time;
    }
  };

  @computed get remainingTime() {
    return toTime(this.remaining);
  }

  @computed get isConnected() {
    return this.state === 'CONNECTED';
  }
}

export default PlayerData;
