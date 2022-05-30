import Phaser from "phaser";

import Preloader from "./scenes/Preloader";
import Main from "./scenes/Main";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-container",
  backgroundColor: "#282c34",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      //debug: true,
    },
  },
  scale: {
    zoom: 2,
  },
  scene: [Preloader, Main],
  pixelArt: true,
  render: {
    antialias: false,
    pixelArt: true,
    roundPixels: true,
  },
};

export default new Phaser.Game(config);
