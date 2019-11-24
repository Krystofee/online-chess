import React from 'react';
import { Layer, Image as KonvaImage } from 'react-konva';
import { observer } from 'mobx-react';
import { blackPieces, whitePieces } from './Images';
import commonStore from './stores/commonStore';

type Props = {
  game: IChessGameStore;
};

const Pieces = ({ game }: Props) => {
  return (
    <Layer>
      {game.pieces.map((piece) => (
        <KonvaImage
          draggable
          key={piece.id}
          x={piece.renderPosition.x}
          y={piece.renderPosition.y}
          width={commonStore.pieceSize}
          height={commonStore.pieceSize}
          image={piece.color === 'B' ? blackPieces[piece.type] : whitePieces[piece.type]}
          onDragStart={() => game.selectPiece(piece)}
          onDragEnd={(evt) => {
            piece.moveBoardCoord({ x: evt.target.x(), y: evt.target.y() });
            game.unselectPiece();
          }}
        />
      ))}
    </Layer>
  );
};

export default observer(Pieces);
