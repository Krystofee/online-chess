import React from 'react';
import { Image } from 'react-konva';
import commonStore from './stores/commonStore';
import { blackPieces, whitePieces } from './Images';

type Props = {
  game: IChessGameStore;
  piece: IPiece;
};

const Piece = ({ game, piece }: Props) => (
  <Image
    draggable
    x={piece.renderPosition.x}
    y={piece.renderPosition.y}
    width={commonStore.pieceSize}
    height={commonStore.pieceSize}
    image={piece.color === 'B' ? blackPieces[piece.type] : whitePieces[piece.type]}
    onDragStart={() => game.selectPiece(piece)}
    onDragEnd={(evt) => {
      game.movePiece(piece, { x: evt.target.x(), y: evt.target.y() });
      evt.target.to({ ...piece.renderPosition, duration: 0.1 });
      game.unselectPiece();
    }}
  />
);

export default Piece;
