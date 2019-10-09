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


export class trainGhostControllerRL extends Controller {
    num_iter: number;
    num_points: number;
    power_time: number;
    end: boolean;
    sampledStrategy: number;
    action_list: Array<Array<number>>;
    param_list: Array<Array<Array<number>>>;
    // learning rate
    alpha: number;

    constructor(units: Array<Unit>, board: Board, num_iter: number, alpha: number, param_list: Array<Array<Array<number>>> = null) {
        super(units, board);
        this.num_iter = num_iter;
        this.action_list = new Array<Array<number>>();
        this.alpha = alpha;
        for (var i1 = 0; i1 < 4; i1++){
            for (var i2 = 0; i2 < 4; i2++){
                for (var i3 = 0; i3 < 4; i3++){
                    for (var i4 = 0; i4 < 4; i4++){
                        var temp = new Array<number>(4);
                        temp[0] = i1; temp[1] = i2; temp[2] = i3; temp[3] = i4;
                        this.action_list.push(temp);
                    }
                }
            }
        }

        if (param_list === null){
            // assume 2 strategies
            this.param_list = new Array<Array<Array<number>>>(2);
            for (var b = 0; b < 2; b++){
                this.param_list[b] = new Array<Array<number>>(256);
            for (var i = 0; i < 256; i++){
                var temp = new Array<number>(12);
                for (var j = 0; j < 12; j++){
                    temp[j] = 0;
                }
                this.param_list[b][i] = temp;
            }
        }
        }
        else{
            this.param_list = param_list;

        }
    }

