import { Board } from "../backend/board";
import { Pacman } from "../backend/pacman";
import { Ghost } from "../backend/ghost";
import { Dynamics } from "../backend/dynamics";
import { Dot } from "../backend/dot";
import { Wall } from "../backend/wall";
import { PacmanSprite } from "./pacman_sprite";
import { WallSprite } from "./wall_sprite";
import { DotSprite } from "./dot_sprite";
import { GhostBox, Slot } from "../backend/ghost_box";
import { GhostBoxSprite } from "./ghost_box_sprite";
import { GhostSprite } from "./ghost_sprite";

import { Controller } from "../backend/controller";
import { KeyboardController } from "../backend/keyboard_controller";
import { RedGhostController } from "../backend/red_ghost_controller";
import { RwPacmanController } from "../backend/rwPacman_controller";
import { RwPacmanGhostController} from "../backend/rwPacman_ghost_controller"

import { RwPacmanPost } from "../backend/pacman_post"
import { ProbSprite } from "./prob_sprite";
import { IntelRwPacmanController } from "../backend/intel_rwPacman_controller";
import { ProbAssign } from "../backend/assign_prob";
import { IntelRwPacmanPost } from "../backend/intel_rwPacman_post";
import { RwPacmanGhostControllerRL } from "../backend/rwPacman_ghost_RL_controller";
import { DotPacmanGhostControllerRL } from "../backend/dotPacman_ghost_RL_controller";
import { trainGhostControllerRL } from "../backend/train_ghost_RL_controller";
import { testGhostControllerRL} from "../backend/test_ghost_RL_controller"
import { AvoidRwPacmanPost } from "../backend/avoid_rwPacman_post";
import { ClosestRwPacmanPost } from "../backend/closest_rwPacman_post";
import { DotRwPacmanController } from "../backend/dot_rwPacman_controller";
import { Post } from "../backend/post";
import { Sprite } from "phaser";

export class PePacmanGame extends Phaser.Game {
    constructor(num_tiles_x: number, num_tiles_y: number, tile_dim: number,
        walls: Array<Wall>, dots: Array<Dot>) {

        var state = new PePacmanState(num_tiles_x, num_tiles_y, tile_dim,
            walls, dots);

        super(num_tiles_x * tile_dim, num_tiles_y * tile_dim,
            Phaser.AUTO, 'pe-pacman-game', state);

    }
}


export class PePacmanState extends Phaser.State {
    readonly num_tiles_x: number;
    readonly num_tiles_y: number;
    readonly tile_dim: number;
    readonly walls: Array<Wall>;
    readonly dots: Array<Dot>;

    dynamics: Dynamics;

    board: Board;

    pacman: Pacman;
    pacman_controller: Controller;
    pacman_sprite: PacmanSprite;
    
    posts: Array<Post>;

    ghosts: Array<Ghost>;
    ghost_controllers: Controller;
    //ghost_controllers: trainGhostControllerRL;
    ghost_sprites: Array<GhostSprite>;

    box: GhostBox;
    box_sprite: GhostBoxSprite;

    wall_sprites: Array<WallSprite>;

    dot_sprites: Array<DotSprite>;

    prob_sprites: Array<ProbSprite>;

    tick: number;

    overText: Phaser.Text;

    powerText: Phaser.Text;

    scoreText: Phaser.Text;

    score: number;

    winText: Phaser.Text;

    restart: boolean;

    timeText: Phaser.Text;

    dotCount: number;

    win: boolean;

    pauseButton: Sprite;

    refresh: boolean;

    startButton: Sprite;

    test: Array<Array<Array<number>>>;

    startText: Phaser.Text;

    constructor(num_tiles_x: number, num_tiles_y: number,
        tile_dim: number, walls: Array<Wall>, dots: Array<Dot>) {
        super();

        this.num_tiles_x = num_tiles_x;
        this.num_tiles_y = num_tiles_y;
        this.tile_dim = tile_dim;
        this.walls = walls;
        this.dots = dots;
        this.score = 0;
        this.restart = false;
        this.dotCount = 0;
        this.win = true;
        this.refresh = false;

    }

