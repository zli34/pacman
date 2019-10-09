import { Controller } from "./controller";
import { Unit } from "./unit";
import { Pacman } from "./pacman";
import { Ghost } from "./ghost";
import { Board } from "./board";
import { Dot } from "./dot";
import { RwPacmanPost } from "./pacman_post"
import { ProbAssign } from "./assign_prob"
import { GhostBox, Slot } from "./ghost_box";
import { RwPacmanGhostController} from "./rwPacman_ghost_controller"
import { RwPacmanController } from "./rwPacman_controller";
import { AvoidRwPacmanPost } from "./avoid_rwPacman_post";
import { ClosestRwPacmanPost } from "./closest_rwPacman_post";
import { Post } from "./post";
import { DotRwPacmanController } from "./dot_rwPacman_controller";
import { AvoidRwPacmanController } from "./avoid_rwPacman_controller";


export class testGhostControllerRL extends Controller {
    num_iter: number;
    num_points: number;
    power_time: number;
    end: boolean;
    sampledStrategy: number;
    action_list: Array<Array<number>>;
    param_list: Array<Array<Array<number>>>;

    constructor(units: Array<Unit>, board: Board, param_list: Array<Array<Array<number>>>) {
        super(units, board);
        this.param_list = param_list;
    }

    select_actions(pacman: Pacman, ghosts: Array<Ghost>, posts: Array<Post>): Array<number> {
        var Ks = new Array<number>(posts.length);
        var sum: number = 0;
        for (var b = 0; b < posts.length; b++){
            Ks[b] = posts[b].K;
            sum += Ks[b];
        }

        for (var b = 0; b < posts.length; b++){
            Ks[b] /= sum;
        }
        var tot_prob: number = 0;
        var draw: number = Math.random();
        for (var b = 0; b < posts.length; b++){
            var prob_to_add: number = Ks[b];
            tot_prob += prob_to_add;
            if (tot_prob > draw){
                this.sampledStrategy = b;
                break;
            }
        }
        var prob_assign = new ProbAssign(this.board, ghosts, 
            posts[this.sampledStrategy].probs);
            // guess the current location of the evader
        var possible_loc: Array<number> = new Array();
        var max: number = 0;
        for (var i = 0; i < posts[this.sampledStrategy].probs.length; i++){
            if (max < posts[this.sampledStrategy].probs[i]){
                max = posts[this.sampledStrategy].probs[i];
            }
        }

        for (var i = 0; i < posts[this.sampledStrategy].probs.length; i++){
            if (posts[this.sampledStrategy].probs[i] === max){
                possible_loc.push(i);
            }
        }

        this.target_spots = prob_assign.probAssign();
        var curr_evader_loc: number;
        curr_evader_loc = possible_loc[Math.floor(Math.random() * possible_loc.length)];

        var best_motions_list: Array<Array<number>>;
        best_motions_list = new Array(this.units.length);


        for (var i = 0; i < ghosts.length; i++){
        if (this.units[i].is_alive()){
        var target_dot: Dot = this.board.get_dot(this.target_spots[i], true);
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
            best_motions_list[i] = best_motion;
        } 
        else {
            best_motions_list[i] = [second_best_motion];
        }
        }
        else{
            best_motions_list[i] = [0];
        }

    }

            // get the list of best actions for four ghosts
            var list_actions: Array<Array<number>>;
            list_actions = new Array();
            for (var i = 0; i < best_motions_list[0].length; i++){
                var actions_temp: Array<number>;
                actions_temp = new Array<number>();
                actions_temp.push(best_motions_list[0][i]);
                for (var j = 0; j < best_motions_list[1].length; j++){
                    actions_temp.push(best_motions_list[1][j]);
                    for (var k = 0; k < best_motions_list[2].length; k++){
                        actions_temp.push(best_motions_list[2][k]);
                        for (var p = 0; p < best_motions_list[3].length; p++){
                            actions_temp.push(best_motions_list[3][p]);
                            var temp = new Array<number>(4);
                            for (var s = 0; s < actions_temp.length; s++){
                                temp[s] = actions_temp[s];
                            }
                            list_actions.push(temp);
                            actions_temp.pop();
                        }
                        actions_temp.pop();
                    }
                    actions_temp.pop();
                }
            }
            
            if (list_actions.length === 1){
                return list_actions[0];
            }

            for (var i = 0; i <  this.units.length; i++){
                if (!this.units[i].is_alive()){
                    return list_actions[Math.floor(Math.random() * list_actions.length)];
                }
            }

    // directly use param_list to select the optimal action 
    var dot: Dot = this.board.get_dot(curr_evader_loc, true);
    var x_: number = dot.tile % this.board.num_tiles_x;
    var y_: number = Math.floor(dot.tile / this.board.num_tiles_x);
    var diff_coordinates = new Array<Array<number>>();
    for (var k = 0; k < 4; k++){
                // create a list of distances for the four ghosts
                var temp = new Array<number>(2);
                temp[0] = ghosts[k].x-x_; temp[1] = ghosts[k].y-y_;
                diff_coordinates.push(temp);
            }
    // sort by distance
    diff_coordinates.sort(function(a, b){return a[0]*a[0]+a[1]*a[1]-b[0]*b[0]-b[1]*b[1]});

    var possible_actions: Array<Array<number>>;
    possible_actions = new Array();
    var best_r: number = -Infinity;
    for (var i = 0; i < list_actions.length; i++){
        var actions: Array<number> = list_actions[i];
        var ind: number = 0;
        for (var k = 0; k < 4; k++){
            ind += (actions[k] * 4**(3-k));
        }
        var par: Array<number> = this.param_list[this.sampledStrategy][ind];
        var s: number = 0;
        for (var k = 0; k < 4; k++){
            s += (par[3*k] + par[3*k+1] * diff_coordinates[k][0] + par[3*k+2] * diff_coordinates[k][1]);
        }
        if (s >= best_r){
            best_r = s
        }
    }
    for (var i = 0; i < list_actions.length; i++){
        var actions: Array<number> = list_actions[i];
        var ind: number = 0;
        for (var k = 0; k < 4; k++){
            ind += (actions[k] * 4**(3-k));
        }
        var par: Array<number> = this.param_list[this.sampledStrategy][ind];
        var s: number = 0;
        for (var k = 0; k < 4; k++){
            s += (par[3*k] + par[3*k+1] * diff_coordinates[k][0] + par[3*k+2] * diff_coordinates[k][1]);
        }
        if (s === best_r){
            possible_actions.push(actions);
        }
    }
            
    return possible_actions[Math.floor(Math.random() * possible_actions.length)];;
}

}

