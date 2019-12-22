import React from 'react';
import Flexbox from '../Flexbox';

type Props = {
  game: IChessGameStore;
};

const ActionBar = ({ game }: Props) => {
  return (
    <Flexbox justifyContent="flex-end">
      <button>
        <span role="img">🍔</span>
      </button>
      <button onClick={() => window.location.replace('/')} type="button">
        back
      </button>
      <button
        onClick={() => {
          game.board.invert = !game.board.invert;
        }}
        type="button"
      >
        rotate
      </button>
    </Flexbox>
  );
};

export default ActionBar;
