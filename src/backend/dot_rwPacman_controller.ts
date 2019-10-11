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

export class DotRwPacmanController extends Controller {
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
            
            var c = 0;
            for (let g of ghosts){
                if (pacman.x >= g.x - 5 && pacman.x <= g.x +
                5 && pacman.y >= g.y - 5 &&
                pacman.y <= g.y + 5){
                c = 1;
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
        
            if (c === 0){
                var best_dist: number = Infinity;
                var best_dots = new Array<Dot>();
                var dists = new Array<number>(this.board.dots.length);

                for (let board_dot of this.board.dots){
                    if (board_dot.is_alive() && board_dot.kind > 0){
                    var board_dot_x: number = board_dot.tile % this.board.num_tiles_x;
                var board_dot_y: number = Math.floor(board_dot.tile
                / this.board.num_tiles_x);
                var dist: number = (board_dot_x - dest_x) * (board_dot_x - dest_x) + 
                (board_dot_y - dest_y) * (board_dot_y - dest_y);
                dists[board_dot.spot] = dist; 
                if (dist < best_dist && dist != 0){
                    best_dist = dist;
                }
                }
                }

                // get the best dots
                for (var k = 0; k < this.board.dots.length; k++){
                    if (dists[k] === best_dist){
                        best_dots.push(this.board.dots[k]);
                    }
                }

                var best_dot = best_dots[Math.floor(Math.random() * best_dots.length)]
        
                var best_action: number = 0;
                best_dist = Infinity;
                var best_dot_x = best_dot.tile % this.board.num_tiles_x;
                var best_dot_y = Math.floor(best_dot.tile / this.board.num_tiles_x);


        if (dest_dot.up >= 0) {
            all_walkable_actions.push(0);
            var next_x = dest_dot.up % this.board.num_tiles_x;
            var next_y = Math.floor(dest_dot.up / this.board.num_tiles_x);
            var next_dist = (next_x - best_dot_x) * (next_x - best_dot_x) +
            (next_y - best_dot_y) * (next_y - best_dot_y);
            if (next_dist < best_dist) {
                best_dist = next_dist;
                best_action = 0;
            }
        }
        

        if (dest_dot.down >= 0) {
            all_walkable_actions.push(1);
            var next_x = dest_dot.down % this.board.num_tiles_x;
            var next_y = Math.floor(dest_dot.down / this.board.num_tiles_x);
            var next_dist = (next_x - best_dot_x) * (next_x - best_dot_x) +
            (next_y - best_dot_y) * (next_y - best_dot_y);
            if (next_dist < best_dist) {
                best_dist = next_dist;
                best_action = 1;
            }
        }
        

        if (dest_dot.left >= 0) {
            all_walkable_actions.push(2);
            var next_x = dest_dot.left % this.board.num_tiles_x;
            var next_y = Math.floor(dest_dot.left / this.board.num_tiles_x);
            var next_dist = (next_x - best_dot_x) * (next_x - best_dot_x) +
            (next_y - best_dot_y) * (next_y - best_dot_y);
            if (next_dist < best_dist) {
                best_dist = next_dist;
                best_action = 2;
            }
        }
        

        if (dest_dot.right >= 0) {
            all_walkable_actions.push(3);
            var next_x = dest_dot.right % this.board.num_tiles_x;
            var next_y = Math.floor(dest_dot.right / this.board.num_tiles_x);
            var next_dist = (next_x - best_dot_x) * (next_x - best_dot_x) +
            (next_y - best_dot_y) * (next_y - best_dot_y);
            if (next_dist < best_dist) {
                best_dist = next_dist;
                best_action = 3;
            }
        }
        if (Math.random() > this.w){
            return [best_action];
        }
        else{
            return [all_walkable_actions[Math.floor(Math.random() * all_walkable_actions.length)]];
        }    
    }//if c==0


    }
}
