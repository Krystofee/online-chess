import React, { useEffect, useState } from 'react';
import { Stage } from 'react-konva';
import { observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router';

import commonStore from './stores/commonStore';
import ChessGameStore from './stores/chessGameStore';
import Board from './Board';
import Pieces from './Pieces';
import PossibleMovesUnderlay from './PossibleMovesUnderlay';
import PossibleMovesOverlay from './PossibleMovesOverlay';

type RouteProps = RouteComponentProps<{
  gameId: string;
}>;

const App = ({
  match: {
    params: { gameId },
  },
}: RouteProps) => {
  const [chessGame, setChessGame] = useState<ChessGameStore | null>(null);

  const startGame = () => {
    if (chessGame) chessGame.startGame();
  };

  useEffect(() => {
    setChessGame(new ChessGameStore(gameId));
  }, [gameId]);

  if (!chessGame) return null;

  const size = commonStore.size;

  return (
    <div className="center" style={{ width: size }}>
      <div className="center">
        <h1>Chess</h1>
        <button onClick={() => window.location.replace('/')} type="button">
          back
        </button>
        <button
          onClick={() => {
            chessGame.board.invert = !chessGame.board.invert;
          }}
          type="button"
        >
          rotate
        </button>
      </div>

      {!chessGame.socketReady ? (
        <div className="center">
          <p>... connecting</p>
        </div>
      ) : (
        <div className="center">
          {chessGame.state === 'PLAYING' ? (
            <>
              <p>{chessGame.onMove === chessGame.player.color ? "It's your turn!" : 'Waiting for opponent...'}</p>
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'row' }}>
                <div className="shadow" style={{ width: size, height: size }}>
                  <Stage width={size} height={size}>
                    <Board invert={chessGame.board.invert} />
                    <PossibleMovesUnderlay game={chessGame} />
                    <Pieces game={chessGame} />
                    <PossibleMovesOverlay game={chessGame} />
                  </Stage>
                </div>
                {/* <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div
                    style={{
                      padding: '1em',
                      backgroundColor: chessGame.onMove === chessGame.player.color ? undefined : '#ff003b24',
                    }}
                  >
                    08:51
                  </div>
                  <div
                    style={{
                      padding: '1em',
                      backgroundColor: chessGame.onMove === chessGame.player.color ? '#ff003b24' : undefined,
                    }}
                  >
                    08:51
                  </div>
                </div> */}
              </div>
            </>
          ) : (
            <div className="text-center">
              <div style={{ paddingTop: 100 }}>
                {chessGame.player.state === 'CONNECTED' ? (
                  <div style={{ padding: '2em', backgroundColor: '#00000010' }}>
                    <h3>Invite your friend using this link</h3>
                    <pre>{`localhost:3000/${gameId}/`}</pre>
                    <p>... waiting for all players to join</p>
                  </div>
                ) : (
                  <button className="pure-button pure-button-primary button-xlarge" type="button" onClick={startGame}>
                    Join
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
