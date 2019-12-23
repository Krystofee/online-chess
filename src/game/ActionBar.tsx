import React from 'react';
import Flexbox from '../Flexbox';

type Props = {
  game: IChessGameStore;
};

const ActionBar = ({ game }: Props) => {
  return (
    <Flexbox justifyContent="flex-end">
      <button onClick={() => window.location.replace('/')} type="button">
        back
      </button>
    </Flexbox>
  );
};

export default ActionBar;
