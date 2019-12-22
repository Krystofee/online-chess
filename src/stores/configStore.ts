import { observable, computed } from 'mobx';
import { isProduction } from './helpers';

class ConfigStore implements IConfigStore {
  @observable size = 500;
  websocketUrl = isProduction() ? 'wss://pichess-backend.herokuapp.com/0.0.0.0/{id}' : 'ws://localhost:9000/{id}';

  @computed get pieceSize(): number {
    return this.size / 8;
  }
}

export default new ConfigStore();
