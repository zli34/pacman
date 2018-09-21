import { Unit } from "./unit";
import { Board } from "./board";
import { GhostBox, SlotRoute } from "./ghost_box";
export class Ghost extends Unit {
    readonly box: GhostBox;
    route: SlotRoute;
    route_counts: number;
    constructor(board: Board, alive: boolean, x: number, y: number,
        ticks_per_spot: number, box: GhostBox) {
        super(board, alive, x, y, ticks_per_spot);
        this.box = box;
        if (!this.is_alive()) {
            this.route = this.box.assign_slot();
            this.x = this.route.dest_x;
            this.y = this.route.dest_y;
            this.route_counts = 0;
        }
    }

    dead_move(): void {
        if (this.route.dest_type == 5) {
            this.alive = true;
            var tile = Math.floor(this.y) * this.board.num_tiles_x +
                Math.floor(this.x);
            this.spot = this.board.get_dot(tile, false).spot;
            this.dest_spot = this.spot;
            this.motion = 0;
        } else {
            var dist_to_move = 1.0 / this.ticks_per_spot;
            var dist_to_dest = Math.sqrt(
                (this.x - this.route.dest_x) * (this.x - this.route.dest_x)
                + (this.y - this.route.dest_y) * (this.y - this.route.dest_y));

            if (dist_to_move + this.move_eps > dist_to_dest) {
                this.x = this.route.dest_x;
                this.y = this.route.dest_y;
                ++this.route_counts;
                if (this.route_counts > 6) {
                    this.route = this.box.update_route(this.route, true);
                } else {
                    this.route = this.box.update_route(this.route, false);
                }
            } else {
                var alpha = dist_to_move / dist_to_dest;
                this.x = this.x * (1.0 - alpha) + this.route.dest_x * alpha;
                this.y = this.y * (1.0 - alpha) + this.route.dest_y * alpha;
            }
        }
    }
}
