import { Pacman } from "./pacman";
import { Ghost } from "./ghost";
import { Board } from "./board";
import { Controller } from "./controller";
import { Dot } from "./dot";
import { Post } from "./post";

export class RwPacmanPost extends Post {
    board: Board;
    ghosts: Array<Ghost>;
    pacman: Pacman;
    probs: Array<number>;
    probs_new: Array<number>;
    num_points: number;
    starting_loc_choices: Array<number>;
    trans_mat: Array<Array<number>>;
    ghost_vision_limit: number;
    K: number;

    constructor(board: Board, ghosts: Array<Ghost>, pacman: Pacman, starting_loc_choices: Array<number>,
    ghost_vision_limit: number){
        super();
        this.board = board;
        this.ghosts = ghosts;
        this.pacman = pacman;
        this.probs = new Array<number>(this.board.dots.length);
        this.probs_new = new Array<number>(this.board.dots.length);
        this.num_points = 0;
        this.starting_loc_choices = starting_loc_choices;
        this.ghost_vision_limit = ghost_vision_limit;
        this.K = 1;

        // transition matrix
        this.trans_mat = this.board.trans_mat_random_new;
console.log("transition matrix: " + this.board.trans_mat_random[227][237]);
    }

    update(informant: number): void{
        var sum = 0;
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

            // adjust for dots' and ghosts' locations and vision limit
            // adjust for dots
            var end = 0;
            var prob_info = 1;
            var record = new Array<number>();
            if (informant >= 0){
                for (var i = 0; i < this.board.dots.length; i++){
                    this.probs[i] = 0;
                }
                this.probs[this.pacman.spot] = 1;
                this.K *= this.probs_new[this.pacman.spot];
                end = 1;
            }
            else{
                for (let dot of this.board.dots){
                    if (dot.is_alive() && dot.kind != 0){
                        this.probs[dot.spot] = 0;
                        prob_info -= this.probs_new[dot.spot];
                        record.push(dot.spot);
                    }
                }

            }

            // adjust for ghosts
            if (end === 0){
            for (let g of this.ghosts){
                if (this.pacman.x >= g.x - this.ghost_vision_limit && this.pacman.x <= g.x +
                this.ghost_vision_limit && this.pacman.y >= g.y - this.ghost_vision_limit &&
                this.pacman.y <= g.y + this.ghost_vision_limit){
                    for (var i = 0; i < this.board.dots.length; i++){
                        this.probs[i] = 0;
                    }
                    this.probs[this.pacman.spot] = 1;
                    this.K *= this.probs_new[this.pacman.spot];
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
                            if (record.indexOf(i) < 0){
                                this.probs[i] = 0;
                                prob_info -= this.probs_new[i];
                                record.push(i);
                            }
                        }
                    }
                }//else
            }//for
        this.K *= prob_info;
        }//if end === 0

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
            // adjust for dots' and ghosts' locations and vision limit
            // adjust for dots
            var end = 0;
            var prob_info = 1;
            var record = new Array<number>();
            if (informant >= 0){
                for (var i = 0; i < this.board.dots.length; i++){
                    this.probs[i] = 0;
                }
                this.probs[this.pacman.spot] = 1;
                this.K *= this.probs_new[this.pacman.spot];
                end = 1;
            }
            else{
                for (let dot of this.board.dots){
                    if (dot.is_alive() && dot.kind != 0){
                        this.probs[dot.spot] = 0;
                        prob_info -= this.probs_new[dot.spot];
                        record.push(dot.spot);
                    }
                }

            }

            // adjust for ghosts
            if (end === 0){
            for (let g of this.ghosts){
                if (this.pacman.x >= g.x - this.ghost_vision_limit && this.pacman.x <= g.x +
                this.ghost_vision_limit && this.pacman.y >= g.y - this.ghost_vision_limit &&
                this.pacman.y <= g.y + this.ghost_vision_limit){
                    for (var i = 0; i < this.board.dots.length; i++){
                        this.probs[i] = 0;
                    }
                    this.probs[this.pacman.spot] = 1;
                    this.K *= this.probs_new[this.pacman.spot];
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
                            if (record.indexOf(i) < 0){
                                this.probs[i] = 0;
                                prob_info -= this.probs_new[i];
                                record.push(i);
                            }
                        }
                    }
                }//else
            }//for
        this.K *= prob_info;
        }//if end === 0
        
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
 
}
