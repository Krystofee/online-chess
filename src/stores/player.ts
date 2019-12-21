import { action, observable } from 'mobx';
import { uuid } from 'uuidv4';

class Player implements IPlayer {
  @observable id: string;
  @observable color: PieceColor | null = null;
  @observable state: PlayerState = 'INIT';

  constructor() {
    // detect or generate player id
    this.id = uuid();
    const storedUserId = window.localStorage.getItem(this.id);
    if (storedUserId) {
      this.id = storedUserId;
    } else {
      window.localStorage.setItem(this.id, this.id);
    }
  }

  @action loadState = (state: ServerPlayerState) => {
    if (state.id === this.id) {
      console.log('load player state', state);
      this.color = state.color;
      this.state = state.state;
    }
  };
}

export default Player;
