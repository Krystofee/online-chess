import React from 'react';
import { Layer, Rect } from 'react-konva';
import { observer } from 'mobx-react';
import commonStore from './stores/commonStore';

const Board = () => {
  return (
    <Layer>
      {[...Array(8).keys()].map((x) =>
        [...Array(8).keys()].map((y) => (
          <Rect
            key={`${x}${y}`}
            shadowEnabled
            shadowColor="#000000"
            shadowBlur={5}
            shadowOffsetX={3}
            shadowOffsetY={5}
            shadowOpacity={100}
            x={x * commonStore.pieceSize}
            y={y * commonStore.pieceSize}
            width={commonStore.pieceSize}
            height={commonStore.pieceSize}
            fill={(y % 2 === 0 && x % 2 === 0) || (y % 2 === 1 && x % 2 === 1) ? '#A27860' : '#DFB995'}
          />
        )),
      )}
    </Layer>
  );
};

export default observer(Board);