    preload() {
        this.game.load.image('RedUp', 'red-up.png');
        this.game.load.image('RedDown', 'red-down.png');
        this.game.load.image('RedLeft', 'red-left.png');
        this.game.load.image('RedRight', 'red-right.png');
        this.game.load.image('PinkUp', 'pink-up.png');
        this.game.load.image('PinkDown', 'pink-down.png');
        this.game.load.image('PinkLeft', 'pink-left.png');
        this.game.load.image('PinkRight', 'pink-right.png');
        this.game.load.image('BlueUp', 'blue-up.png');
        this.game.load.image('BlueDown', 'blue-down.png');
        this.game.load.image('BlueLeft', 'blue-left.png');
        this.game.load.image('BlueRight', 'blue-right.png');
        this.game.load.image('OrangeUp', 'orange-up.png');
        this.game.load.image('OrangeDown', 'orange-down.png');
        this.game.load.image('OrangeLeft', 'orange-left.png');
        this.game.load.image('OrangeRight', 'orange-right.png');
        this.game.load.image('VulnerableGhost', 'vulnerable-ghost.png');
        this.game.load.image('restart', 'restart.png')
        this.game.load.image('start', 'start.png')

        this.game.load.spritesheet('Pacman', 'Pacman.png', 32, 32, 49);
        this.game.load.spritesheet('Death', 'death.png', 32, 32, 54);

        this.load.text('mytext', 'test.txt');
    }

