import { Board } from "../backend/board";
import { Dot } from "../backend/dot";
import { RwPacmanPost } from "../backend/pacman_post";


export class ProbSprite extends Phaser.Sprite {
    readonly board: Board;
    target_spot: number;

    tile_dim: number;

    constructor(viewer: Phaser.Game, board: Board,
        tile_dim: number, target_spot: number) {
        var g = new Phaser.Graphics(viewer, 0, 0);
        g.beginFill(0xFFE733);
        g.drawCircle(0, 0, tile_dim * 1);
        g.endFill();

        super(viewer, 0, 0, g.generateTexture());
        this.board = board;
        this.target_spot = target_spot;
        this.tile_dim = tile_dim;

        // set anchor to center
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;

        var target_dot: Dot = this.board.get_dot(target_spot, true);
        var target_x: number = target_dot.tile % this.board.num_tiles_x;
        var target_y: number = Math.floor(target_dot.tile
            / this.board.num_tiles_x);

        this.position.x = target_x * tile_dim;
        this.position.y = target_y * tile_dim;

        viewer.add.existing(this);
    }

    update(): void {
        var target_dot: Dot = this.board.get_dot(this.target_spot, true);
        var target_x: number = target_dot.tile % this.board.num_tiles_x;
        var target_y: number = Math.floor(target_dot.tile
            / this.board.num_tiles_x);

        this.position.x = target_x * this.tile_dim;
        this.position.y = target_y * this.tile_dim;
    }
}
