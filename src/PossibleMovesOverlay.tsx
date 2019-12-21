import React from 'react';
import { Layer, Rect } from 'react-konva';
import { observer } from 'mobx-react';
import commonStore from './stores/commonStore';

type Props = {
  game: IChessGameStore;
};

const PossibleMovesOverlay = ({ game }: Props) => {
  return (
    <Layer>
      {game.possibleMoves.map(({ position: { x, y } }) => (
        <Rect
          key={`${x}${y}`}
          x={x}
          y={y}
          width={commonStore.pieceSize}
          height={commonStore.pieceSize}
          fill="#00000010"
          onClick={() => {
            game.moveSelectedPiece({ x, y });
          }}
        />
      ))}
    </Layer>
  );
};

export default observer(PossibleMovesOverlay);
