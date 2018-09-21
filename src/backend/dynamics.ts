import { Pacman } from "./pacman";
import { Ghost } from "./ghost";
import { Board } from "./board";
import { Controller } from "./controller";
import { Dot } from "./dot";
import { RwPacmanController } from "./rwPacman_controller";
import { RwPacmanGhostController } from "./rwPacman_ghost_controller";
import { RwPacmanPost } from "./pacman_post";
import { PePacmanState } from "../frontend/viewer";
import { ProbAssign } from "./assign_prob";

export class Dynamics {
    pacman: Pacman;
    ghosts: Array<Ghost>;

    board: Board;

    pacman_controller: Controller;
    ghost_controllers: Controller;

    post: RwPacmanPost;

    state: PePacmanState;

    power_time: number;

    constructor(pacman: Pacman, ghosts: Array<Ghost>,
        board: Board, pacman_controller: Controller,
        ghost_controllers: Controller,
        post: RwPacmanPost,
        state: PePacmanState) {
        this.pacman = pacman;
        this.ghosts = ghosts;

        this.board = board;

        this.pacman_controller = pacman_controller;
        this.ghost_controllers = ghost_controllers;

        this.post = post;

        this.state = state;

        this.power_time = 0;

    }

    update(): void {

        this.post.update();
//console.log("num_points: " + this.post.num_points);

        if (this.pacman.is_alive()) {
            this.pacman_controller.assign_actions(
                this.pacman_controller.select_actions(
                    this.pacman, this.ghosts, this.post));
        }


        //for (var i = 0; i < this.ghosts.length; ++i) {
        //    if (this.ghosts[i].is_alive()) {
        //        this.ghost_controllers[i].assign_actions(
        //            this.ghost_controllers[i].select_actions(
        //                this.pacman, this.ghosts, this.post, this.state.target_spots[i]));
        //    }
        //}

        this.ghost_controllers.assign_actions(this.ghost_controllers.select_actions(
                                              this.pacman, this.ghosts, this.post));

        for (var i = 0; i < this.ghosts.length; i++){
            this.state.prob_sprites[i].target_spot = this.ghost_controllers.target_spots[i];
            this.state.prob_sprites[i].update();
        }

        this.pacman.move();
        for (let g of this.ghosts) {
            g.move();
        }

        var dot: Dot = this.board.get_dot(this.pacman.spot, true);
        if (dot.is_alive()) {
            dot.pick_up();
            if (dot.kind === 1){
                this.state.score += 10;
            }
            if (dot.kind === 2){
                this.power_time += 10; 
                this.state.score += 50;
            }
        }
        this.state.powerText.text = 'Power time:' + this.power_time;
        this.state.scoreText.text = 'Score:' + this.state.score;

        if (this.power_time > 0){
            for (let g of this.ghosts){
                g.ticks_per_spot = 10;
                if (this.pacman.x >= g.x - 1 && this.pacman.x <= g.x + 1 &&
                    this.pacman.y >= g.y - 1 && this.pacman.y <= g.y + 1){
                        //this.state.winText.visible = true;
                        //this.state.game.state.restart();
                        g.alive = false;
                        g.route = g.box.assign_slot();
                        g.x = g.route.dest_x;
                        g.y = g.route.dest_y;
                        g.route_counts = 0;

                        this.state.score += 50;
                        this.state.scoreText.text = 'Score:' + this.state.score;
                    }
            }
            this.power_time--;
        }

        else{
            for (let g of this.ghosts){
                g.ticks_per_spot = 2;
                if (this.pacman.x >= g.x - 1 && this.pacman.x <= g.x + 1 &&
                    this.pacman.y >= g.y - 1 && this.pacman.y <= g.y + 1){
                var death = this.state.game.add.sprite(
                    (this.pacman.x - 0.5) * this.state.tile_dim,
                     (this.pacman.y - 1) * this.state.tile_dim, 'Death');
        death.width = this.state.tile_dim * 1.5;
        death.height = this.state.tile_dim * 1.5;
        death.frame = 51;
        death.animations.add('ani', [51, 42, 43, 44], 2, false);
death.animations.play('ani');
this.state.restart = true;

var timer = this.state.game.time.create();
timer.add(2000, this.restart, this);
timer.start();

            }
        }

    }
}

    restart(): void{
        this.state.overText.visible = true;
        this.state.game.state.restart();
        this.state.restart = false;
    }

}

