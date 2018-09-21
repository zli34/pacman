import { Controller } from "./controller";
import { Unit } from "./unit";
import { Pacman } from "./pacman";
import { Ghost } from "./ghost";
import { Board } from "./board";
import { Dot } from "./dot";
import { RwPacmanPost } from "./pacman_post";

export class RedGhostController extends Controller {

    constructor(unit: Unit, board: Board) {
        super([unit], board);
    }

    select_actions(pacman: Pacman, ghosts: Array<Ghost>, post: RwPacmanPost = null, target_spot: number = null): Array<number> {
        var target_spot: number = pacman.spot;
        var target_dot: Dot = this.board.get_dot(target_spot, true);
        var target_x: number = target_dot.tile % this.board.num_tiles_x;
        var target_y: number = Math.floor(target_dot.tile
            / this.board.num_tiles_x);

        var motion: number = this.units[0].motion;
        var dest_dot: Dot = this.board.get_dot(this.units[0].dest_spot, true);

        var best_motion: number = -1;
        var best_dist: number = Infinity;
        if (dest_dot.up >= 0 && motion != 1) {
            var next_x = dest_dot.up % this.board.num_tiles_x;
            var next_y = Math.floor(dest_dot.up / this.board.num_tiles_x);
            var next_dist = (target_x - next_x) * (target_x - next_x)
                + (target_y - next_y) * (target_y - next_y);
            if (next_dist < best_dist) {
                best_dist = next_dist;
                best_motion = 0;
            }
        }

        if (dest_dot.left >= 0 && motion != 3) {
            var next_x = dest_dot.left % this.board.num_tiles_x;
            var next_y = Math.floor(dest_dot.left / this.board.num_tiles_x);
            var next_dist = (target_x - next_x) * (target_x - next_x)
                + (target_y - next_y) * (target_y - next_y);
            if (next_dist < best_dist) {
                best_dist = next_dist;
                best_motion = 2;
            }
        }

        if (dest_dot.down >= 0  && motion != 0) {
            var next_x = dest_dot.down % this.board.num_tiles_x;
            var next_y = Math.floor(dest_dot.down / this.board.num_tiles_x);
            var next_dist = (target_x - next_x) * (target_x - next_x)
                + (target_y - next_y) * (target_y - next_y);
            if (next_dist < best_dist) {
                best_dist = next_dist;
                best_motion = 1;
            }
        }

        if (dest_dot.right >= 0 && motion != 2) {
            var next_x = dest_dot.right % this.board.num_tiles_x;
            var next_y = Math.floor(dest_dot.right / this.board.num_tiles_x);
            var next_dist = (target_x - next_x) * (target_x - next_x)
                + (target_y - next_y) * (target_y - next_y);
            if (next_dist < best_dist) {
                best_dist = next_dist;
                best_motion = 3;
            }
        }

        if (best_motion < 0) {
            throw new Error("Did not find a valid move");
        }
        return [best_motion];

    }
}
