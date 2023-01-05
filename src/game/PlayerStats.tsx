import React from 'react';
import { observer } from 'mobx-react';
import Flexbox from '../Flexbox';
import { renderTime } from '../stores/helpers';

type Props = {
  player?: IPlayerData;
};

const PlayerStats = ({ player }: Props) => {
  if (!player) return null;

  return (
    <Flexbox alignItems="center">
      <div style={{ padding: '0.75rem 0.5rem', backgroundColor: '#ffffff10' }}>
        <span style={{ fontSize: '1.5rem', color: 'white' }}>{renderTime(player.remainingTime)}</span>
      </div>
      <div style={{ padding: '0.75rem 0.5rem', color: player.state === 'CONNECTED' ? '#3c9d3c' : '#5d5d5d' }}>
        <span className="circle" />
      </div>
    </Flexbox>
  );
};

export default observer(PlayerStats);
