import React from 'react';
import { Image } from 'react-konva';
import { observer } from 'mobx-react';
import configStore from './stores/configStore';
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
    fill={piece.type === 'K' && game.board.inCheck(piece.color) ? '#ff000040' : undefined}
    draggable={game.onMove === piece.color && game.player.color === piece.color}
    x={piece.renderPosition.x}
    y={piece.renderPosition.y}
    width={configStore.pieceSize}
    height={configStore.pieceSize}
    image={piece.color === 'B' ? blackPieces[piece.type] : whitePieces[piece.type]}
    onClick={() => {
      game.selectPiece(piece);
    }}
    onDragStart={() => game.selectPiece(piece)}
    onDragEnd={(evt) => {
      game.movePiece(piece, { x: evt.target.x(), y: evt.target.y() });
    }}
  />
);

export default observer(Piece);
