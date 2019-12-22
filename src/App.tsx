import React from 'react';
import { observer } from 'mobx-react';
import { uuid } from 'uuidv4';

const App = () => {
  const createGame = () => {
    const gameId = uuid();
    window.location.assign(`/${gameId}/`);
  };

  return (
    <div className="center" style={{ width: 800 }}>
      <div className="text-center">
        <div style={{ paddingTop: 100 }}>
          <button className="pure-button pure-button-primary button-xlarge" type="button" onClick={createGame}>
            Create new game
          </button>
        </div>
      </div>
    </div>
  );
};

export default observer(App);
