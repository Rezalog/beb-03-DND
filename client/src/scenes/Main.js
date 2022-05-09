import Phaser from "phaser";
import game from "../PhaserGame";

export default class Main extends Phaser.Scene {
  constructor() {
    super("main");
    this.kingOverlapped = false;
  }

  init(data) {
    this.characterName = data.characterName;
    this.king = data.king;
    this.wallslayer = data.wallslayer;
    console.log(data);
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();

    this.load.spritesheet("player", `assets/${this.characterName}.png`, {
      frameWidth: 16,
      frameHeight: 32,
    });
  }

  createAnims() {
    this.anims.create({
      key: "player_idle",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.create({
      key: "player_walk",
      frames: this.anims.generateFrameNumbers("player", { start: 4, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "king_idle",
      frames: this.anims.generateFrameNumbers("king"),
      frameRate: 5,
      repeat: -1,
    });
  }

  create() {
    // 타일맵 생성
    const map = this.make.tilemap({
      key: "dungeon",
    });
    const tileset = map.addTilesetImage("dungeon", "tiles");

    map.createLayer("Grounds", tileset);
    this.wallslayer = map.createLayer("Walls", tileset);

    this.wallslayer.setCollisionByProperty({ collides: true });

    const debugGraphics = this.add.graphics().setAlpha(0.7);
    this.wallslayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
      faceColor: new Phaser.Display.Color(40, 39, 37, 255),
    });
    // 캐릭터 생성
    this.player = this.physics.add.sprite(
      100,
      game.config.height / 3,
      "player"
    );
    this.player.body.setSize(this.player.width, this.player.height * 0.5);
    this.player.body.offset.y = this.player.height * 0.5;

    this.player.setScale(2);

    // 왕 NPC 생성
    this.king = this.physics.add.sprite(400, game.config.height / 3, "king");
    this.king.setScale(2);

    this.nameTag = this.add.sprite(this.king.x, this.king.y - 16, "nametag");
    this.text = this.add.text(0, 0, "왕", { color: "black", fontSize: "10px" });
    this.text.x = this.nameTag.x - this.text.width / 2;
    this.text.y = this.nameTag.y - this.text.height / 2;

    // 캐릭터와 NPC overlap 이벤트
    this.physics.add.overlap(this.player, this.king, () => {
      this.kingOverlapped = true;
    });

    // 캐릭터와 벽 Collider
    this.physics.add.collider(this.player, this.wallslayer);

    // 카메라 세팅
    this.cameras.main.setBounds(0, 0, window.innerWidth, window.innerHeight);
    this.cameras.main.startFollow(this.player, true);

    // 캐릭터 애니메이션 생성
    this.createAnims();

    // 애니메이션 실행
    this.player.play("player_idle");
    this.king.play("king_idle");

    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
  }

  update() {
    const moveAmt = 300;
    this.player.setDrag(5000);

    if (this.cursors.right.isDown) {
      this.player.setVelocityX(moveAmt);
      this.player.scaleX = 2;
      this.player.body.offset.x = 0;
    }
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-moveAmt);
      this.player.scaleX = -2;
      this.player.body.offset.x = 16;
    }
    if (this.cursors.up.isDown) this.player.setVelocityY(-moveAmt);
    if (this.cursors.down.isDown) this.player.setVelocityY(moveAmt);
    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      if (this.kingOverlapped) game.events.emit("enter", "1");
    }

    if (
      this.cursors.right.isDown ||
      this.cursors.left.isDown ||
      this.cursors.up.isDown ||
      this.cursors.down.isDown
    ) {
      this.player.play("player_walk", true);
    }

    if (
      this.cursors.right.isUp &&
      this.cursors.left.isUp &&
      this.cursors.up.isUp &&
      this.cursors.down.isUp
    ) {
      this.player.play("player_idle", true);
    }

    this.kingOverlapped = false;
  }
}
