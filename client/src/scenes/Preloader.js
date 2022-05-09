import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    this.load.image("tiles", "assets/DungeonTileset.png");
    this.load.tilemapTiledJSON("dungeon", "assets/dungeon.json");
    this.load.spritesheet("player", "assets/knight.png", {
      frameWidth: 16,
      frameHeight: 32,
    });
    this.load.spritesheet("king", "assets/king.png", {
      frameWidth: 16,
      frameHeight: 32,
    });
    this.load.spritesheet("nametag", "assets/nametag.png", {
      frameWidth: 64,
      frameHeight: 16,
    });
  }

  create() {
    this.scene.start("main");
  }
}
