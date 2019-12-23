import React from 'react';
import { Layer, Rect, Text } from 'react-konva';
import configStore from '../stores/configStore';

type Props = {
  game: IChessGameStore;
};

const GameOverOverlay = ({ game }: Props) => {
  if (game.state !== 'ENDED') return null;

  return (
    <Layer>
      <Rect x={0} y={0} width={configStore.gameSize} height={configStore.gameSize} fill="#000000C0" />
      <Text
        x={0}
        y={0}
        width={configStore.gameSize}
        height={configStore.gameSize}
        align="center"
        verticalAlign="middle"
        text={`${game.winner! === 'B' ? 'Black' : 'White'} wins!`}
        fontSize={configStore.gameSize / 10}
        fill="#ffffff"
      />
    </Layer>
  );
};

export default GameOverOverlay;
