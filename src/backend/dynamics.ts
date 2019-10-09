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
import { IntelRwPacmanPost } from "./intel_rwPacman_post";
import { AvoidRwPacmanPost } from "./avoid_rwPacman_post";
import { ClosestRwPacmanPost } from "./closest_rwPacman_post";
import { Post } from "./post";

export class Dynamics {
    pacman: Pacman;
    ghosts: Array<Ghost>;

    board: Board;

    pacman_controller: Controller;
    ghost_controllers: Controller;

    posts: Array<Post>;

    state: PePacmanState;

    power_time: number;

    memory_dots: Array<Dot>;
    memory_energy_dots: Array<Dot>;

    informant: number;

    constructor(pacman: Pacman, ghosts: Array<Ghost>,
        board: Board, pacman_controller: Controller,
        ghost_controllers: Controller,
        posts: Array<Post>,
        state: PePacmanState) {
        this.pacman = pacman;
        this.ghosts = ghosts;

        this.board = board;

        this.pacman_controller = pacman_controller;
        this.ghost_controllers = ghost_controllers;
        
        this.posts = posts;

        this.state = state;

        this.power_time = 0;

        this.memory_dots = new Array<Dot>();
        this.memory_energy_dots = new Array<Dot>();

        this.informant = -1;

    }

    update(): void {
        this.state.tick += 1;
        this.state.timeText.text = 'Time:' + this.state.tick;
    // memory dots
    /*    for (let dot of this.state.dots){
        var dot_x: number = dot.tile % this.board.num_tiles_x;
        var dot_y: number = Math.floor(dot.tile
                / this.board.num_tiles_x);
            for (let g of this.ghosts){
                if (dot_x >= g.x - this.post1.ghost_vision_limit && dot_x 
                    <= g.x + this.post1.ghost_vision_limit && dot_y >= g.y - 
                this.post1.ghost_vision_limit && dot_y <= g.y +
                this.post1.ghost_vision_limit){
                    if (this.memory_dots.indexOf(dot) >= 0){
                        if (!dot.is_alive()){
                            this.memory_dots.splice(this.memory_dots.indexOf(dot), 1);
                            if (dot.kind === 2){
                                this.memory_energy_dots.splice(
                                    this.memory_energy_dots.indexOf(dot), 1);
                            }
                        }
                    }
                    else{
                        if (dot.is_alive() && dot.kind != 0){
                            this.memory_dots.push(dot);
                            if (dot.kind === 2){
                                this.memory_energy_dots.push(dot);
                            }
                        }
                    }
                }
            }//for
        }//for
*/
//console.log(this.memory_dots);
//if (this.post1.num_points === 0){
//for (let dot of this.memory_dots){
//console.log(dot.tile);
//}
//}

        if (this.pacman.is_alive()) {
            this.pacman_controller.assign_actions(
                this.pacman_controller.select_actions(
                    this.pacman, this.ghosts, this.posts));
        }


        this.ghost_controllers.assign_actions(this.ghost_controllers.select_actions(
                                              this.pacman, this.ghosts, 
                                              this.posts));

        for (var i = 0; i < this.ghosts.length; i++){
            this.state.prob_sprites[i].target_spot = this.ghost_controllers.target_spots[i];
            this.state.prob_sprites[i].update();
        }

        this.pacman.move();
//console.log("Pacman location: " + this.pacman.spot);
//console.log("Pacman x: " + this.pacman.x);
//console.log("Pacman y: " + this.pacman.y);
        for (let g of this.ghosts) {
            g.move();
        }

        this.informant = -1;
        var dot: Dot = this.board.get_dot(this.pacman.spot, true);
        if (dot.is_alive()) {
            dot.pick_up();
            if (dot.kind === 1){
                this.state.score += 10;
                this.informant = this.pacman.spot;
                this.state.dotCount += 1;
            }
            if (dot.kind === 2){
                this.power_time += 10; 
                this.state.score += 50;
                this.informant = this.pacman.spot;
                this.state.dotCount += 1;
            }
            if (this.state.dotCount === 236){
                this.state.restart = true;
                this.state.winText.visible = true;
            }
        }       

        for (var b = 0; b < this.posts.length; b++){
        this.posts[b].update(this.informant);
        }
//console.log("num_points: " + this.post.num_points);



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
                g.ticks_per_spot = 1;
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
this.state.overText.visible = true;
this.state.win = false;

//this.state.game.paused = true;

this.state.restart = true;

//var timer = this.state.game.time.create();
//timer.add(2000, this.restart, this);
//timer.start();

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

