import { Controller } from "./controller";
import { Unit } from "./unit";
import { Pacman } from "./pacman";
import { Ghost } from "./ghost";
import { Board } from "./board";
import { Dot } from "./dot";
import { RwPacmanPost } from "./pacman_post";

export class RwPacmanController extends Controller {

    constructor(unit: Unit, board: Board) {
        super([unit], board);
    }

    select_actions(pacman: Pacman, ghosts: Array<Ghost>, post: RwPacmanPost = null): Array<number> {
        var dest_dot: Dot;
        if (this.units[0].dest_spot === -1){
            dest_dot = this.board.get_dot(this.units[0].spot, true);
        }
        else{
            dest_dot = this.board.get_dot(this.units[0].dest_spot, true);
        }

        var walkable_actions = new Array<number>();
        if (dest_dot.up >= 0){
            walkable_actions.push(0);
        }
        if (dest_dot.down >= 0){
            walkable_actions.push(1);
        }
        if (dest_dot.left >= 0){
            walkable_actions.push(2);
        }
        if (dest_dot.right >= 0){
            walkable_actions.push(3);
        }
        return [walkable_actions[Math.floor(Math.random() * walkable_actions.length)]];

    }
}
