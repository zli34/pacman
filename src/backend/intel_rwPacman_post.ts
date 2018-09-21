import { Pacman } from "./pacman";
import { Ghost } from "./ghost";
import { Board } from "./board";
import { Controller } from "./controller";
import { Dot } from "./dot";
import { RwPacmanPost } from "./pacman_post";

export class IntelRwPacmanPost {
    board: Board;
    ghosts: Array<Ghost>;
    pacman: Pacman;
    probs: Array<number>;
    probs_new: Array<number>;
    num_points: number;
    starting_loc_choices: Array<number>;
    trans_mat: Array<Array<number>>;
    ghost_vision_limit: number;
    w: number;
    post: RwPacmanPost;

    constructor(board: Board, ghosts: Array<Ghost>, pacman: Pacman, starting_loc_choices: Array<number>,
    ghost_vision_limit: number, w: number, post: RwPacmanPost){
        this.board = board;
        this.ghosts = ghosts;
        this.pacman = pacman;
        this.probs = new Array<number>(this.board.dots.length);
        this.probs_new = new Array<number>(this.board.dots.length);
        this.num_points = 0;
        this.starting_loc_choices = starting_loc_choices;
        this.ghost_vision_limit = ghost_vision_limit;
        this.w = w;
        this.post = post;

        this.trans_mat = new Array(this.board.dots.length);
        for (var i = 0; i < this.board.dots.length; i++){
            this.trans_mat[i] = new Array<number>(this.board.dots.length);
        }

    }

    update(): void{
        var sum = 0;
        this.post.update();
        this.updateTransMat();
        if (this.num_points === 0){
            // initialize probs_new and uniform over each starting location
            for (var i = 0; i < this.board.dots.length; i++){
                if (this.starting_loc_choices.indexOf(i) >= 0){
                    this.probs_new[i] = 1 / this.starting_loc_choices.length;
                }
                else{
                    this.probs_new[i] = 0;
                }               
            }
            for (var i = 0; i < this.board.dots.length; i++){
                this.probs[i] = this.probs_new[i];
            }

            // adjust for ghosts' locations and vision limit
            for (let g of this.ghosts){
                var ghost_dot = this.board.get_dot(g.spot, true);
                if (this.pacman.x >= g.x - this.ghost_vision_limit && this.pacman.x <= g.x +
                this.ghost_vision_limit && this.pacman.y >= g.y - this.ghost_vision_limit &&
                this.pacman.y <= g.y + this.ghost_vision_limit){
                    for (var i = 0; i < this.board.dots.length; i++){
                        this.probs[i] = 0;
                    }
                    this.probs[this.pacman.spot] = 1;
                    break;
                }
                else{
                    for (var i = 0; i < this.board.dots.length; i++){
                        var dot = this.board.get_dot(i, true);
                        var spot_tl_x = (dot.tile % this.board.num_tiles_x);
                        var spot_tl_y = Math.floor(dot.tile / this.board.num_tiles_x);
                        if (spot_tl_x >= g.x - this.ghost_vision_limit && spot_tl_x <= 
                        g.x + this.ghost_vision_limit - 0.5 && spot_tl_y >= g.y - 
                        this.ghost_vision_limit && spot_tl_y <= g.y + this.ghost_vision_limit - 0.5){
                            this.probs[i] = 0;
                        }
                    }
                }
                
            }

            // scale the probability (F)
            for (var i = 0; i < this.board.dots.length; i++){
                sum += this.probs[i];
            }
            for (var i = 0; i < this.board.dots.length; i++){
                this.probs[i] = this.probs[i] / sum;
            }


        }
        else{
            // turn one transition from previous location probabilities
            for (var j = 0; j < this.board.dots.length; j++){
                this.probs_new[j] = 0;
                for (var i = 0; i < this.board.dots.length; i++){
                    this.probs_new[j] += this.probs[i] * this.trans_mat[i][j];
                }
            }
            
//if (this.num_points === 1){
//console.log(this.num_points);
//                for (var i = 0; i < this.board.dots.length; i++){
//                    if (this.probs[i] > 0){
//                        console.log(i);
//                        console.log(this.probs[i]);
//                    }
//                }
//                
//            }

            //if (this.num_points == 1){
            //    for (var i = 0; i < this.board.dots.length; i++){
            //        if (this.probs_new[i] > 0){
            //            console.log(i);
            //            console.log(this.probs_new[i]);
            //        }
            //    }
            //}

            for (var i = 0; i < this.board.dots.length; i++){
                this.probs[i] = this.probs_new[i];
            }
            // adjust for ghosts' locations and vision limit
            for (let g of this.ghosts){
                var ghost_dot = this.board.get_dot(g.spot, true);
                if (this.pacman.x >= g.x - this.ghost_vision_limit && this.pacman.x <= g.x +
                this.ghost_vision_limit && this.pacman.y >= g.y - this.ghost_vision_limit &&
                this.pacman.y <= g.y + this.ghost_vision_limit){
                    for (var i = 0; i < this.board.dots.length; i++){
                        this.probs[i] = 0;
                    }
                    this.probs[this.pacman.spot] = 1;
                    break;
                }
                else{
                    for (var i = 0; i < this.board.dots.length; i++){
                        var dot = this.board.get_dot(i, true);
                        var spot_tl_x = (dot.tile % this.board.num_tiles_x);
                        var spot_tl_y = Math.floor(dot.tile / this.board.num_tiles_x);
                        if (spot_tl_x >= g.x - this.ghost_vision_limit && spot_tl_x <= 
                        g.x + this.ghost_vision_limit - 0.5 && spot_tl_y >= g.y - 
                        this.ghost_vision_limit && spot_tl_y <= g.y + this.ghost_vision_limit - 0.5){
                            this.probs[i] = 0;
                        }
                    }
                }
                
            }

            // scale the probability (F)
            for (var i = 0; i < this.board.dots.length; i++){
                sum += this.probs[i];
            }
            for (var i = 0; i < this.board.dots.length; i++){
                this.probs[i] = this.probs[i] / sum;
            }

        }
        ++this.num_points;

    } // update