    create() {
        this.load.start();
        this.game.time.slowMotion = 20.0;
        this.game.paused = true;

        // text
        this.overText = this.game.add.text(180, 20, 'Game Over', 
        {font: '16px Arial', fill: '#fff'});
        this.overText.visible = false;
        this.powerText = this.game.add.text(100, 0, 'Power time:' + 0, 
        {font: '16px Arial', fill: '#fff'});
        this.powerText.visible = true;
        this.scoreText = this.game.add.text(0, 0, 'Score:', 
        {font: '16px Arial', fill: '#fff'});
        this.scoreText.visible = true;
        this.winText = this.game.add.text(180, 20, 'You win!!!', 
        {font: '16px Arial', fill: '#fff'})
        this.winText.visible = false;

        this.timeText = this.game.add.text(300, 0, 'Time:' + 0,
        {font: '16px Arial', fill: '#fff'});
        this.timeText.visible = true;

        this.startText = this.game.add.text(140, 20, 'Press start button to play!', {font: '16px Arial', fill: '#fff'});
        this.startText.visible = true;
        
        // pause button
        this.pauseButton = this.game.add.sprite(420, 0, 'restart');
        this.pauseButton.width = 20; this.pauseButton.height = 20;
        this.pauseButton.inputEnabled = true;
        this.pauseButton.events.onInputUp.add(function () {this.refresh = true; this.game.paused = false;},this);
        this.game.input.onDown.add(function () {if(this.game.paused)this.game.paused = false;},this);

        // start button
        this.startButton = this.game.add.sprite(390, 0, 'start');
        this.startButton.width = 20; this.startButton.height = 20;
        this.startButton.inputEnabled = true;
        this.startButton.events.onInputUp.add(function () {this.game.paused = false; this.startText.visible = false;},this);
        this.game.input.onDown.add(function () {if(this.game.paused)this.game.paused = false; this.startText.visible = false;},this);

        // backend objects
        this.board = new Board(this.num_tiles_x, this.num_tiles_y, this.dots);

        this.pacman = new Pacman(this.board, 14.5, 26.5, 1);

        this.box = new GhostBox(this.board, 10, 15, 8, 5,
            [new Slot(12, 17, 12, 17.5, 12, 18), new Slot(14, 17, 14, 17.5, 14, 18), new Slot(16, 17, 16, 17.5, 16, 18)]);

        this.ghosts = new Array<Ghost>();

        for (var i = 0; i < 4; i++){
            if (i != 3){
                this.ghosts.push(new Ghost(this.board, false, null, null, 1,
                    this.box));
            }
            else{
                this.ghosts.push(new Ghost(this.board, true, 14, 14.5, 1, this.box));
            }
        }

        //this.ghost_controllers = new RedGhostController(this.ghosts, this.board)
        //this.ghost_controllers = new RwPacmanGhostController(this.ghosts, this.board);
        //this.ghost_controllers = new DotPacmanGhostControllerRL(this.ghosts, this.board, 5);
        //this.ghost_controllers = new trainGhostControllerRL(this.ghosts, this.board, 5, 0.01, JSON.parse(localStorage.getItem('param_list')));
        //this.ghost_controllers = new testGhostControllerRL(this.ghosts, this.board, JSON.parse(localStorage.getItem('param_list')));
        //this.ghost_controllers = new trainGhostControllerRL(this.ghosts, this.board, 5, 0.01, null);
        //var test: Array<Array<Array<number>>> = JSON.parse(localStorage.getItem('param_list'));

        var text: string = this.cache.getText('mytext');
        var data1: Array<string> = text.split(',');   
        var p: number = 0;
        this.test = new Array<Array<Array<number>>>(2);
        for (var b = 0; b < 2; b++){
            this.test[b] = new Array<Array<number>>(256);
        for (var i = 0; i < 256; i++){
            var temp = new Array<number>(12);
            for (var j = 0; j < 12; j++){
                temp[j] = Number(data1[p]);
                p += 1;
            }
            this.test[b][i] = temp;
        }
        }
        this.ghost_controllers = new testGhostControllerRL(this.ghosts, this.board, this.test);
        
        //var text: string = test.toString();
        function download(filename:string, text:string) {
            var pom = document.createElement('a');
            pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            pom.setAttribute('download', filename);
        
            if (document.createEvent) {
                var event = document.createEvent('MouseEvents');
                event.initEvent('click', true, true);
                pom.dispatchEvent(event);
            }
            else {
                pom.click();
            }
        }
        //download('test.txt', text);
        //fetch('test.txt').then(response => response.text()).then((data) => {
        //    doSomething(data)
        //})
        //var fs = require('fs');
        //text = fs.readFileSync("text.txt").toString('utf-8');
        //console.log('text');


        //for (var k = 0; k < 256; k++){
        //console.log('test' + k + ': ' + test[1][k]);
        //}
        //this.ghost_controllers = new RwPacmanGhostControllerRL(this.ghosts, 
        //    this.board, 5);
        //this.ghost_controllers.push(new RedGhostController(
        //    this.ghosts[0], this.board));


        this.pacman_controller = new KeyboardController(
            this.game.input.keyboard, this.pacman, this.board);

        //this.pacman_controller = new RwPacmanController(
        //    this.pacman, this.board);


        //this.pacman_controller = new IntelRwPacmanController(
        //    this.pacman, this.board, 0.5);

        //this.pacman_controller = new DotRwPacmanController(
        //    this.pacman, this.board, 0);
        

        this.posts = new Array<Post>();
         this.posts.push(new RwPacmanPost(this.board, this.ghosts, this.pacman, 
            [this.pacman.spot], 5));

        //this.posts.push(new AvoidRwPacmanPost(this.board, this.ghosts, this.pacman, 
        //    [this.pacman.spot], 5));

        this.posts.push(new ClosestRwPacmanPost(this.board, this.ghosts, this.pacman, 
            [this.pacman.spot], 5, 0.1));
        
        //this.post2 = new IntelRwPacmanPost(this.board, this.ghosts, this.pacman,
        // [this.pacman.spot], 5, 0.5, new RwPacmanPost(this.board, this.ghosts,
        // this.pacman, [this.pacman.spot], 5))
        for (var b = 0; b < this.posts.length; b++){
        this.posts[b].update(-1);
        this.posts[b].num_points = 0;
        }


        this.dynamics = new Dynamics(this.pacman, this.ghosts, this.board,
            this.pacman_controller, this.ghost_controllers, this.posts, this);

        this.tick = 0;


        // frontend objects
        this.wall_sprites = new Array<WallSprite>();
        this.dot_sprites = new Array<DotSprite>();

        this.pacman_sprite = new PacmanSprite(this.game, this.dynamics.board,
            this.tile_dim,
            this.dynamics.pacman);
        this.pacman_sprite.loadTexture('Pacman');
        this.pacman_sprite.width = this.pacman_sprite.tile_dim * 1.5;
        this.pacman_sprite.height = this.pacman_sprite.tile_dim * 1.5;
        this.pacman_sprite.frame = 42;
        this.pacman_sprite.animations.add('right', [0, 1, 2, 3, 4, 5, 6], 14, true);
        this.pacman_sprite.animations.add('down', [14, 15, 16, 17, 18, 19, 20], 14, true);
        this.pacman_sprite.animations.add('left', [28, 29, 30, 31, 32, 33, 34], 14, true);
        this.pacman_sprite.animations.add('up', [42, 43, 44, 45, 46, 47, 48], 14, true);
//console.log(this.pacman_sprite.frame);
        this.pacman_sprite.animations.play('up');
//console.log(this.pacman_sprite.frame);

        this.ghost_sprites = new Array<GhostSprite>();
        var c = 0;
        for (let g of this.ghosts) {
            var GS = new GhostSprite(this.game,
                this.dynamics.board, this.tile_dim, g);
            if (c == 0){
                GS.loadTexture('RedUp');
            }
            if (c == 1){
                GS.loadTexture('PinkDown');
            }
            if (c == 2){
                GS.loadTexture('BlueUp');
            }
            if (c == 3){
                GS.loadTexture('OrangeDown');
            }
            c++;
            GS.width = GS.tile_dim * 1.5;
            GS.height = GS.tile_dim * 1.5;
            this.ghost_sprites.push(GS);

        }

        var target_spots: Array<number> = (new ProbAssign(this.board, this.ghosts, 
            this.posts[0].probs)).bestProbs();
//console.log(1111);

        this.prob_sprites = new Array<ProbSprite>();
        for (var i = 0; i < this.ghosts.length; i++){
        this.prob_sprites.push(new ProbSprite(this.game, this.dynamics.board,
             this.tile_dim, target_spots[i]));
        }
        for (var i = 0; i < this.ghosts.length; i++){
            this.prob_sprites[i].visible = false;
        }


        for (let wall of this.walls) {
            this.wall_sprites.push(new WallSprite(this.game,
                this.dynamics.board,
                this.tile_dim, wall));
        }
        for (let dot of this.dynamics.board.dots) {
            this.dot_sprites.push(new DotSprite(this.game, this.dynamics.board,
                this.tile_dim, dot));
        }

        this.box_sprite = new GhostBoxSprite(this.game, this.dynamics.board,
            this.tile_dim, this.box);
    }

