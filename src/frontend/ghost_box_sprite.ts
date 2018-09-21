import { Board } from "../backend/board";
import { GhostBox } from "../backend/ghost_box";

export class GhostBoxSprite extends Phaser.Sprite {
    readonly board: Board;
    readonly box: GhostBox;

    readonly tile_dim: number;

    constructor(viewer: Phaser.Game, board: Board,
        tile_dim: number, box: GhostBox) {
        var g = new Phaser.Graphics(viewer, 0, 0);
        g.lineStyle(0.25 * tile_dim, 0x0000ff, 1);
        g.drawRect(0, 0,
            (box.width - 1.125) * tile_dim,
            (box.height - 1.125) * tile_dim);

        g.lineStyle(0.35 * tile_dim, 0xF5CBA7, 1);
        g.moveTo(((box.width - 1.125) * tile_dim) * 1.0 / 3.0, 0);
        g.lineTo(((box.width - 1.125) * tile_dim) * 2.0 / 3.0, 0);
        g.endFill();

        super(viewer, (box.x + 0.375) * tile_dim, (box.y + 0.375) * tile_dim,
            g.generateTexture());
        viewer.add.existing(this);

        this.board = board;
        this.box = box;
    }
}
