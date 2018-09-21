import { Controller } from "./controller";
import { Unit } from "./unit";
import { Pacman } from "./pacman";
import { Ghost } from "./ghost";
import { Board } from "./board";
import { Dot } from "./dot";
import { RwPacmanPost } from "./pacman_post";

export class IntelRwPacmanController extends Controller {
    // weight
    w: number;

    constructor(unit: Unit, board: Board, w: number) {
        super([unit], board);
        this.w = w;
    }

    select_actions(pacman: Pacman, ghosts: Array<Ghost>, post: RwPacmanPost, target_spot: number = null): Array<number> {
        var dest_dot: Dot;
        if (this.units[0].dest_spot === -1){
            dest_dot = this.board.get_dot(this.units[0].spot, true);
        }
        else{
            dest_dot = this.board.get_dot(this.units[0].dest_spot, true);
        }
   
        var motion: number = this.units[0].motion;

        var walkable_actions = new Array<number>();
        var best_pf = Infinity;
        var pfs = Array<number>(4);
        if (dest_dot.up >= 0 && motion != 1){
            var x: number = dest_dot.up % this.board.num_tiles_x;
            var y: number = Math.floor(dest_dot.up
            / this.board.num_tiles_x);
            var pf: number = 0;

            // distance between the ghosts and dest_dot.up
            for (var i = 0; i < ghosts.length; i++){
                pf += 1 / ((x - ghosts[i].x) * (x - ghosts[i].x) + 
                (y - ghosts[i].y) * (y - ghosts[i].y));
            }
            pf = 0.5 * this.w * pf;

            // posterior probability
            pf += (1 - this.w) * post.probs[this.board.tile_to_spot[dest_dot.up]];

            pfs[0] = pf;

            if (pf < best_pf){
                best_pf = pf;
            }
        }
        if (dest_dot.down >= 0 && motion != 0){
            var x: number = dest_dot.down % this.board.num_tiles_x;
            var y: number = Math.floor(dest_dot.down
            / this.board.num_tiles_x);
            var pf: number = 0;

            // distance between the ghosts and dest_dot.down
            for (var i = 0; i < ghosts.length; i++){
                pf += 1 / ((x - ghosts[i].x) * (x - ghosts[i].x) + 
                (y - ghosts[i].y) * (y - ghosts[i].y));
            }
            pf = 0.5 * this.w * pf;

            // posterior probability
            pf += (1 - this.w) * post.probs[this.board.tile_to_spot[dest_dot.down]];

            pfs[1] = pf;

            if (pf < best_pf){
                best_pf = pf;
            }
        }
        if (dest_dot.left >= 0 && motion != 3){
            var x: number = dest_dot.left % this.board.num_tiles_x;
            var y: number = Math.floor(dest_dot.left
            / this.board.num_tiles_x);
            var pf: number = 0;

            // distance between the ghosts and dest_dot.left
            for (var i = 0; i < ghosts.length; i++){
                pf += 1 / ((x - ghosts[i].x) * (x - ghosts[i].x) + 
                (y - ghosts[i].y) * (y - ghosts[i].y));
            }
            pf = 0.5 * this.w * pf;

            // posterior probability
            pf += (1 - this.w) * post.probs[this.board.tile_to_spot[dest_dot.left]];

            pfs[2] = pf;

            if (pf < best_pf){
                best_pf = pf;
            }
        }
        if (dest_dot.right >= 0 && motion !=2){
            var x: number = dest_dot.right % this.board.num_tiles_x;
            var y: number = Math.floor(dest_dot.right
            / this.board.num_tiles_x);
            var pf: number = 0;

            // distance between the ghosts and dest_dot.right
            for (var i = 0; i < ghosts.length; i++){
                pf += 1 / ((x - ghosts[i].x) * (x - ghosts[i].x) + 
                (y - ghosts[i].y) * (y - ghosts[i].y));
            }
            pf = 0.5 * this.w * pf;

            // posterior probability
            pf += (1 - this.w) * post.probs[this.board.tile_to_spot[dest_dot.right]];

            pfs[3] = pf;

            if (pf < best_pf){
                best_pf = pf;
            }
        }

        if (dest_dot.up >= 0 && motion != 1 && pfs[0] === best_pf){
            walkable_actions.push(0);
        }
        if (dest_dot.down >= 0 && motion != 0 && pfs[1] === best_pf){
            walkable_actions.push(1);
        }
        if (dest_dot.left >= 0 && motion != 3 && pfs[2] === best_pf){
            walkable_actions.push(2);
        }
        if (dest_dot.right >= 0 && motion != 2 && pfs[3] === best_pf){
            walkable_actions.push(3);
        }
        return [walkable_actions[Math.floor(Math.random() * walkable_actions.length)]];

    }
}
