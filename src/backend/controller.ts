import { Board } from "./board";
import { Dot } from "./dot";
import { Unit } from "./unit";
import { Pacman } from "./pacman";
import { Ghost } from "./ghost";
import { RwPacmanPost } from "./pacman_post";
import { IntelRwPacmanPost } from "./intel_rwPacman_post";
import { AvoidRwPacmanPost } from "./avoid_rwPacman_post";
import { ClosestRwPacmanPost } from "./closest_rwPacman_post";
import { Post } from "./post";

export abstract class Controller {
    readonly units: Array<Unit>;
    readonly num_units: number;
    readonly board: Board;
    target_spots: Array<number>;

    constructor(units: Array<Unit>, board: Board) {
        this.units = units;
        this.num_units = this.units.length;
        this.board = board;
    }

    //abstract select_actions(pacman: Pacman,
    //    ghosts: Array<Ghost>): Array<number>;

    abstract select_actions(pacman: Pacman,
        ghosts: Array<Ghost>, posts: Array<Post>): Array<number>;

    assign_actions(actions: Array<number>): void {
        if (actions.length != this.num_units) {
            throw new Error("Incorrect number of actions: "
                + actions.length + " vs. " + this.num_units);
        }

        for (var i = 0; i < this.num_units; ++i) {
            this.units[i].set_action(actions[i]);
        }
    }
}
