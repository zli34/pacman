import { Pacman } from "./pacman";
import { Ghost } from "./ghost";
import { Board } from "./board";
import { Controller } from "./controller";
import { Dot } from "./dot";
import { RwPacmanPost } from "./pacman_post";
import { Post } from "./post";

export class AvoidRwPacmanPost extends Post{
    board: Board;
    ghosts: Array<Ghost>;
    pacman: Pacman;
    probs: Array<number>;
    probs_new: Array<number>;
    num_points: number;
    starting_loc_choices: Array<number>;
    trans_mat: Array<Array<number>>;
    trans_mat_random: Array<Array<number>>;
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

        this.trans_mat = new Array(this.board.dots.length);
        for (var i = 0; i < this.board.dots.length; i++){
            this.trans_mat[i] = new Array<number>(this.board.dots.length);
        }

        // random transition matrix
        this.trans_mat_random = new Array(this.board.dots.length);
        for (var i = 0; i < this.board.dots.length; i++){
            this.trans_mat_random[i] = new Array<number>(this.board.dots.length);
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
                this.trans_mat_random[i][j] = prob;
            }
            else{
                this.trans_mat_random[i][j] = 0;
            }
        }
        
        }

    }

    update(informant: number): void{
        var sum = 0;
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

    updateTransMat(): void{
        for (var i = 0; i < this.board.dots.length; i++){
            var dot: Dot = this.board.get_dot(i, true);

            var walkable_spots = new Array<number>();
            var best_pf = -Infinity;
            var pfs = Array<number>(4);
            
            var dot_x: number = dot.tile % this.board.num_tiles_x;
                var dot_y: number = Math.floor(dot.tile
                / this.board.num_tiles_x);
            var c = 0;
            for (let g of this.ghosts){
                //var ghost_dot = this.board.get_dot(g.spot, true);
                if (dot_x + 0.5 >= g.x - this.ghost_vision_limit && dot_x + 0.5 <= g.x +
                this.ghost_vision_limit && dot_y + 0.5 >= g.y - this.ghost_vision_limit &&
                dot_y + 0.5 <= g.y + this.ghost_vision_limit){
                c = 1;
            if (dot.up >= 0){
                var x: number = dot.up % this.board.num_tiles_x;
                var y: number = Math.floor(dot.up
                / this.board.num_tiles_x);
                var pf: number = 0;

                // distance between the ghosts and dest_dot.up
                pf = (x - g.x) * (x - g.x) + (y - g.y) * (y - g.y);
                pfs[0] = pf;

                if (pf > best_pf){
                    best_pf = pf;
                }
            }
            if (dot.down >= 0){
                var x: number = dot.down % this.board.num_tiles_x;
                var y: number = Math.floor(dot.down
                / this.board.num_tiles_x);
                var pf: number = 0;

                // distance between the ghosts and dest_dot.up
                pf = (x - g.x) * (x - g.x) + (y - g.y) * (y - g.y);

                pfs[1] = pf;

                if (pf > best_pf){
                    best_pf = pf;
                }
            }
            if (dot.left >= 0){
                var x: number = dot.left % this.board.num_tiles_x;
                var y: number = Math.floor(dot.left
                / this.board.num_tiles_x);
                var pf: number = 0;

                // distance between the ghosts and dest_dot.up
                pf = (x - g.x) * (x - g.x) + (y - g.y) * (y - g.y);

                pfs[2] = pf;

                if (pf > best_pf){
                    best_pf = pf;
                }
            }
            if (dot.right >= 0){
                var x: number = dot.right % this.board.num_tiles_x;
                var y: number = Math.floor(dot.right
                / this.board.num_tiles_x);
                var pf: number = 0;

                // distance between the ghosts and dest_dot.up
                pf = (x - g.x) * (x - g.x) + (y - g.y) * (y - g.y);

                pfs[3] = pf;

                if (pf > best_pf){
                    best_pf = pf;
                }
            }

            if (dot.up >= 0 && pfs[0] === best_pf){
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
            break;
            }
        }
            if (c === 0){
            for (var j = 0; j < this.board.dots.length; j++){
                this.trans_mat[i][j] = this.trans_mat_random[i][j]
            }
            }
    }
}
 
}
