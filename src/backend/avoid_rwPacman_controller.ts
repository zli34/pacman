import { Controller } from "./controller";
import { Unit } from "./unit";
import { Pacman } from "./pacman";
import { Ghost } from "./ghost";
import { Board } from "./board";
import { Dot } from "./dot";
import { RwPacmanPost } from "./pacman_post";
import { IntelRwPacmanPost } from "./intel_rwPacman_post";
import { AvoidRwPacmanPost } from "./avoid_rwPacman_post";
import { ClosestRwPacmanPost } from "./closest_rwPacman_post";
import { Post } from "./post";

export class AvoidRwPacmanController extends Controller {
    w: number;
    constructor(unit: Unit, board: Board, w: number) {
        super([unit], board);
        this.w = w;
    }

    select_actions(pacman: Pacman, ghosts: Array<Ghost>, posts: Array<Post>, target_spot: number = null): Array<number> {
        var dest_dot: Dot;
        if (this.units[0].dest_spot === -1){
            dest_dot = this.board.get_dot(this.units[0].spot, true);
        }
        else{
            dest_dot = this.board.get_dot(this.units[0].dest_spot, true);
        }
 
            var all_walkable_actions = new Array<number>();
            var walkable_actions = new Array<number>();
            var best_pf = -Infinity;
            var pfs = Array<number>(4);
            var dest_x: number = dest_dot.tile % this.board.num_tiles_x;
                var dest_y: number = Math.floor(dest_dot.tile
                / this.board.num_tiles_x);
            
            for (let g of ghosts){
                if (pacman.x >= g.x - 5 && pacman.x <= g.x +
                5 && pacman.y >= g.y - 5 &&
                pacman.y <= g.y + 5){

            if (dest_dot.up >= 0){
                all_walkable_actions.push(0);
                var x: number = dest_dot.up % this.board.num_tiles_x;
                var y: number = Math.floor(dest_dot.up
                / this.board.num_tiles_x);
                var pf: number = 0;

                // distance between the ghosts and dest_dot.up
                pf = (x - g.x) * (x - g.x) + (y - g.y) * (y - g.y);
                pfs[0] = pf;

                if (pf > best_pf){
                    best_pf = pf;
                }
            }
            if (dest_dot.down >= 0){
                all_walkable_actions.push(1);
                var x: number = dest_dot.down % this.board.num_tiles_x;
                var y: number = Math.floor(dest_dot.down
                / this.board.num_tiles_x);
                var pf: number = 0;

                // distance between the ghosts and dest_dot.up
                pf = (x - g.x) * (x - g.x) + (y - g.y) * (y - g.y);

                pfs[1] = pf;

                if (pf > best_pf){
                    best_pf = pf;
                }
            }
            if (dest_dot.left >= 0){
                all_walkable_actions.push(2);
                var x: number = dest_dot.left % this.board.num_tiles_x;
                var y: number = Math.floor(dest_dot.left
                / this.board.num_tiles_x);
                var pf: number = 0;

                // distance between the ghosts and dest_dot.up
                pf = (x - g.x) * (x - g.x) + (y - g.y) * (y - g.y);

                pfs[2] = pf;

                if (pf > best_pf){
                    best_pf = pf;
                }
            }
            if (dest_dot.right >= 0){
                all_walkable_actions.push(3);
                var x: number = dest_dot.right % this.board.num_tiles_x;
                var y: number = Math.floor(dest_dot.right
                / this.board.num_tiles_x);
                var pf: number = 0;

                // distance between the ghosts and dest_dot.up
                pf = (x - g.x) * (x - g.x) + (y - g.y) * (y - g.y);

                pfs[3] = pf;

                if (pf > best_pf){
                    best_pf = pf;
                }
            }

            if (dest_dot.up >= 0 && pfs[0] === best_pf){
                walkable_actions.push(0);
            }
            if (dest_dot.down >= 0 && pfs[1] === best_pf){
                walkable_actions.push(1);
            }
            if (dest_dot.left >= 0 && pfs[2] === best_pf){
                walkable_actions.push(2);
            }
            if (dest_dot.right >= 0 && pfs[3] === best_pf){
                walkable_actions.push(3);
            }

            if (Math.random() > this.w){
                return [walkable_actions[Math.floor(Math.random() * walkable_actions.length)]];
            }
            else{
                return [all_walkable_actions[Math.floor(Math.random() * all_walkable_actions.length)]];
            }

            } //if
        } //for g

    }
}
