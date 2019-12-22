import React from 'react';
import { Layer, Circle } from 'react-konva';
import { observer } from 'mobx-react';
import configStore from '../stores/configStore';

type Props = {
  game: IChessGameStore;
};

const PossibleMovesUnderlay = ({ game }: Props) => {
  return (
    <Layer>
      {game.possibleMoves.map(({ position: { x, y } }) => (
        <Circle
          key={`${x}${y}`}
          x={x + configStore.pieceSize / 2}
          y={y + configStore.pieceSize / 2}
          radius={configStore.pieceSize / 5}
          fill="#00000055"
        />
      ))}
    </Layer>
  );
};

export default observer(PossibleMovesUnderlay);
