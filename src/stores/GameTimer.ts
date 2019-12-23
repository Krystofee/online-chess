class GameTimer implements IChessTimer {
  game: IChessGameStore;

  constructor(game: IChessGameStore) {
    this.game = game;
  }

  loadState = (state: ServerTimer) => {
    state.players.map((data) => {
      this.game.playersData[data.color].loadState(data);
    });
  };
}

export default GameTimer;
