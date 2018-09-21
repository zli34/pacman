export class Coord {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static from_tile(tile: number, num_tiles_x: number,
        num_tiles_y: number, tile_dim: number) {
        var tile_x = tile % num_tiles_x;
        var tile_y = Math.floor(tile / num_tiles_x);

        var x: number = tile_x * tile_dim;
        var y: number = tile_y * tile_dim;

        return new Coord(x, y);
    }
}
