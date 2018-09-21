export class Wall {
    readonly tiles: Array<number>;
    readonly closed: boolean;

    constructor(tiles: Array<number>, closed: boolean) {
        this.tiles = tiles;
        this.closed = closed;
    }
}
