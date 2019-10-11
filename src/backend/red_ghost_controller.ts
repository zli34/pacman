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
import { ProbAssign } from "./assign_prob"

export class RedGhostController extends Controller {

    constructor(units: Array<Unit>, board: Board) {
        super(units, board);
    }

    select_actions(pacman: Pacman, ghosts: Array<Ghost>, 
        posts: Array<Post> = null, target_spot: number = null): Array<number> {
            var best_motions: Array<number> = new Array<number>(this.units.length);
var prob_assign = new ProbAssign(this.board, ghosts, 
    posts[0].probs);
        this.target_spots = prob_assign.probAssign();


            for (var i = 0; i < ghosts.length; i++){
                if (this.units[i].is_alive()){
                var target_dot: Dot = this.board.get_dot(pacman.spot, true);
                var target_x: number = target_dot.tile % this.board.num_tiles_x;
                var target_y: number = Math.floor(target_dot.tile
                    / this.board.num_tiles_x);
        
                var dest_dot: Dot;
                if (this.units[i].dest_spot === -1){
                    dest_dot = this.board.get_dot(this.units[i].spot, true);
                }
                else{
                    dest_dot = this.board.get_dot(this.units[i].dest_spot, true);
                }
                var motion: number = this.units[i].motion;
        
                var best_motion = new Array<number>();
                var second_best_motion = -1;
                var best_dist: number = Infinity;
                var x = dest_dot.tile % this.board.num_tiles_x;
                var y = Math.floor(dest_dot.tile / this.board.num_tiles_x);
                var dist: number = (target_x - x) * (target_x - x)
                + (target_y - y) * (target_y - y);
                
                if (dest_dot.up >= 0 && motion != 1) {
                    var next_x = dest_dot.up % this.board.num_tiles_x;
                    var next_y = Math.floor(dest_dot.up / this.board.num_tiles_x);
                    var next_dist = (target_x - next_x) * (target_x - next_x)
                        + (target_y - next_y) * (target_y - next_y);
                    if (next_dist < dist) {
                        best_motion.push(0);
                    }
                    if (next_dist < best_dist) {
                        best_dist = next_dist;
                        second_best_motion = 0;
                    }
                }
        
                if (dest_dot.left >= 0 && motion != 3) {
                    var next_x = dest_dot.left % this.board.num_tiles_x;
                    var next_y = Math.floor(dest_dot.left / this.board.num_tiles_x);
                    var next_dist = (target_x - next_x) * (target_x - next_x)
                        + (target_y - next_y) * (target_y - next_y);
                    if (next_dist < dist) {
                        best_motion.push(2);
                    }
                    if (next_dist < best_dist) {
                        best_dist = next_dist;
                        second_best_motion = 2;
                    }
                    
                }
        
                if (dest_dot.down >= 0  && motion != 0) {
                    var next_x = dest_dot.down % this.board.num_tiles_x;
                    var next_y = Math.floor(dest_dot.down / this.board.num_tiles_x);
                    var next_dist = (target_x - next_x) * (target_x - next_x)
                        + (target_y - next_y) * (target_y - next_y);
                    if (next_dist < dist) {
                        best_motion.push(1);
                    }
                    if (next_dist < best_dist) {
                        best_dist = next_dist;
                        second_best_motion = 1;
                    }
                }
        
                if (dest_dot.right >= 0 && motion != 2) {
                    var next_x = dest_dot.right % this.board.num_tiles_x;
                    var next_y = Math.floor(dest_dot.right / this.board.num_tiles_x);
                    var next_dist = (target_x - next_x) * (target_x - next_x)
                        + (target_y - next_y) * (target_y - next_y);
                    if (next_dist < dist) {
                        best_motion.push(3);
                    }
                    if (next_dist < best_dist) {
                        best_dist = next_dist;
                        second_best_motion = 3;
                    }
                }
        
                if (second_best_motion < 0) {
                    throw new Error("Did not find a valid move");
                }
        
                if (best_motion.length > 0){
                    best_motions[i] = best_motion[Math.floor(Math.random() * best_motion.length)];
                } 
                else {
                    best_motions[i] = second_best_motion;
                }
                }
            }
        return best_motions;

    }
}
