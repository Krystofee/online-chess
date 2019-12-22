import React from 'react';
import { Layer, Rect } from 'react-konva';
import { observer } from 'mobx-react';
import configStore from '../stores/configStore';

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
          width={configStore.pieceSize}
          height={configStore.pieceSize}
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
