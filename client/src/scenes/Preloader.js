import Phaser from "phaser";
import game from "../PhaserGame";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  createAnims() {}

  preload() {
    this.load.image("tiles", "assets/DungeonTileset.png");
    this.load.tilemapTiledJSON("dungeon", "assets/dungeon.json");
    this.load.spritesheet("king", "assets/king.png", {
      frameWidth: 16,
      frameHeight: 32,
    });
    this.load.spritesheet("princess", "assets/princess.png", {
      frameWidth: 16,
      frameHeight: 32,
    });
    this.load.spritesheet("merchant", "assets/merchant.png", {
      frameWidth: 16,
      frameHeight: 32,
    });
    this.load.spritesheet("shoekeeper", "assets/shoekeeper.png", {
      frameWidth: 16,
      frameHeight: 32,
    });
    this.load.spritesheet("blacksmith", "assets/blacksmith.png", {
      frameWidth: 16,
      frameHeight: 32,
    });
    this.load.spritesheet("nametag", "assets/nametag.png", {
      frameWidth: 64,
      frameHeight: 16,
    });
    this.load.spritesheet("dungeon", "assets/dungeon.png", {
      frameWidth: 16,
      frameHeight: 20,
    });
    this.load.spritesheet("queen", "assets/queen.png", {
      frameWidth: 16,
      frameHeight: 32,
    });
  }

  create() {
    game.events.on("start", (name) => {
      this.scene.start("main", {
        characterName: name,
      });
    });
  }
}
