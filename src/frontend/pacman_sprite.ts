import { Board } from "../backend/board";
import { Pacman } from "../backend/pacman";


export class PacmanSprite extends Phaser.Sprite {
    readonly board: Board;
    readonly pacman: Pacman;

    tile_dim: number;

    constructor(viewer: Phaser.Game, board: Board,
        tile_dim: number, pacman: Pacman) {
        //var g = new Phaser.Graphics(viewer, 0, 0);
        //g.beginFill(0xFFE733);
        //g.drawCircle(0, 0, tile_dim * 1.5);
        //g.endFill();

        //super(viewer, 0, 0, g.generateTexture());
        super(viewer, 0, 0);
        this.board = board;
        this.pacman = pacman;
        this.tile_dim = tile_dim;

        // set anchor to center
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;

        this.position.x = this.pacman.x * tile_dim;
        this.position.y = this.pacman.y * tile_dim;

        viewer.add.existing(this);
    }

    update(): void {
        this.position.x = this.pacman.x * this.tile_dim;
        this.position.y = this.pacman.y * this.tile_dim;
    }
}