    select_actions(pacman: Pacman, ghosts: Array<Ghost>, posts: Array<Post>): Array<number> {
        var Ks = new Array<number>(posts.length);
        var sum: number = 0;
        for (var b = 0; b < posts.length; b++){
            Ks[b] = posts[b].K;
            sum += Ks[b];
        }

//console.log(Ks[0]);
//console.log(Ks[1]);
//console.log(Ks[2]);
        for (var b = 0; b < posts.length; b++){
            Ks[b] /= sum;
        }
//console.log(Ks[0]);
//console.log(Ks[1]);
//console.log(Ks[2]);

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
//console.log(this.sampledStrategy);
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

    // rollout policy to select the optimal action 
            
                var r_list: Array<number> = new Array();
                for (var i = 0; i < list_actions.length; i++){
                    var actions: Array<number> = list_actions[i];
                    var r: number = 0;

                    for (var j = 0; j < this.num_iter; j++){
                        var dots_: Array<Dot> = new Array<Dot>(this.board.dots.length);
                        for (var k = 0; k < dots_.length; k++){
                            dots_[k] = new Dot(this.board.dots[k].spot, this.board.dots[k].tile, 
                            this.board.dots[k].kind, this.board.dots[k].up, this.board.dots[k].down, 
                        this.board.dots[k].left, this.board.dots[k].right);
                        dots_[k].alive = this.board.dots[k].alive;
                        }
                        var board: Board = new Board(this.board.num_tiles_x, this.board.num_tiles_y, dots_);

                        var dot: Dot = board.get_dot(curr_evader_loc, true);
                        var x_: number = dot.tile % board.num_tiles_x;
        var y_: number = Math.floor(dot.tile
            / board.num_tiles_x);

        var pacman_: Pacman = new Pacman(board, x_, y_, pacman.ticks_per_spot);

        var box: GhostBox = new GhostBox(board, 10, 15, 8, 5,
            [new Slot(12, 17, 12, 17.5, 12, 18), new Slot(14, 17, 14, 17.5, 14, 18), new Slot(16, 17, 16, 17.5, 16, 18)]);

        var ghosts_ = new Array<Ghost>();

        var diff_coordinates = new Array<Array<number>>();

        for (var k = 0; k < 4; k++){
                ghosts_.push(new Ghost(board, true, ghosts[k].x, ghosts[k].y, 
                    ghosts[k].ticks_per_spot, box));
                ghosts_[k].dest_spot = ghosts[k].dest_spot;
                ghosts_[k].motion = ghosts[k].motion;
                // create a list of distances for the four ghosts
                var temp = new Array<number>(2);
                temp[0] = ghosts[k].x-x_; temp[1] = ghosts[k].y-y_;
                diff_coordinates.push(temp);
            }
        // sort by distance
        diff_coordinates.sort(function(a, b){return a[0]*a[0]+a[1]*a[1]-b[0]*b[0]-b[1]*b[1]});
        //console.log('diff: ' + diff_coordinates[0][0] + ' ' + diff_coordinates[0][1] + ' ' + diff_coordinates[1][0] + ' ' + diff_coordinates[1][1] + ' ' + diff_coordinates[2][0] + ' ' + diff_coordinates[2][1] + ' ' + diff_coordinates[3][0] + ' ' + diff_coordinates[3][1]);

                    var ghost_controllers = new RwPacmanGhostController(ghosts_, board);
 

                    if (this.sampledStrategy === 0){
                        var pacman_controller: Controller = new RwPacmanController(
                    pacman_, board);
                        var ep: Post = new RwPacmanPost(board, 
                        ghosts_, pacman_, [curr_evader_loc], 5);
                    }
                    //if (this.sampledStrategy === 1){
                    //    var pacman_controller: Controller = new AvoidRwPacmanController(
                    //pacman_, board, 0);
                    //    var ep: Post = new AvoidRwPacmanPost(board, 
                    //    ghosts_, pacman_, [curr_evader_loc], 5);
                    //}
                    if (this.sampledStrategy === 1){
                        var pacman_controller: Controller = new DotRwPacmanController(
                    pacman_, board, 0);
                        var ep: Post = new ClosestRwPacmanPost(board, 
                        ghosts_, pacman_, [curr_evader_loc], 5, 0.2);
                    }
    if (pacman_.is_alive()) {
        pacman_controller.assign_actions(
            pacman_controller.select_actions(
                pacman_, ghosts_, [ep]));
    }
    pacman_.move();

                        ep.num_points = 1;
                        for (var k = 0; k < posts[this.sampledStrategy].probs.length; k++){
                            ep.probs[k] = posts[this.sampledStrategy].probs[k];
                            ep.probs_new[k] = posts[this.sampledStrategy].probs_new[k];
                        }
                    

                        this.num_points = 0;
                        this.power_time = 0;
                        this.end = false;
                        while(this.num_points <= 150 && this.end === false){
                            this.update(board, pacman_, ghosts_, ep, pacman_controller, 
                            ghost_controllers, actions);
                        }
                        r -= this.num_points;
                    }
                    r = r / this.num_iter;
                    r_list.push(r);
                    
                    // update parameters
                    var ind: number = 0;
                    for (var k = 0; k < 4; k++){
                        ind += (actions[k] * 4**(3-k));
                    }
                    var par: Array<number> = this.param_list[this.sampledStrategy][ind];
                    var s: number = 0;
                    for (var k = 0; k < 4; k++){
                        s += (par[3*k] + par[3*k+1] * diff_coordinates[k][0] + par[3*k+2] * diff_coordinates[k][1]);
                    }
                    for (var k = 0; k < 4; k++){
                        this.param_list[this.sampledStrategy][ind][3*k] += (this.alpha * (r-s) * 1);
                        this.param_list[this.sampledStrategy][ind][3*k+1] += (this.alpha * (r-s) * diff_coordinates[k][0]);
                        this.param_list[this.sampledStrategy][ind][3*k+2] += (this.alpha * (r-s) * diff_coordinates[k][1]);
                    }

                }

                var best_r: number = -Infinity;
                for (var i = 0; i < list_actions.length; i++){
                    if (best_r < r_list[i]){
                        best_r = r_list[i];
                    }
                }
                var possible_actions: Array<Array<number>>;
                possible_actions = new Array();
                for (var i = 0; i < list_actions.length; i++){
                    if (r_list[i] === best_r){
                        possible_actions.push(list_actions[i]);
                    }
                }
            
    return possible_actions[Math.floor(Math.random() * possible_actions.length)];;
}

update(board: Board, pacman: Pacman, ghosts: Array<Ghost>, post: Post, 
pacman_controller: RwPacmanController, ghost_controllers: RwPacmanGhostController, 
actions: Array<number>){

    if (pacman.is_alive()) {
        pacman_controller.assign_actions(
            pacman_controller.select_actions(
                pacman, ghosts, [post]));
    }
    if (this.num_points === 0){
        console.log("actionsU: " + actions);
        ghost_controllers.assign_actions(actions);
console.log("check1");
    }
    else{
        ghost_controllers.assign_actions(ghost_controllers.select_actions(
            pacman, ghosts, [post]));
console.log("check2");
    }

        pacman.move();
//console.log("pacman_location: " + pacman.spot);
        for (let g of ghosts) {
            g.move();
//console.log("ghost_location: " + g.spot);
        }

        var informant = -1;
        var dot: Dot = board.get_dot(pacman.spot, true);
        if (dot.is_alive()) {
            dot.pick_up();
            if (dot.kind === 1){
                informant = pacman.spot;
            }
            if (dot.kind === 2){
                this.power_time += 10; 
                informant = pacman.spot;
            }
        }

        post.update(informant);

        if (this.power_time > 0){
            for (let g of ghosts){
                g.ticks_per_spot = 10;
                if (pacman.x >= g.x - 1 && pacman.x <= g.x + 1 &&
                    pacman.y >= g.y - 1 && pacman.y <= g.y + 1){
                        //this.state.winText.visible = true;
                        //this.state.game.state.restart();
                        g.alive = false;
                        g.route = g.box.assign_slot();
                        g.x = g.route.dest_x;
                        g.y = g.route.dest_y;
                        g.route_counts = 0;

                        // this.state.score += 50;
                    }
            }
            this.power_time--;
        }
        else{
            for (let g of ghosts){
                g.ticks_per_spot = 2;
                if (pacman.x >= g.x - 1 && pacman.x <= g.x + 1 &&
                    pacman.y >= g.y - 1 && pacman.y <= g.y + 1){
                        this.end = true;
            }
        }

    }
    this.num_points++;
    }

}

