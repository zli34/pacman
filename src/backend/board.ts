import { Wall } from "./wall";
import { Dot } from "./dot";

export class Board {
    readonly num_tiles_x: number;
    readonly num_tiles_y: number;

    readonly dots: Array<Dot>;

    readonly tile_to_spot: Array<number>;

    // readonly dist_mat: Array<Array<number>>;

    constructor(num_tiles_x: number, num_tiles_y: number,
        dots: Array<Dot>) {

        this.num_tiles_x = num_tiles_x;
        this.num_tiles_y = num_tiles_y;

        this.dots = dots;

        // converts raw tile index to walk-able tile index
        this.tile_to_spot = new Array();
        for (let dot of this.dots) {
            this.tile_to_spot[dot.tile] = dot.spot;
        }

        // construct the distance matrix
        /*this.dist_mat = new Array(this.dots.length);
        for (var i = 0; i < this.dots.length; i++){
            this.dist_mat[i] = new Array<number>(this.dots.length);
            for(var j = 0; j < this.dots.length; j++){
                this.dist_mat[i][j] = 10000;
            }
        }
        
        for (var i = 0; i < this.dots.length; i++){
            this.dist_mat[i][i] = 0;
            var dot = this.get_dot(i, true);
            this.dist_mat[i][this.tile_to_spot[dot.up]] = 1;
            this.dist_mat[i][this.tile_to_spot[dot.down]] = 1;
            this.dist_mat[i][this.tile_to_spot[dot.left]] = 1;
            this.dist_mat[i][this.tile_to_spot[dot.left]] = 1;
        }
        for (var i = 0; i < this.dots.length; i++){
            for (var j = 0; j < this.dots.length; j++){
                var direct: number = this.dist_mat[i][j];
                for (var k = 0; k < this.dots.length; k++){
                    var step_one: number = this.dist_mat[i][k];
                    var step_two: number = this.dist_mat[k][j];

                    if (direct > (step_one+step_two)){
                        this.dist_mat[i][j]
                    }
                }
            }
        }
        */
    }

    get_dot(index: number, is_spot: boolean): Dot {
        if (is_spot) {
            if (index < this.dots.length) {
                return this.dots[index];
            } else {
                throw new RangeError("index " + index
                    + " is larget than walkable dots");
            }
        } else {
            var converted = this.tile_to_spot[index];
            if (converted === undefined) {
                throw new RangeError("index " + index
                    + " returns an invalid "
                    + "walkable index");
            } else {
                return this.dots[converted];
            }
        }
    }

    dist(x1: number, y1: number, x2: number, y2: number){
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }
}