    updateTransMat(): void{
        for (var i = 0; i < this.board.dots.length; i++){
            var dot: Dot = this.board.get_dot(i, true);

            var walkable_spots = new Array<number>();
            var best_pf = Infinity;
            var pfs = Array<number>(4);
            if (dot.up >= 0){
                var x: number = dot.up % this.board.num_tiles_x;
                var y: number = Math.floor(dot.up
                / this.board.num_tiles_x);
                var pf: number = 0;

                // distance between the ghosts and dest_dot.up
                for (var i = 0; i < this.ghosts.length; i++){
                    pf += 1 / ((x - this.ghosts[i].x) * (x - this.ghosts[i].x) + 
                    (y - this.ghosts[i].y) * (y - this.ghosts[i].y));
                }
                pf = 0.5 * this.w * pf;

                // posterior probability
                pf += (1 - this.w) * this.post.probs[this.board.tile_to_spot[dot.up]];

                pfs[0] = pf;

                if (pf < best_pf){
                    best_pf = pf;
                }
            }
            if (dot.down >= 0){
                var x: number = dot.down % this.board.num_tiles_x;
                var y: number = Math.floor(dot.down
                / this.board.num_tiles_x);
                var pf: number = 0;

                // distance between the ghosts and dest_dot.down
                for (var i = 0; i < this.ghosts.length; i++){
                    pf += 1 / ((x - this.ghosts[i].x) * (x - this.ghosts[i].x) + 
                    (y - this.ghosts[i].y) * (y - this.ghosts[i].y));
                }
                pf = 0.5 * this.w * pf;

                // posterior probability
                pf += (1 - this.w) * this.post.probs[this.board.tile_to_spot[dot.down]];

                pfs[1] = pf;

                if (pf < best_pf){
                    best_pf = pf;
                }
            }
            if (dot.left >= 0){
                var x: number = dot.left % this.board.num_tiles_x;
                var y: number = Math.floor(dot.left
                / this.board.num_tiles_x);
                var pf: number = 0;

                // distance between the ghosts and dest_dot.left
                for (var i = 0; i < this.ghosts.length; i++){
                    pf += 1 / ((x - this.ghosts[i].x) * (x - this.ghosts[i].x) + 
                    (y - this.ghosts[i].y) * (y - this.ghosts[i].y));
                }
                pf = 0.5 * this.w * pf;

                // posterior probability
                pf += (1 - this.w) * this.post.probs[this.board.tile_to_spot[dot.left]];

                pfs[2] = pf;

                if (pf < best_pf){
                    best_pf = pf;
                }
            }
            if (dot.right >= 0){
                var x: number = dot.right % this.board.num_tiles_x;
                var y: number = Math.floor(dot.right
                / this.board.num_tiles_x);
                var pf: number = 0;

                // distance between the ghosts and dest_dot.right
                for (var i = 0; i < this.ghosts.length; i++){
                    pf += 1 / ((x - this.ghosts[i].x) * (x - this.ghosts[i].x) + 
                    (y - this.ghosts[i].y) * (y - this.ghosts[i].y));
                }
                pf = 0.5 * this.w * pf;

                // posterior probability
                pf += (1 - this.w) * this.post.probs[this.board.tile_to_spot[dot.right]];

                pfs[3] = pf;

                if (pf < best_pf){
                    best_pf = pf;
                }
            }

            if (dot.up >= 0&& pfs[0] === best_pf){
                walkable_spots.push(this.board.tile_to_spot[dot.up]);
            }
            if (dot.down >= 0 && pfs[1] === best_pf){
                walkable_spots.push(this.board.tile_to_spot[dot.down]);
            }
            if (dot.left >= 0 && pfs[2] === best_pf){
                walkable_spots.push(this.board.tile_to_spot[dot.left]);
            }
            if (dot.right >= 0 && pfs[3] === best_pf){
                walkable_spots.push(this.board.tile_to_spot[dot.right]);
            }

            var prob = 1 / walkable_spots.length;
            for (var j = 0; j < this.board.dots.length; j++){
                if (walkable_spots.indexOf(j) >= 0){
                    this.trans_mat[i][j] = prob;
                }
                else{
                    this.trans_mat[i][j] = 0;
                }
            }
            }

    }
 
}
