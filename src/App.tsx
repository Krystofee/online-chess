import React from 'react';
import { observer } from 'mobx-react';
import { uuid } from 'uuidv4';
import Flexbox from './Flexbox';

const App = () => {
  const createGame = () => {
    const gameId = uuid();
    window.location.assign(`/${gameId}/`);
  };

  const gameModes = [
    [
      [1, 0],
      [2, 1],
      [3, 0],
    ],
    [
      [3, 2],
      [5, 0],
      [5, 3],
    ],
    [
      [10, 0],
      [10, 5],
      [15, 10],
    ],
  ];

  return (
    <Flexbox justifyContent="center" style={{ padding: '1rem' }}>
      <div className="tiles">
        {gameModes.map((row) => (
          <div className="tiles-row">
            {row.map((mode) => (
              <div className="tiles-tile" onClick={createGame} role="presentation">
                <div>
                  <div className="tiles-tile-content text-center">
                    {mode[0]}|{mode[1]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Flexbox>
  );
};

export default observer(App);
