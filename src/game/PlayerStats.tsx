import React from 'react';
import { observer } from 'mobx-react';
import Flexbox from '../Flexbox';
import { renderTime } from '../stores/helpers';

type Props = {
  game: IChessGameStore;
  player: IPlayerData;
};

const PlayerStats = ({ game, player }: Props) => {
  return (
    <Flexbox justifyContent="space-between" alignItems="center" style={{ height: '3rem', color: 'white' }}>
      <div>
        <div style={{ padding: '0.75rem 0.5rem', backgroundColor: '#ffffff10' }}>
          <span style={{ fontSize: '1.5rem' }}>{renderTime(player.remainingTime)}</span>
        </div>
      </div>
      <div>
        <Flexbox alignItems="center" style={{ padding: '0.75rem 0.5rem' }}>
          <span style={{ fontSize: '1.3rem', letterSpacing: '0.2rem' }}>♞♜</span>
          <span style={{ fontSize: '0.8rem' }}>+8</span>
        </Flexbox>
      </div>
    </Flexbox>
  );
};

export default observer(PlayerStats);
