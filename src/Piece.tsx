import React from 'react';
import { Image } from 'react-konva';
import { observer } from 'mobx-react';
import commonStore from './stores/commonStore';
import { blackPieces, whitePieces } from './Images';

type Props = {
  game: IChessGameStore;
  piece: IPiece;
};

const Piece = ({ game, piece }: Props) => (
  <Image
    ref={(ref) => {
      piece.imageRef = ref;
    }}
    draggable={game.onMove === piece.color}
    x={piece.renderPosition.x}
    y={piece.renderPosition.y}
    width={commonStore.pieceSize}
    height={commonStore.pieceSize}
    image={piece.color === 'B' ? blackPieces[piece.type] : whitePieces[piece.type]}
    onClick={() => {
      game.unselectPiece();
      game.selectPiece(piece);
    }}
    onDragStart={() => game.selectPiece(piece)}
    onDragEnd={(evt) => {
      game.movePiece(piece, { x: evt.target.x(), y: evt.target.y() });
      game.unselectPiece();
    }}
  />
);

export default observer(Piece);
