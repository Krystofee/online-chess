import BlackPawn from './img/b_p.svg';
import BlackRook from './img/b_r.svg';
import BlackKnight from './img/b_n.svg';
import BlackBishop from './img/b_b.svg';
import BlackQueen from './img/b_q.svg';
import BlackKing from './img/b_k.svg';
import WhitePawn from './img/w_p.svg';
import WhiteRook from './img/w_r.svg';
import WhiteKnight from './img/w_n.svg';
import WhiteBishop from './img/w_b.svg';
import WhiteQueen from './img/w_q.svg';
import WhiteKing from './img/w_k.svg';

const getImage = (src: string) => {
  const image = new Image();
  image.src = src;
  return image;
};

export const blackPieces = {
  P: getImage(BlackPawn),
  R: getImage(BlackRook),
  N: getImage(BlackKnight),
  B: getImage(BlackBishop),
  Q: getImage(BlackQueen),
  K: getImage(BlackKing),
};

export const whitePieces = {
  P: getImage(WhitePawn),
  R: getImage(WhiteRook),
  N: getImage(WhiteKnight),
  B: getImage(WhiteBishop),
  Q: getImage(WhiteQueen),
  K: getImage(WhiteKing),
};
