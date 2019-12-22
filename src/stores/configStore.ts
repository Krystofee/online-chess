import { observable, computed } from 'mobx';
import { isProduction } from './helpers';

const DEFAULT_GAME_SIZE = 600;

class ConfigStore implements IConfigStore {
  DEFAULT_SIZE = DEFAULT_GAME_SIZE;

  @observable gameSize = DEFAULT_GAME_SIZE;
  @observable isLandscape = false;
  websocketUrl = isProduction() ? 'wss://pichess-backend.herokuapp.com/0.0.0.0/{id}' : 'ws://localhost:9000/{id}';

  @computed get pieceSize(): number {
    return this.gameSize / 8;
  }
}

export default new ConfigStore();
