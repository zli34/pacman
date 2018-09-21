import { Coord } from "../backend/coord";
import { Board } from "../backend/board";
import { Dot } from "../backend/dot";

export class DotSprite extends Phaser.Sprite {

    dot: Dot;

    constructor(viewer: Phaser.Game, board: Board,
        tile_dim: number, dot: Dot) {
        // create circle grahpic
        var g = new Phaser.Graphics(viewer, 0, 0);

        var x = (dot.tile % board.num_tiles_x) * tile_dim;
        var y = Math.floor(dot.tile / board.num_tiles_x) * tile_dim;

        g.beginFill(0xF5CBA7);
        if (dot.kind == 1) {
            g.drawCircle(0, 0, tile_dim * 0.3);
            x += tile_dim * 0.7 / 2;
            y += tile_dim * 0.7 / 2;
        } else if (dot.kind == 2) {
            g.drawCircle(0, 0, tile_dim);
        }
        g.endFill();


        // create sprite
        super(viewer, x, y, g.generateTexture());
        this.dot = dot;
        viewer.add.existing(this);
    }

    update(): void {
        if (!this.dot.is_alive()) {
            this.kill();
        }
    }
}
