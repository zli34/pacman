import { Unit } from "./unit";
import { Board } from "./board";

export class Pacman extends Unit {

    constructor(board: Board, x: number, y: number, ticks_per_spot: number) {
        super(board, true, x, y, ticks_per_spot);
    }
}
