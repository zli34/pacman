import { Board } from "../../src/backend/board";
import { Unit } from "../../src/backend/unit";
import { Dot } from "../../src/backend/dot";

describe("Unit Instant Movement", () => {
    let board: Board;
    let unit: Unit;

    before(() => {
        var dots = new Array<Dot>();
        // craete 2x2 grid
        dots.push(new Dot(0, 0, 0, -1, 2, -1, 1));
        dots.push(new Dot(1, 1, 0, -1, 3, 0, -1));
        dots.push(new Dot(2, 2, 0, 0, -1, -1, 3));
        dots.push(new Dot(3, 3, 0, 1, -1, 2, -1));

        board = new Board(2, 2, dots);
    });

    beforeEach(() => {
        unit = new Unit(board, true, 0.5, 0.5, 1);
    });

    it("constructor", () => {
        // make sure all properties are initialized
        chai.assert.equal(unit.board, board);
        chai.assert.equal(unit.x, 0.5);
        chai.assert.equal(unit.y, 0.5);
        chai.assert.equal(unit.spot, 0);
        chai.assert.equal(unit.action, -1);
        chai.assert.equal(unit.motion, -1);
        chai.assert.equal(unit.ticks_per_spot, 1);
        chai.assert.equal(unit.move_eps, 0.1);
    });

    it("update_spot", () => {
        // check top left corner of each sequare in 2x2 grid
        unit.x = 0.0;
        unit.y = 0.0;
        unit.update_spot();
        chai.assert.equal(unit.spot, 0);

        unit.x = 1.0;
        unit.y = 0.0;
        unit.update_spot();
        chai.assert.equal(unit.spot, 1);

        unit.x = 0.0;
        unit.y = 1.0;
        unit.update_spot();
        chai.assert.equal(unit.spot, 2);

        unit.x = 1.0;
        unit.y = 1.0;
        unit.update_spot();
        chai.assert.equal(unit.spot, 3);

        // check center of each square
        unit.x = 0.5;
        unit.y = 0.5;
        unit.update_spot();
        chai.assert.equal(unit.spot, 0);

        unit.x = 1.5;
        unit.y = 0.5;
        unit.update_spot();
        chai.assert.equal(unit.spot, 1);

        unit.x = 0.5;
        unit.y = 1.5;
        unit.update_spot();
        chai.assert.equal(unit.spot, 2);

        unit.x = 1.5;
        unit.y = 1.5;
        unit.update_spot();
        chai.assert.equal(unit.spot, 3);
    });

    it("update_motion", () => {
        // down action
        unit.action = 1;
        unit.update_motion();
        chai.assert.equal(unit.motion, 1);

        // left action, but theres nothing to the left
        unit.action = 2;
        unit.update_motion();
        chai.assert.equal(unit.motion, 1);
    });

    it("move", () => {
        // set unit in motion down
        unit.action = 1;
        unit.update_motion();

        // move down
        unit.move();
        chai.assert.equal(unit.x, 0.5);
        chai.assert.equal(unit.y, 1.5);
        chai.assert.equal(unit.spot, 2);
        chai.assert.equal(unit.motion, 1);

        // try moving down again
        unit.move()
        chai.assert.equal(unit.x, 0.5);
        chai.assert.equal(unit.y, 1.5);
        chai.assert.equal(unit.spot, 2);

        // try moving down again
        unit.move()
        chai.assert.equal(unit.x, 0.5);
        chai.assert.equal(unit.y, 1.5);
        chai.assert.equal(unit.spot, 2);

        // set unit in action right
        unit.action = 3;
        unit.update_motion();
        unit.move();
        chai.assert.equal(unit.x, 1.5);
        chai.assert.equal(unit.y, 1.5);
        chai.assert.equal(unit.spot, 3);
    });
});


describe("Unit Incremental Movement", () => {
    let board: Board;
    let unit: Unit;

    before(() => {
        var dots = new Array<Dot>();
        // craete 2x2 grid
        dots.push(new Dot(0, 0, 0, -1, 2, -1, 1));
        dots.push(new Dot(1, 1, 0, -1, 3, 0, -1));
        dots.push(new Dot(2, 2, 0, 0, -1, -1, 3));
        dots.push(new Dot(3, 3, 0, 1, -1, 2, -1));

        board = new Board(2, 2, dots);
    });

    beforeEach(() => {
        unit = new Unit(board, true, 0.5, 0.5, 3);
    });

    it("constructor", () => {
        // make sure all properties are initialized
        chai.assert.equal(unit.board, board);
        chai.assert.equal(unit.x, 0.5);
        chai.assert.equal(unit.y, 0.5);
        chai.assert.equal(unit.spot, 0);
        chai.assert.equal(unit.action, -1);
        chai.assert.equal(unit.motion, -1);
        chai.assert.equal(unit.ticks_per_spot, 3);
        chai.assert.equal(unit.move_eps, 0.1 / 3.);
    });

    it("update_spot", () => {
        // check top left corner of each sequare in 2x2 grid
        unit.x = 0.0;
        unit.y = 0.0;
        unit.update_spot();
        chai.assert.equal(unit.spot, 0);

        unit.x = 1.0;
        unit.y = 0.0;
        unit.update_spot();
        chai.assert.equal(unit.spot, 1);

        unit.x = 0.0;
        unit.y = 1.0;
        unit.update_spot();
        chai.assert.equal(unit.spot, 2);

        unit.x = 1.0;
        unit.y = 1.0;
        unit.update_spot();
        chai.assert.equal(unit.spot, 3);

        // check center of each square
        unit.x = 0.5;
        unit.y = 0.5;
        unit.update_spot();
        chai.assert.equal(unit.spot, 0);

        unit.x = 1.5;
        unit.y = 0.5;
        unit.update_spot();
        chai.assert.equal(unit.spot, 1);

        unit.x = 0.5;
        unit.y = 1.5;
        unit.update_spot();
        chai.assert.equal(unit.spot, 2);

        unit.x = 1.5;
        unit.y = 1.5;
        unit.update_spot();
        chai.assert.equal(unit.spot, 3);
    });

    it("update_motion", () => {
        // down action
        unit.action = 1;
        unit.update_motion();
        chai.assert.equal(unit.motion, 1);

        // left action, but theres nothing to the left
        unit.action = 2;
        unit.update_motion();
        chai.assert.equal(unit.motion, 1);
    });

    it("move", () => {
        // set unit in motion down
        unit.action = 1;
        unit.update_motion();

        // move down
        // step 1
        unit.move();
        chai.assert.closeTo(unit.x, 0.5, 1e-10);
        chai.assert.closeTo(unit.y, 0.5 + 1. / 3., 1e-10);
        chai.assert.equal(unit.spot, 0);
        chai.assert.equal(unit.motion, 1);

        // step 2
        unit.move();
        chai.assert.closeTo(unit.x, 0.5, 1e-10);
        chai.assert.closeTo(unit.y, 0.5 + 2. / 3., 1e-10);
        chai.assert.equal(unit.spot, 2);
        chai.assert.equal(unit.motion, 1);

        // step 3
        unit.move();
        chai.assert.closeTo(unit.x, 0.5, 1e-10);
        chai.assert.closeTo(unit.y, 1.5, 1e-10);
        chai.assert.equal(unit.spot, 2);
        chai.assert.equal(unit.motion, 1);
    });
});
