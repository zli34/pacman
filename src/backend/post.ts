import { Board } from "./board";
import { Ghost } from "./ghost";
import { Pacman } from "./pacman";


export abstract class Post {
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
constructor() {}
abstract update(informant: number): void;
}
