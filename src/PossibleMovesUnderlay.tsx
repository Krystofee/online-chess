import React from 'react';
import { Layer, Circle } from 'react-konva';
import { observer } from 'mobx-react';
import commonStore from './stores/commonStore';

type Props = {
  game: IChessGameStore;
};

const PossibleMovesUnderlay = ({ game }: Props) => {
  return (
    <Layer>
      {game.possibleMoves.map(({ position: { x, y } }) => (
        <Circle
          key={`${x}${y}`}
          x={x + commonStore.pieceSize / 2}
          y={y + commonStore.pieceSize / 2}
          radius={commonStore.pieceSize / 5}
          fill="#00000055"
        />
      ))}
    </Layer>
  );
};

export default observer(PossibleMovesUnderlay);
