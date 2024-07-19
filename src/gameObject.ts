import { Renderer } from "./renderer";

export type Vector = {
    x: number;
    y: number;
}

export function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
}

export class GameObject {
    protected position: Vector;
    protected size: Vector;
    protected images: HTMLImageElement[] | null;
    protected scale: Vector;
    protected renderer: Renderer;
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D | null;

    protected hitBoxOffset: Vector = { x: 0, y: 0 };
    protected hitBoxScale: Vector = { x: 1, y: 1 };

    constructor(images: HTMLImageElement[] | null, position: Vector, size: Vector, scale: Vector, canvasId: string, renderer: Renderer) {
        this.images = images;
        this.position = position;
        this.size = size;
        this.scale = scale;
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.renderer = renderer;
        this.ctx = this.canvas.getContext('2d');
    }

    protected UpdateRender(imageId: number): void {
        if (this.images === null) return;
        this.renderer.addElement(this.images[imageId], this.position, this.scale);
        this.size.x = this.images[imageId].width;
        this.size.y = this.images[imageId].height;
    }

    public detectCollision(gobj1: GameObject, gobj2: GameObject, offset1: boolean, offset2: boolean): boolean {
        let left1 = gobj1.position.x;
        let right1 = gobj1.position.x + gobj1.size.x * gobj1.scale.x;
        let top1 = gobj1.position.y;
        let bottom1 = gobj1.position.y + gobj1.size.y * gobj1.scale.y;
        if (offset1 === true) {
            left1 = gobj1.position.x + gobj1.hitBoxOffset.x;
            right1 = gobj1.position.x + (gobj1.size.x * gobj1.scale.x + gobj1.hitBoxOffset.x) * gobj1.hitBoxScale.x;
            top1 = gobj1.position.y + gobj1.hitBoxOffset.y;
            bottom1 = gobj1.position.y + (gobj1.size.y * gobj1.scale.y + gobj1.hitBoxOffset.y) * gobj1.hitBoxScale.y;
        }

        let left2 = gobj2.position.x;
        let right2 = gobj2.position.x + gobj2.size.x * gobj2.scale.x;
        let top2 = gobj1.position.y;
        let bottom2 = gobj2.position.y + gobj2.size.y * gobj2.scale.y;
        if (offset2 === true) {
            left2 = gobj2.position.x + gobj2.hitBoxOffset.x;
            right2 = gobj2.position.x + (gobj2.size.x * gobj2.scale.x + gobj2.hitBoxOffset.x) * gobj2.hitBoxScale.x;
            top2 = gobj2.position.y + gobj2.hitBoxOffset.y;
            bottom2 = gobj2.position.y + (gobj2.size.y * gobj2.scale.y + gobj2.hitBoxOffset.y) * gobj2.hitBoxScale.y;
        }

        if (bottom1 < top2 || top1 > bottom2 || right1 < left2 || left1 > right2) {
            return false;
        } else {
            return true;
        }
    }

    public drawHitBox(): void {
        if (this.ctx === null) return;
        this.ctx.strokeStyle = 'green';
        this.ctx.lineWidth = 3;

        let x = this.position.x, y = this.position.y;
        this.ctx.beginPath();
        this.ctx.moveTo(x + this.hitBoxOffset.x,
            y + this.hitBoxOffset.y);

        this.ctx.lineTo(x + (this.size.x * this.scale.x + this.hitBoxOffset.x) * this.hitBoxScale.x,
            y + this.hitBoxOffset.y);

        this.ctx.lineTo(x + (this.size.x * this.scale.x + this.hitBoxOffset.x) * this.hitBoxScale.x,
            y + (this.size.y * this.scale.y + this.hitBoxOffset.y) * this.hitBoxScale.y);

        this.ctx.lineTo(x + this.hitBoxOffset.x,
            y + (this.size.y * this.scale.y + this.hitBoxOffset.y) * this.hitBoxScale.y);

        this.ctx.lineTo(x + this.hitBoxOffset.x,
            y + this.hitBoxOffset.y);

        this.ctx.closePath();

        this.ctx.stroke();
    }
}