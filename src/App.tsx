import React, { useEffect, useState } from 'react';
import { Stage } from 'react-konva';
import { observer } from 'mobx-react';

import commonStore from './stores/commonStore';
import ChessGameStore from './stores/chessGameStore';
import Board from './Board';
import Pieces from './Pieces';
import PossibleMoves from './PossibleMoves';

const App = () => {
  const [chessGame, setChessGame] = useState<ChessGameStore | null>(null);

  const startGame = () => {
    if (chessGame) chessGame.startGame();
  };

  useEffect(() => {
    setChessGame(new ChessGameStore());
  }, []);

  if (!chessGame) return null;

  const size = commonStore.size;

  return (
    <div className="center" style={{ width: 800 }}>
      <div className="center">
        <h1>Chess</h1>
      </div>

      {!chessGame.socketReady ? (
        <div className="center" style={{ width: commonStore.size, height: commonStore.size }}>
          <p>... connecting</p>
        </div>
      ) : (
        <div className="center" style={{ width: commonStore.size, height: commonStore.size }}>
          {chessGame.gameState === 'PLAYING' ? (
            <>
              <p>{chessGame.onMove === 'W' ? 'White' : 'Black'} moves...</p>
              <div className="shadow">
                <Stage width={size} height={size}>
                  <Board />
                  <PossibleMoves game={chessGame} />
                  <Pieces game={chessGame} />
                </Stage>
              </div>
            </>
          ) : (
            <div className="text-center" style={{ width: commonStore.size, height: commonStore.size }}>
              <div style={{ paddingTop: 100 }}>
                {chessGame.playerState === 'CONNECTED' ? (
                  <p>... waiting for all players to join</p>
                ) : (
                  <button className="pure-button pure-button-primary button-xlarge" type="button" onClick={startGame}>
                    Join as {chessGame.color === 'B' ? 'black' : 'white'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default observer(App);
