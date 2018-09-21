import { Board } from "./board";
import { Dot } from "./dot";

export class Unit {
    readonly board: Board;

    // is the unit alive
    alive: boolean;
    // horizontal position of center of unit
    x: number;
    // vertical position of center of unit
    y: number;
    // spot which contains the (x,y) position of unit
    spot: number;
    // spot of destination
    dest_spot: number;

    // direction from controller 0: up, 1: down, 2: left, 3: right
    action: number;
    // direction of motion 0: up, 1: down, 2: left, 3: right
    motion: number;

    // speed of movement
    ticks_per_spot: number;

    // threshold to snap to a spot
    readonly move_eps: number

    constructor(board: Board, alive: boolean, x: number, y: number,
        ticks_per_spot: number) {
        this.board = board;

        this.alive = alive;

        this.x = x;
        this.y = y;
        this.update_spot();

        this.dest_spot = -1;

        this.action = -1;
        this.motion = -1;

        this.ticks_per_spot = ticks_per_spot;
        this.move_eps = (1 / this.ticks_per_spot) * 0.1;
    }

    is_alive(): boolean {
        return this.alive;
    }

    update_spot(): void {
        if (this.alive) {
            // calculate spot from (x,y)
            var tile_x = Math.floor(this.x);
            var tile_y = Math.floor(this.y);

            var tile = tile_y * this.board.num_tiles_x + tile_x;
            this.spot = this.board.get_dot(tile, false).spot;
        } else {
            this.spot = -1;
        }
    }

    update_motion(): void {
        if (this.action < 0) {
            this.motion = -1;
            this.dest_spot = -1;
        } else {
            // update motion given network of spots
            var dot: Dot = this.board.get_dot(this.spot, true);
            var neigh_action_tile = dot.get_neighbor(this.action);
            var neigh_motion_tile;
            neigh_motion_tile =
                this.motion < 0 ? -1 : dot.get_neighbor(this.motion);
            if (neigh_action_tile >= 0) {
                // change direction
                this.motion = this.action;
                this.dest_spot = this.board.tile_to_spot[neigh_action_tile];
            } else if (neigh_motion_tile >= 0) {
                // continue direction
                this.dest_spot = this.board.tile_to_spot[neigh_motion_tile];
            } else {
                // stop
                this.dest_spot = this.spot;
            }
        }
    }

    set_action(new_action: number): void {
        if (new_action == 0 || new_action == 1
            || new_action == 2 || new_action == 3) {
            this.action = new_action;
        }
    }

    move(): void {
        if (this.is_alive()) {
            this.alive_move();
        } else {
            this.dead_move();
        }
    }

    dead_move(): void {
    }

    alive_move(): void {
        if (this.dest_spot >= 0) {
            var dist_to_move = 1.0 / this.ticks_per_spot;
            var dot = this.board.get_dot(this.spot, true);

            var spot_tl_x = (dot.tile % this.board.num_tiles_x);
            var spot_tl_y = Math.floor(dot.tile / this.board.num_tiles_x);

            var dest = this.board.get_dot(this.dest_spot, true);
            var dest_tl_x = (dest.tile % this.board.num_tiles_x);
            var dest_tl_y = Math.floor(dest.tile / this.board.num_tiles_x);

            var dist_to_dest;
            var new_y = this.y;
            var new_x = this.x;
            if (this.motion == 0 || this.motion == 1) {
                dist_to_dest = Math.abs(dest_tl_y + 0.5 - this.y);
                if (this.motion == 0) {
                    new_y = this.y - dist_to_move;
                } else {
                    new_y = this.y + dist_to_move;
                }
            } else if (this.motion == 2 || this.motion == 3) {
                dist_to_dest = Math.abs(dest_tl_x + 0.5 - this.x);
                if (this.motion == 2) {
                    new_x = this.x - dist_to_move;
                } else {
                    new_x = this.x + dist_to_move
                }
            } else {
console.log("motion");
console.log(this.motion);
                throw new Error("Motion must be in {0, 1, 2, 3}");
            }


            if (dist_to_move + this.move_eps > dist_to_dest) {
                // move to dest exactly
                this.x = dest_tl_x + 0.5;
                this.y = dest_tl_y + 0.5;
                this.update_spot();
                this.update_motion();
            } else if (this.motion == 0 && new_y < spot_tl_y) {
                // move up and across tiles
                this.y = dest_tl_y + 1.0 - (spot_tl_y - new_y);
                this.update_spot();
            } else if (this.motion == 1 && new_y >= (spot_tl_y + 1.0)) {
                // move down and across tiles
                this.y = dest_tl_y + (new_y - (spot_tl_y + 1.0));
                this.update_spot();
            } else if (this.motion == 2 && new_x < spot_tl_x) {
                // move left and across tiles
                this.x = dest_tl_x + 1.0 - (spot_tl_x - new_x);
                this.update_spot();
            } else if (this.motion == 3 && new_x >= (spot_tl_x + 1.0)) {
                // move right and across tiles
                this.x = dest_tl_x + (new_x - (spot_tl_x + 1.0));
                this.update_spot();
            } else {
                // any other movement just adjest to new values
                this.x = new_x;
                this.y = new_y;
            }
        } else {
            this.update_motion();
        }
    }
}
