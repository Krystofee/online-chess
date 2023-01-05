import React from 'react';
import Flexbox from '../Flexbox';
import ConfirmButton from './components/ConfirmButton';

type Props = {
  game: IChessGameStore;
};

const GameModal = ({ game }: Props) => {
  return (
    <div className="p-absolute full-size" style={{ padding: '5rem', backgroundColor: '#000000a0' }}>
      <div style={{ backgroundColor: '#eee', padding: '2rem', borderRadius: 5 }}>
        <Flexbox justifyContent="center" direction="column">
          <ConfirmButton label="Draw" onClick={() => console.log('Draw')} />
          <ConfirmButton label="Resign" onClick={() => console.log('Resign')} />
        </Flexbox>
      </div>
    </div>
  );
};

export default GameModal;
