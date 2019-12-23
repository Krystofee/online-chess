import { action, observable } from 'mobx';
import { uuid } from 'uuidv4';

class Player implements IPlayer {
  @observable id: string;
  @observable color: PieceColor | null = null;
  @observable state: PlayerState = 'CONNECTED';

  constructor(gameId: string) {
    // detect or generate player id
    this.id = uuid();
    const storedUserId = window.localStorage.getItem(gameId);
    if (storedUserId) {
      this.id = storedUserId;
    } else {
      window.localStorage.setItem(gameId, this.id);
    }
  }

  @action loadState = (state: ServerPlayerState) => {
    if (state.id === this.id) {
      this.color = state.color;
      this.state = state.state;
    }
  };
}

export default Player;
