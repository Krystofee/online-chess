import React, { useEffect, useState } from 'react';
import { Stage } from 'react-konva';
import { observer } from 'mobx-react';

import commonStore from './stores/commonStore';
import ChessGameStore from './stores/chessGameStore';
import Board from './Board';
import Pieces from './Pieces';
import PossibleMoves from './PossibleMoves';

type ServerAction = 'PLAYER_STATE' | 'GAME_STATE';
type ClientAction = 'CONNECT' | 'START' | 'MOVE';

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [chessGame, setChessGame] = useState<ChessGameStore | null>(null);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);

  const toggleIsPlaying = () => setIsPlaying((oldIsPlaying) => !oldIsPlaying);

  const getWebsocketMessage = (action: ClientAction, data: object) => {
    return JSON.stringify([action, data]);
  };

  const connectPlayer = (color: PieceColor) => {
    if (websocket) {
      websocket.send(getWebsocketMessage('CONNECT', { color }));
    }
  };

  const move = (color: PieceColor, from: Coord, to: Coord) => {
    if (websocket) {
      console.log('move', color);
      websocket.send(
        getWebsocketMessage('MOVE', {
          ...from,
          tx: to.x,
          ty: to.y,
        }),
      );
    }
  };

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:8765');
    websocket.onmessage = (event) => {
      console.log('received event', JSON.parse(event.data));
    };

    websocket.onopen = () => {
      setWebsocket(websocket);
    };
  }, []);

  useEffect(() => {
    setChessGame(new ChessGameStore());
  }, [isPlaying]);

  if (!chessGame) return null;

  const size = commonStore.size;

  return (
    <div className="center" style={{ width: 800 }}>
      <div className="center">
        <h1>Chess</h1>
        <button onClick={() => connectPlayer('W')}>Connect white</button>
        <button onClick={() => connectPlayer('B')}>Connect black</button>

        <button onClick={() => move('W', { x: 1, y: 2 }, { x: 3, y: 4 })}>Move white</button>
        <button onClick={() => move('B', { x: 1, y: 2 }, { x: 3, y: 4 })}>Move black</button>
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
