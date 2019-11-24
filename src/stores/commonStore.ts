import { observable, computed } from 'mobx';

class CommonStore implements ICommonStore {
  @observable size = 500;

  @computed get pieceSize(): number {
    return this.size / 8;
  }
}

export default new CommonStore();
