import { Pacman } from "./pacman";
import { Ghost } from "./ghost";
import { Board } from "./board";
import { Controller } from "./controller";
import { Dot } from "./dot";

export class RwPacmanPost {
    board: Board;
    ghosts: Array<Ghost>;
    pacman: Pacman;
    probs: Array<number>;
    probs_new: Array<number>;
    num_points: number;
    starting_loc_choices: Array<number>;
    trans_mat: Array<Array<number>>;
    ghost_vision_limit: number;

    constructor(board: Board, ghosts: Array<Ghost>, pacman: Pacman, starting_loc_choices: Array<number>,
    ghost_vision_limit: number){
        this.board = board;
        this.ghosts = ghosts;
        this.pacman = pacman;
        this.probs = new Array<number>(this.board.dots.length);
        this.probs_new = new Array<number>(this.board.dots.length);
        this.num_points = 0;
        this.starting_loc_choices = starting_loc_choices;
        this.ghost_vision_limit = ghost_vision_limit;

        // transition matrix
        this.trans_mat = new Array(this.board.dots.length);
        for (var i = 0; i < this.board.dots.length; i++){
            this.trans_mat[i] = new Array<number>(this.board.dots.length);
            var dot = this.board.get_dot(i, true);
            var walkable_spots = new Array<number>();
        if (dot.up >= 0){
            walkable_spots.push(this.board.tile_to_spot[dot.up]);
        }
        if (dot.down >= 0){
            walkable_spots.push(this.board.tile_to_spot[dot.down]);
        }
        if (dot.left >= 0){
            walkable_spots.push(this.board.tile_to_spot[dot.left]);
        }
        if (dot.right >= 0){
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

        //for (var j = 0; j < this.board.dots.length; j++){
        //    if (this.trans_mat[5][j] > 0){
        //        console.log(j);
        //        console.log(this.trans_mat[5][j]);
        //    }
        //}
    }

    update(): void{
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
 
}
