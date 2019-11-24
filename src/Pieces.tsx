import React from 'react';
import { Layer } from 'react-konva';
import { observer } from 'mobx-react';
import Piece from './Piece';

type Props = {
  game: IChessGameStore;
};

const Pieces = ({ game }: Props) => {
  return (
    <Layer>
      {game.pieces.map((piece) => (
        <Piece key={piece.id} game={game} piece={piece} />
      ))}
    </Layer>
  );
};

export default observer(Pieces);
