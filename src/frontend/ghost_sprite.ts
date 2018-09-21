import { Board } from "../backend/board";
import { Ghost } from "../backend/ghost";


export class GhostSprite extends Phaser.Sprite {
    readonly board: Board;
    readonly ghost: Ghost;

    tile_dim: number;

    constructor(viewer: Phaser.Game, board: Board,
        tile_dim: number, ghost: Ghost) {
        //var g = new Phaser.Graphics(viewer, 0, 0);
        //g.beginFill(0xE74C3C);
        //g.drawCircle(0, 0, tile_dim * 1.5);
        //g.endFill();

        //super(viewer, 0, 0, g.generateTexture());
        super(viewer, 0, 0);
        this.board = board;
        this.ghost = ghost;
        this.tile_dim = tile_dim;

        // set anchor to center
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;

        this.position.x = this.ghost.x * tile_dim;
        this.position.y = this.ghost.y * tile_dim;

        viewer.add.existing(this);
    }

    update(): void {
        this.position.x = this.ghost.x * this.tile_dim;
        this.position.y = this.ghost.y * this.tile_dim;
    }
}
