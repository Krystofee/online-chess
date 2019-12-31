import React from 'react';
import { Image } from 'react-konva';
import { observer } from 'mobx-react';
import configStore from '../stores/configStore';
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
    draggable
    fill={piece.type === 'K' && game.board.inCheck(piece.color) ? '#ff000040' : undefined}
    x={piece.renderPosition.x}
    y={piece.renderPosition.y}
    width={configStore.pieceSize}
    height={configStore.pieceSize}
    image={piece.color === 'B' ? blackPieces[piece.type] : whitePieces[piece.type]}
    onClick={() => {
      game.selectPiece(piece);
    }}
    onTap={() => {
      game.selectPiece(piece);
    }}
    onDragStart={() => {
      game.selectPiece(piece);
    }}
    onDragEnd={(evt) => {
      game.moveBoardPiece(piece, { x: evt.target.x(), y: evt.target.y() });
      piece.render();
    }}
  />
);

export default observer(Piece);
