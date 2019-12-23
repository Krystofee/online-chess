import React from 'react';
import Flexbox from '../Flexbox';

type Props = {
  game: IChessGameStore;
};

const ActionBar = ({ game }: Props) => {
  return (
    <Flexbox justifyContent="flex-end">
      <div></div>
    </Flexbox>
  );
};

export default ActionBar;
