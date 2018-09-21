export class Dot {
    readonly spot: number; // index out of all valid spots for a unit
    readonly tile: number; // index out of all tiles in the game visual
    readonly kind: number; // 0: empty, 1: normal, 2: energizer
    readonly up: number; // tile of dot above
    readonly down: number; // tile of dot below
    readonly left: number; // tile of dot to the left
    readonly right: number; // tile of dot to the right

    alive: boolean;

    constructor(spot: number, tile: number, kind: number,
        up: number, down: number, left: number, right: number) {
        this.spot = spot;
        this.tile = tile;
        this.kind = kind;
        this.up = up;
        this.down = down;
        this.left = left;
        this.right = right;

        this.alive = true;
    }

    is_alive(): boolean {
        return this.alive;
    }

    pick_up(): void {
        this.alive = false;
    }

    get_neighbor(dir: number): number {
        if (dir == 0) {
            return this.up;
        } else if (dir == 1) {
            return this.down;
        } else if (dir == 2) {
            return this.left;
        } else if (dir == 3) {
            return this.right;
        } else {
            throw new Error("Direction must be in {0, 1, 2, 3}");
        }
    }
}
