import { Coord } from "../backend/coord";
import { Board } from "../backend/board";
import { Wall } from "../backend/wall";

export class WallSprite extends Phaser.Sprite {
    constructor(viewer: Phaser.Game, board: Board,
        tile_dim: number, wall: Wall) {
        // get starting coordinate of first tile in the wall
        var start_c = Coord.from_tile(wall.tiles[0],
            board.num_tiles_x, board.num_tiles_y, tile_dim);

        // get bounding box for wall sprite
        var min_x: number = Infinity;
        var max_x: number = -Infinity;
        var min_y: number = Infinity;
        var max_y: number = -Infinity;

        for (let tile of wall.tiles) {
            var c: Coord = Coord.from_tile(tile,
                board.num_tiles_x, board.num_tiles_y, tile_dim);

            min_x = Math.min(min_x, c.x);
            max_x = Math.max(max_x, c.x + tile_dim);

            min_y = Math.min(min_y, c.y);
            max_y = Math.max(max_y, c.y + tile_dim);
        }

        var width = max_x - min_x;
        var height = max_y - min_y;

        // crate wall using a line graphic
        var g = new Phaser.Graphics(viewer, 0, 0);

        g.lineStyle(0.25 * tile_dim, 0x0000ff, 1);
        g.moveTo(start_c.x - min_x + tile_dim * 0.5,
            start_c.y - min_y + tile_dim * 0.5);
        for (let tile of wall.tiles) {
            var c = Coord.from_tile(tile,
                board.num_tiles_x, board.num_tiles_y, tile_dim);

            var x = c.x - min_x + tile_dim * 0.5;
            var y = c.y - min_y + tile_dim * 0.5;
            g.lineTo(x, y);
        }

        // connect back to the start if wall is closed
        if (wall.closed) {
            var x = start_c.x - min_x + tile_dim * 0.5;
            var y = start_c.y - min_y + tile_dim * 0.5;
            g.lineTo(x, y);
        }

        g.endFill();


        // create sprite
        super(viewer, min_x + tile_dim * 0.25,
            min_y + tile_dim * 0.25, g.generateTexture());
        viewer.add.existing(this);
    }
}
