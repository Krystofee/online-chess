import { Howl } from 'howler';
import { observable, reaction } from 'mobx';

const StartAudio = require('./sounds/start.mp3');
const MoveAudio = require('./sounds/move.mp3');

class Sounds implements ISounds {
  @observable volume = 0.05;

  start: Howl;
  move: Howl;

  constructor() {
    this.start = new Howl({ src: [StartAudio], volume: this.volume });
    this.move = new Howl({ src: [MoveAudio], volume: this.volume });

    reaction(
      () => this.volume,
      (volume) => {
        this.start.volume(volume);
        this.move.volume(volume);
      },
    );
  }

  playStart = () => {
    this.start.play();
  };

  playMove = () => {
    this.move.play();
  };
}

export default new Sounds() as ISounds;
