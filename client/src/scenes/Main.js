import Phaser from "phaser";
import game from "../PhaserGame";

export default class Main extends Phaser.Scene {
  constructor() {
    super("main");
    this.kingOverlapped = false;
    this.princessOverlapped = false;
    this.merchantOverlapped = false;
    this.shoekeeperOverlapped = false;
    this.dungeonOverlapped = false;
    this.blacksmithOverlapped = false;
  }

  init(data) {
    this.characterName = data.characterName;
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
    this.anims.create({
      key: "princess_idle",
      frames: this.anims.generateFrameNumbers("princess"),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "merchant_idle",
      frames: this.anims.generateFrameNumbers("merchant"),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "shoekeeper_idle",
      frames: this.anims.generateFrameNumbers("shoekeeper"),
      frameRate: 5,
      repeat: -1,
    });
    this.anims.create({
      key: "blacksmith_idle",
      frames: this.anims.generateFrameNumbers("blacksmith"),
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
    this.kingText = this.add.text(0, 0, "왕", {
      color: "black",
      fontSize: "10px",
    });
    this.kingText.x = this.nameTag.x - this.kingText.width / 2;
    this.kingText.y = this.nameTag.y - this.kingText.height / 2;

    // 공주 NPC 생성
    this.princess = this.physics.add.sprite(
      200,
      game.config.height / 6,
      "princess"
    );
    this.princess.setScale(2);

    this.nameTag = this.add.sprite(
      this.princess.x,
      this.princess.y - 16,
      "nametag"
    );
    this.princessText = this.add.text(0, 0, "공주", {
      color: "black",
      fontSize: "10px",
    });
    this.princessText.x = this.nameTag.x - this.princessText.width / 2;
    this.princessText.y = this.nameTag.y - this.princessText.height / 2;

    // 상인 NPC 생성
    this.merchant = this.physics.add.sprite(
      400,
      game.config.height / 6,
      "merchant"
    );
    this.merchant.setScale(2);

    this.nameTag = this.add.sprite(
      this.merchant.x,
      this.merchant.y - 16,
      "nametag"
    );
    this.merchantText = this.add.text(0, 0, "상인", {
      color: "black",
      fontSize: "10px",
    });
    this.merchantText.x = this.nameTag.x - this.merchantText.width / 2;
    this.merchantText.y = this.nameTag.y - this.merchantText.height / 2;

    // 슈키퍼 NPC 생성
    this.shoekeeper = this.physics.add.sprite(
      500,
      game.config.height / 6,
      "shoekeeper"
    );
    this.shoekeeper.setScale(2);

    this.nameTag = this.add.sprite(
      this.shoekeeper.x,
      this.shoekeeper.y - 16,
      "nametag"
    );
    this.shoekeeperText = this.add.text(0, 0, "거래소", {
      color: "black",
      fontSize: "10px",
    });
    this.shoekeeperText.x = this.nameTag.x - this.shoekeeperText.width / 2;
    this.shoekeeperText.y = this.nameTag.y - this.shoekeeperText.height / 2;

    // 대장장이 NPC 생성
    this.blacksmith = this.physics.add.sprite(
      300,
      game.config.height / 4,
      "blacksmith"
    );
    this.blacksmith.setScale(2);

    this.nameTag = this.add.sprite(
      this.blacksmith.x,
      this.blacksmith.y - 16,
      "nametag"
    );
    this.blacksmithText = this.add.text(0, 0, "무기합성", {
      color: "black",
      fontSize: "10px",
    });
    this.blacksmithText.x = this.nameTag.x - this.blacksmithText.width / 2;
    this.blacksmithText.y = this.nameTag.y - this.blacksmithText.height / 2;

    // 던전 입구 생성
    this.dungeon = this.physics.add.sprite(
      200,
      game.config.height / 3,
      "dungeon"
    );
    this.dungeon.setScale(2);

    this.nameTag = this.add.sprite(
      this.dungeon.x,
      this.dungeon.y - 16,
      "nametag"
    );
    this.dungeonText = this.add.text(0, 0, "던전", {
      color: "black",
      fontSize: "10px",
    });
    this.dungeonText.x = this.nameTag.x - this.dungeonText.width / 2;
    this.dungeonText.y = this.nameTag.y - this.dungeonText.height / 2;

    // 캐릭터와 NPC overlap 이벤트
    this.physics.add.overlap(this.player, this.king, () => {
      this.kingOverlapped = true;
    });
    this.physics.add.overlap(this.player, this.princess, () => {
      this.princessOverlapped = true;
    });
    this.physics.add.overlap(this.player, this.merchant, () => {
      this.merchantOverlapped = true;
    });
    this.physics.add.overlap(this.player, this.shoekeeper, () => {
      this.shoekeeperOverlapped = true;
    });
    this.physics.add.overlap(this.player, this.blacksmith, () => {
      this.blacksmithOverlapped = true;
    });
    this.physics.add.overlap(this.player, this.dungeon, () => {
      this.dungeonOverlapped = true;
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
    this.princess.play("princess_idle");
    this.merchant.play("merchant_idle");
    this.shoekeeper.play("shoekeeper_idle");
    this.blacksmith.play("blacksmith_idle");

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
      if (this.princessOverlapped) game.events.emit("enter", "2");
      if (this.merchantOverlapped) game.events.emit("enter", "3");
      if (this.shoekeeperOverlapped) game.events.emit("enter", "4");
      if (this.dungeonOverlapped) game.events.emit("enter", "5");
      if (this.blacksmithOverlapped) game.events.emit("enter", "6");
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
    this.princessOverlapped = false;
    this.merchantOverlapped = false;
    this.shoekeeperOverlapped = false;
    this.dungeonOverlapped = false;
    this.blacksmithOverlapped = false;
  }
}
