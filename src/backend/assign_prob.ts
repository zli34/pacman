import { Pacman } from "./pacman";
import { Ghost } from "./ghost";
import { Board } from "./board";
import { Controller } from "./controller";
import { Dot } from "./dot";

export class ProbAssign {
    board: Board;
    ghosts: Array<Ghost>;
    probs: Array<number>;

    constructor(board: Board, ghosts: Array<Ghost>, probs: Array<number>){
        this.board = board;
        this.ghosts = ghosts;
        this.probs = new Array<number>(this.board.dots.length);
        for (var i = 0; i < this.board.dots.length; i++){
            this.probs[i] = probs[i];
        }

    }

    bestProbs(): Array<number>{
        var best_spots = new Array<number>();
        var best_spot: number;

//for (var i = 0; i < this.board.dots.length; i++){
//if (this.probs[i] >0){
//console.log(i);
//}
//}

        for (var j = 0; j < this.ghosts.length; j++){
            var best_prob: number = 0;
            var target_spot: number = 0;
            for (var i = 0; i < this.probs.length; i++){
                if (this.probs[i] > best_prob){
                    target_spot = i;
                    best_prob = this.probs[i];
                }
            }
//console.log("best_prob: " + best_prob);

            if (j === 0){
                best_spot = target_spot;
            }

            if (best_prob > 0){
                best_spots.push(target_spot);
//console.log("target_spot: " + target_spot);
            }
            else{
                best_spots.push(best_spot);
//console.log("best_spot: " + best_spot);
            }

            this.probs[target_spot] = 0;

        }
        return best_spots;
    }

    probAssign(): Array<number>{
        var permute = this.permutator(this.bestProbs());
console.log(" ");
        var best_dist: number = Infinity;
        var best_assign: Array<number>;
        for (var i = 0; i < permute.length; i++){
            var dist: number = 0;
            for (var j = 0; j < this.ghosts.length; j++){
if (permute[i][j] >=0 || permute[i][j] <= 1000){
}
else{
console.log("i: " + i);
console.log("j: " + j);
}
                var dot: Dot = this.board.get_dot(permute[i][j], true);
                var tile: number = dot.tile;
                var x: number = tile % this.board.num_tiles_x;
                var y: number = Math.floor(tile
                / this.board.num_tiles_x);
                dist += this.board.dist(this.ghosts[j].x, this.ghosts[j].y, x, y);
            }
            if (dist < best_dist){
                best_dist = dist;
                best_assign = permute[i]
            }
        }
        return best_assign;
    }

    permutator(inputArr: Array<number>){
        var result: Array<Array<number>> = [];

        function permute(arr: Array<number>, m: Array<number> = []){
            if (arr.length === 0){
                result.push(m)
            }
            else{
                for (var i = 0; i < arr.length; i++){
                    var curr = arr.slice();
                    var next = curr.splice(i, 1);
                    permute(curr.slice(), m.concat(next));
                }
            }
        }
        permute(inputArr);

        return result;
    }
}
