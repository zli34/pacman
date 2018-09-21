import { Board } from "./board";
import { Ghost } from "./ghost";

export class GhostBox {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;

    readonly slots: Array<Slot>;
    readonly num_slots: number;
    occupants: Array<number>;
    constructor(board: Board,
        x: number, y: number, width: number, height: number,
        slots: Array<Slot>) {

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.slots = slots;
        this.num_slots = this.slots.length;

        // initialize all to free
        this.occupants = new Array<number>();
        for (var i = 0; i < this.num_slots; ++i) {
            this.occupants[i] = 0;
        }
    }

    assign_slot(): SlotRoute {
        var best_slot = 0;
        var best_occ = Infinity;
        for (var i = 0; i < this.num_slots; ++i) {
            if (this.occupants[i] < best_occ) {
                best_slot = i;
                best_occ = this.occupants[i];
            }
        }

        this.occupants[best_slot]++;

        // start at center going up
        var sr = new SlotRoute(best_slot, 1, 0,
            this.slots[best_slot].center_x,
            this.slots[best_slot].center_y);
        return sr;
    }

    update_route(curr_sr: SlotRoute, done: boolean): SlotRoute {
        if (curr_sr.dest_type == 0 && curr_sr.motion == 0) {
            // new is center going down
            return new SlotRoute(curr_sr.index, 1, 1,
                this.slots[curr_sr.index].center_x,
                this.slots[curr_sr.index].center_y);
        } else if (curr_sr.dest_type == 1 && curr_sr.motion == 0 && !done) {
            // new is top going up
            return new SlotRoute(curr_sr.index, 0, 0,
                this.slots[curr_sr.index].top_x,
                this.slots[curr_sr.index].top_y);
        } else if (curr_sr.dest_type == 1 && curr_sr.motion == 1 && !done) {
            // new is bottom going down
            return new SlotRoute(curr_sr.index, 2, 1,
                this.slots[curr_sr.index].bottom_x,
                this.slots[curr_sr.index].bottom_y);
        } else if (curr_sr.dest_type == 2 && curr_sr.motion == 1) {
            // new is center going up
            return new SlotRoute(curr_sr.index, 1, 0,
                this.slots[curr_sr.index].center_x,
                this.slots[curr_sr.index].center_y);
        } else if (curr_sr.dest_type == 1 && curr_sr.motion == 0 && done) {
            // new is middle of box to head out
            --this.occupants[curr_sr.index];
            return new SlotRoute(null, 3, null,
                this.x + 0.5 * this.width,
                this.y + 0.5 * this.height);
        } else if (curr_sr.dest_type == 1 && curr_sr.motion == 1 && done) {
            // new is middle of box to head out
            --this.occupants[curr_sr.index];
            return new SlotRoute(null, 3, null,
                this.x + 0.5 * this.width,
                this.y + 0.5 * this.height);
        } else if (curr_sr.dest_type == 3) {
            // new is top of box to go free
            return new SlotRoute(null, 4, null,
                this.x + 0.5 * this.width,
                this.y - 0.5);
        } else if (curr_sr.dest_type == 4) {
            // no more routes, ghost is free
            return new SlotRoute(null, 5, null, null, null);
        } else {
            throw new Error("Invalid combination of "
                + "dest type " + curr_sr.dest_type + ", "
                + "motion " + curr_sr.motion + ", and"
                + "done status " + done);
        }
    }


}


export class Slot {
    readonly top_x: number;
    readonly top_y: number;
    readonly center_x: number;
    readonly center_y: number;
    readonly bottom_x: number;
    readonly bottom_y: number;

    constructor(top_x: number, top_y: number,
        center_x: number, center_y: number,
        bottom_x: number, bottom_y: number) {

        this.center_x = center_x;
        this.center_y = center_y;
        this.top_x = top_x;
        this.top_y = top_y;
        this.bottom_x = bottom_x;
        this.bottom_y = bottom_y;
    }
}


export class SlotRoute {
    readonly index: number;
    // 0: top, 1: center, 2: bottom, 3: done.middle, 4: done.out, 5: out
    readonly dest_type: number;
    // 0: up, 1: down
    readonly motion: number;
    readonly dest_x: number;
    readonly dest_y: number;

    constructor(index: number, dest_type: number, motion: number,
        dest_x: number, dest_y: number) {
        this.index = index;
        this.dest_type = dest_type;
        this.motion = motion;
        this.dest_x = dest_x;
        this.dest_y = dest_y;
    }
}
