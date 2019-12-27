import React from 'react';
import { Rect, Layer } from 'react-konva';
import { observer } from 'mobx-react';
import configStore from '../stores/configStore';
import { translateCoordToBoard } from '../stores/helpers';

type Props = {
  game: IChessGameStore;
};

const PreparedMove = ({ game }: Props) => {
  const move = game.preparedMove;
  if (!move) return null;

  const { x: mx, y: my } = translateCoordToBoard(move.position);
  const { x: px, y: py } = move.piece.renderPosition;

  return (
    <Layer>
      <Rect x={mx} y={my} width={configStore.pieceSize} height={configStore.pieceSize} fill="#00000055" />
      <Rect x={px} y={py} width={configStore.pieceSize} height={configStore.pieceSize} fill="#00000055" />
    </Layer>
  );
};

export default observer(PreparedMove);