    update() {
        if (this.restart == false){
        var x = this.dynamics.pacman.x;
        this.dynamics.update();
        var c = 0;
        for (let gs of this.ghost_sprites) {
    if (c == 0){
        if (this.dynamics.power_time == 0){
            if (gs.ghost.action == 0){
                gs.loadTexture('RedUp');
            }
            if (gs.ghost.action == 1){
                gs.loadTexture('RedDown');
            }
            if (gs.ghost.action == 2){
                gs.loadTexture('RedLeft');
            }
            if (gs.ghost.action == 3){
                gs.loadTexture('RedRight');
            }
        }
        else{
            gs.loadTexture('VulnerableGhost');
        }
    }

    if (c == 1){
        if (this.dynamics.power_time == 0){
            if (gs.ghost.action == 0){
                gs.loadTexture('PinkUp');
            }
            if (gs.ghost.action == 1){
                gs.loadTexture('PinkDown');
            }
            if (gs.ghost.action == 2){
                gs.loadTexture('PinkLeft');
            }

            if (gs.ghost.action == 3){
                gs.loadTexture('PinkRight');
            }
        }
        else{
            gs.loadTexture('VulnerableGhost');
        }
    }

    if (c == 2){
        if (this.dynamics.power_time == 0){
            if (gs.ghost.action == 0){
                gs.loadTexture('BlueUp');
            }
            if (gs.ghost.action == 1){
                gs.loadTexture('BlueDown');
            }
            if (gs.ghost.action == 2){
                gs.loadTexture('BlueLeft');
            }
            if (gs.ghost.action == 3){
                gs.loadTexture('BlueRight');
            }
        }
        else{
            gs.loadTexture('VulnerableGhost');
        }
    }

    if (c == 3){
        if (this.dynamics.power_time == 0){
            if (gs.ghost.action == 0){
                gs.loadTexture('OrangeUp');
            }
            if (gs.ghost.action == 1){
                gs.loadTexture('OrangeDown');
            }
            if (gs.ghost.action == 2){
                gs.loadTexture('OrangeLeft');
            }
            if (gs.ghost.action == 3){
                gs.loadTexture('OrangeRight');
            }
        }
        else{
            gs.loadTexture('VulnerableGhost');
        }
    }
        c++;
        }
        
        if (this.pacman_sprite.pacman.action == 0){
                //this.pacman_sprite.loadTexture('PacUp');
                this.pacman_sprite.animations.play('up');
            }
        if (this.pacman_sprite.pacman.action == 1){
                //this.pacman_sprite.loadTexture('PacDown');
                this.pacman_sprite.animations.play('down');
            }
        if (this.pacman_sprite.pacman.action == 2){
                //this.pacman_sprite.loadTexture('PacLeft');
                this.pacman_sprite.animations.play('left');
            }
        if (this.pacman_sprite.pacman.action == 3){
                //this.pacman_sprite.loadTexture('PacRight');
                this.pacman_sprite.animations.play('right');
            }
        }

    else {
        //localStorage.setItem("param_list", JSON.stringify(this.ghost_controllers.param_list));
        for (let ps of this.prob_sprites){
            ps.visible = false;
        }
        if (this.win === false){
        this.pacman_sprite.visible = false;
        }
        else{
            this.game.paused = true;
        }
        //for (let gs of this.ghost_sprites){
        //    gs.visible = false;
        //}
    }

    if (this.refresh){
        this.dynamics.death.kill();
        this.refresh = false;
        this.pacman_sprite.kill();
        for (let gs of this.ghost_sprites){
            gs.kill();
        }
        for (let ds of this.dot_sprites){
            ds.kill();
        }
        //this.game.paused = false;
        this.score = 0;
        this.restart = false;
        this.dotCount = 0;
        this.win = true;
        this.overText.visible = false;
        for (let dot of this.dots){
            dot.alive = true;
        }
        this.dot_sprites = new Array<DotSprite>();
        for (let dot of this.dynamics.board.dots) {
            this.dot_sprites.push(new DotSprite(this.game, this.dynamics.board,
                this.tile_dim, dot));
        }
        this.pacman = new Pacman(this.board, 14.5, 26.5, 1);

        this.box = new GhostBox(this.board, 10, 15, 8, 5,
            [new Slot(12, 17, 12, 17.5, 12, 18), new Slot(14, 17, 14, 17.5, 14, 18), new Slot(16, 17, 16, 17.5, 16, 18)]);

        this.ghosts = new Array<Ghost>();

        for (var i = 0; i < 4; i++){
            if (i != 3){
                this.ghosts.push(new Ghost(this.board, false, null, null, 1,
                    this.box));
            }
            else{
                this.ghosts.push(new Ghost(this.board, true, 14, 14.5, 1, this.box));
            }
        }

        //this.ghost_controllers = new RedGhostController(this.ghosts, this.board);
        this.ghost_controllers = new testGhostControllerRL(this.ghosts, this.board, this.test);
        this.pacman_controller = new KeyboardController(
            this.game.input.keyboard, this.pacman, this.board);
        
        this.posts = new Array<Post>();
         this.posts.push(new RwPacmanPost(this.board, this.ghosts, this.pacman, 
            [this.pacman.spot], 5));

        this.posts.push(new ClosestRwPacmanPost(this.board, this.ghosts, this.pacman, 
            [this.pacman.spot], 5, 0.1));
        
        for (var b = 0; b < this.posts.length; b++){
        this.posts[b].update(-1);
        this.posts[b].num_points = 0;
        }
        this.dynamics = new Dynamics(this.pacman, this.ghosts, this.board,
            this.pacman_controller, this.ghost_controllers, this.posts, this);

        this.tick = 0;


        // frontend objects
        this.dot_sprites = new Array<DotSprite>();

        this.pacman_sprite = new PacmanSprite(this.game, this.dynamics.board,
            this.tile_dim,
            this.dynamics.pacman);
        this.pacman_sprite.loadTexture('Pacman');
        this.pacman_sprite.width = this.pacman_sprite.tile_dim * 1.5;
        this.pacman_sprite.height = this.pacman_sprite.tile_dim * 1.5;
        this.pacman_sprite.frame = 42;
        this.pacman_sprite.animations.add('right', [0, 1, 2, 3, 4, 5, 6], 14, true);
        this.pacman_sprite.animations.add('down', [14, 15, 16, 17, 18, 19, 20], 14, true);
        this.pacman_sprite.animations.add('left', [28, 29, 30, 31, 32, 33, 34], 14, true);
        this.pacman_sprite.animations.add('up', [42, 43, 44, 45, 46, 47, 48], 14, true);
        this.pacman_sprite.animations.play('up');

        this.ghost_sprites = new Array<GhostSprite>();
        var c = 0;
        for (let g of this.ghosts) {
            var GS = new GhostSprite(this.game,
                this.dynamics.board, this.tile_dim, g);
            if (c == 0){
                GS.loadTexture('RedUp');
            }
            if (c == 1){
                GS.loadTexture('PinkDown');
            }
            if (c == 2){
                GS.loadTexture('BlueUp');
            }
            if (c == 3){
                GS.loadTexture('OrangeDown');
            }
            c++;
            GS.width = GS.tile_dim * 1.5;
            GS.height = GS.tile_dim * 1.5;
            this.ghost_sprites.push(GS);

        }
        }
}

    render() {
    }
}
