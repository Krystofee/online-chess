import React, { useEffect, useState } from 'react';
import { Stage } from 'react-konva';
import { observer } from 'mobx-react';

import commonStore from './stores/commonStore';
import ChessGameStore from './stores/chessGameStore';
import Board from './Board';
import Pieces from './Pieces';
import PossibleMoves from './PossibleMoves';

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [chessGame, setChessGame] = useState<ChessGameStore | null>(null);

  const toggleIsPlaying = () => setIsPlaying((oldIsPlaying) => !oldIsPlaying);

  useEffect(() => {
    setChessGame(new ChessGameStore());
  }, [isPlaying]);

  if (!chessGame) return null;

  const size = commonStore.size;

  return (
    <div className="center" style={{ width: 800 }}>
      <div className="center">
        <h1>Chess</h1>
      </div>
      <div className="center" style={{ width: commonStore.size, height: commonStore.size }}>
        {isPlaying && chessGame ? (
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
              <button className="pure-button pure-button-primary button-xlarge" type="button" onClick={toggleIsPlaying}>
                {isPlaying ? 'Stop' : 'Play'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default observer(App);
