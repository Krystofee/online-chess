import React, { useEffect, useState } from 'react';
import { Stage } from 'react-konva';
import { observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router';

import Board from './Board';
import Pieces from './Pieces';
import PossibleMovesUnderlay from './PossibleMovesUnderlay';
import PossibleMovesOverlay from './PossibleMovesOverlay';
import PlayerStats from './PlayerStats';
import Flexbox from '../Flexbox';
import { useWindowSize } from '../stores/hooks';
import configStore from '../stores/configStore';
import ChessGameStore from '../stores/chessGameStore';
import { getInverseColor } from '../stores/helpers';
import GameOverOverlay from './GameOverOverlay';
import PreparedMove from './PreparedMove';
import GameModal from './GameModal';

type RouteProps = RouteComponentProps<{
  gameId: string;
  length?: string;
  perMove?: string;
}>;

const App = ({
  match: {
    params: { gameId, length, perMove },
  },
}: RouteProps) => {
  const [chessGame, setChessGame] = useState<ChessGameStore | null>(null);
  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal((openedModal) => !openedModal);
  const windowSize = useWindowSize();

  useEffect(() => {
    const size = Math.min(windowSize.x, windowSize.y);
    if (size <= configStore.DEFAULT_SIZE) {
      configStore.gameSize = size;
    } else {
      configStore.gameSize = configStore.DEFAULT_SIZE;
    }
    configStore.isLandscape = windowSize.y > windowSize.x;
  }, [windowSize]);

  useEffect(() => {
    setChessGame(new ChessGameStore(gameId, length, perMove));
  }, [gameId]);

  if (!chessGame) return null;

  return (
    <>
      {!chessGame.socketReady ? (
        <div className="center">
          <p>... connecting</p>
        </div>
      ) : (
        <div className="center" style={{ width: configStore.gameSize }}>
          {chessGame.state === 'PLAYING' || chessGame.state === 'ENDED' ? (
            <>
              <Flexbox justifyContent="space-between" alignItems="center" style={{ color: 'white' }}>
                <PlayerStats player={chessGame.playersData[getInverseColor(chessGame.player.color!)]} />
                <div>Offered draw</div>
                <div className="text-right" style={{ padding: '0.75rem 0.5rem', width: '4rem' }}>
                  <div className="anchor-simple" role="presentation" onClick={toggleModal}>
                    {modal ? '❌' : 'menu'}
                  </div>
                </div>
              </Flexbox>

              <Flexbox direction="row" justifyContent="center">
                <div className="shadow p-relative">
                  <Stage width={configStore.gameSize} height={configStore.gameSize}>
                    <Board invert={configStore.invert} />
                    <PreparedMove game={chessGame} />
                    <PossibleMovesUnderlay game={chessGame} />
                    <Pieces game={chessGame} />
                    <PossibleMovesOverlay game={chessGame} />
                    <GameOverOverlay game={chessGame} />
                  </Stage>
                  {modal && <GameModal game={chessGame} />}
                </div>
              </Flexbox>
              <PlayerStats player={chessGame.playersData[chessGame.player.color!]} />
            </>
          ) : (
            <div className="text-center">
              <div style={{ paddingTop: 100 }}>
                {chessGame.player.state === 'CONNECTED' && (
                  <div style={{ padding: '2em', backgroundColor: '#00000010' }}>
                    <h3>Invite your friend using this link</h3>
                    <pre>{`localhost:3000/${gameId}/`}</pre>
                    <p>... waiting for all players to join</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default observer(App);
