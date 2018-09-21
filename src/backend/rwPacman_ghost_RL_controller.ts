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


export class RwPacmanGhostControllerRL extends Controller {
    num_iter: number;
    num_points: number;
    power_time: number;
    end: boolean;

    constructor(units: Array<Unit>, board: Board, num_iter: number) {
        super(units, board);
        this.num_iter = num_iter;
    }

    select_actions(pacman: Pacman, ghosts: Array<Ghost>, post: RwPacmanPost = null): Array<number> {
        //var target_spot: number = 0;
        //var best_prob: number = 0;
        //for (var i = 0; i < post.probs.length; i++){
        //    if (post.probs[i] > best_prob){
        //        target_spot = i;
        //        best_prob = post.probs[i];
        //    }
        //}
        var best_motions: Array<number> = new Array<number>(this.units.length);
        var prob_assign = new ProbAssign(this.board, ghosts, post.probs);
        this.target_spots = prob_assign.probAssign()
        var best_motions_list: Array<Array<number>>;
        best_motions_list = new Array(this.units.length);
        var curr_evader_loc: number;

        // guess the current location of the evader
        var possible_loc: Array<number> = new Array();
        var max: number = 0;
console.log("probs length");
console.log(post.probs.length);
        for (var i = 0;i < post.probs.length; i++){
            if (max < post.probs[i]){
                max = post.probs[i];
            }
        }

        for (var i = 0; i < post.probs.length; i++){
            if (post.probs[i] === max){
                possible_loc.push(i);
            }
        }
        curr_evader_loc = possible_loc[Math.floor(Math.random() * possible_loc.length)];

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

        for (var k = 0; k < 4; k++){
                ghosts_.push(new Ghost(board, true, ghosts[k].x, ghosts[k].y, 
                    ghosts[k].ticks_per_spot, box));
                ghosts_[k].dest_spot = ghosts[k].dest_spot;
                ghosts_[k].motion = ghosts[k].motion;
            }

            var pacman_controller = new RwPacmanController(
                    pacman_, board);

                    var ghost_controllers = new RwPacmanGhostController(ghosts_, board);

                        var ep: RwPacmanPost = new RwPacmanPost(board, 
                        ghosts_, pacman_, [curr_evader_loc], 5);
                        ep.num_points = 1;
                        for (var k = 0; k < post.probs.length; k++){
                            ep.probs[k] = post.probs[k];
                            ep.probs_new[k] = post.probs_new[k];
                        }

                        this.num_points = 0;
                        this.power_time = 0;
                        this.end = false;
                        while(this.num_points <= 50 && this.end === false){
                            this.update(board, pacman_, ghosts_, ep, pacman_controller, 
                            ghost_controllers, actions);
                        }
                        r -= this.num_points;
console.log("j");
console.log(j);
                    }
                    r = r / this.num_iter;
                    r_list.push(r);
                }
                console.log(r_list.length === list_actions.length);
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

update(board: Board, pacman: Pacman, ghosts: Array<Ghost>, post: RwPacmanPost, 
pacman_controller: RwPacmanController, ghost_controllers: RwPacmanGhostController, 
actions: Array<number>){
    post.update();
    if (pacman.is_alive()) {
        pacman_controller.assign_actions(
            pacman_controller.select_actions(
                pacman, ghosts, post));
    }
    if (this.num_points === 0){
        ghost_controllers.assign_actions(actions);
console.log("check1");
    }
    else{
        ghost_controllers.assign_actions(ghost_controllers.select_actions(
            pacman, ghosts, post));
console.log("check2");
    }

        pacman.move();
        for (let g of ghosts) {
            g.move();
        }

        var dot: Dot = board.get_dot(pacman.spot, true);
        if (dot.is_alive()) {
            dot.pick_up();
            /*if (dot.kind === 1){
                this.state.score += 10;
            }*/
            if (dot.kind === 2){
                this.power_time += 10; 
                // this.state.score += 50;
            }
        }

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
