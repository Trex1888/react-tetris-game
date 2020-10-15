import { useState, useCallback } from 'react';
import { TETROMINOS, randomTetromino } from '../tetrominos';
import { STAGE_WIDTH, checkCollision } from '../gameHelper';

export const usePlayer = () => {
  const [player, setPlayer] = useState({
    pos: { x: 0, y: 0 },
    tetromino: TETROMINOS[0].shape,
    collided: false,
  });

  function rotate(matrix, dir) {
    const rotatedTetro = matrix.map((_, index) =>
      matrix.map((col) => col[index])
    );

    if (dir > 0) return rotatedTetro.map((row) => row.reverse());
    return rotatedTetro.reverse();
  }

  function playerRotate(stage, dir) {
    const clone = JSON.parse(JSON.stringify(player));
    clone.tetromino = rotate(clone.tetromino, dir);

    const pos = clone.pos.x;
    let offset = 1;
    while (checkCollision(clone, stage, { x: 0, y: 0 })) {
      clone.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > clone.tetromino[0].length) {
        rotate(clone.tetromino, -dir);
        clone.pos.x = pos;
        return;
      }
    }

    setPlayer(clone);
  }

  const updatePlayerPos = ({ x, y, collided }) => {
    setPlayer((prev) => ({
      ...prev,
      pos: { x: (prev.pos.x += x), y: (prev.pos.y += y) },
      collided,
    }));
  };

  const resetPlayer = useCallback(() => {
    setPlayer({
      pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
      tetromino: randomTetromino().shape,
      collided: false,
    });
  }, []);

  return [player, updatePlayerPos, resetPlayer, playerRotate];
};
