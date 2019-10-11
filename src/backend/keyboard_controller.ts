import { Controller } from "./controller";
import { Unit } from "./unit";
import { Pacman } from "./pacman";
import { Ghost } from "./ghost";
import { Board } from "./board";
import { RwPacmanPost } from "./pacman_post";
import { AvoidRwPacmanPost } from "./avoid_rwPacman_post";
import { Post } from "./post";

export class KeyboardController extends Controller {
    last_press: number;

    upKey: Phaser.Key;
    downKey: Phaser.Key;
    leftKey: Phaser.Key;
    rightKey: Phaser.Key;

    constructor(keyboard: Phaser.Keyboard, unit: Unit, board: Board) {
        super([unit], board);
        this.last_press = -1;

        this.upKey = keyboard.addKey(Phaser.Keyboard.UP);
        this.upKey.onDown.add(() => {
            this.last_press = 0;
        }, this);

        this.downKey = keyboard.addKey(Phaser.Keyboard.DOWN);
        this.downKey.onDown.add(() => {
            this.last_press = 1;
        }, this);

        this.leftKey = keyboard.addKey(Phaser.Keyboard.LEFT);
        this.leftKey.onDown.add(() => {
            this.last_press = 2;
        }, this);

        this.rightKey = keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.rightKey.onDown.add(() => {
            this.last_press = 3;
        }, this);
    }

    select_actions(pacman: Pacman, ghosts: Array<Ghost>, posts: Array<Post> = null): Array<number> {
        return [this.last_press];
    }
}
