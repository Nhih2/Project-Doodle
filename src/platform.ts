import { Scene } from "./scene";
import { GameObject, getRandomInt, Vector } from "./gameObject";
import { Renderer } from "./renderer";

export class Platform extends GameObject {
    protected scene: Scene;
    public position: Vector;

    public id: number;

    protected baseX: number;
    protected baseY: number;
    protected segmentHeight: number;
    protected segmentWidth: number;
    protected segments: number;
    protected flexHeight: number;
    protected scoreRemoval: number | null = null;

    protected isExisted: boolean = true;
    protected tempExisted: boolean = true;

    protected tempScale: Vector;
    protected monsterScale: Vector = { x: 1.3, y: 1.3 }

    protected state: Vector = { x: 0, y: 0 };
    protected speed: Vector = { x: 150, y: 100 }
    protected platformSpawnChances: number[] = [10, 25, 5, 25, 50, 10, 50, 75, 15];

    constructor(position: Vector, size: Vector, scale: Vector, scene: Scene, canvasId: string, renderer: Renderer) {
        super(renderer.platformAssets, position, size, scale, canvasId, renderer);
        this.position = position;
        this.scene = scene;
        this.tempScale = this.scale;
    }

    public SetSpawnPoint(segments: number, id: number, score: number | null, baseX: number, baseY: number, segmentHeight: number, segmentWidth: number, flexHeight: number): void {
        this.segments = segments;
        this.baseX = baseX;
        this.baseY = baseY;
        this.segmentHeight = segmentHeight;
        this.segmentWidth = segmentWidth;
        this.flexHeight = flexHeight;
        this.scoreRemoval = score;
        this.id = id;
    }

    public Update(deltaTime: number): void {
        if (this.tempExisted === false) return;
        if (this.images === null) return;

        this.UpdateNewPosition();
        if (this.isExisted === false) return;
        this.UpdateBehaviour(deltaTime);

        this.UpdateRender(this.state.x);
    }

    protected UpdateBehaviour(deltaTime: number): void {
        if (this.state.x === 1) {
            this.BlueBehaviour(deltaTime, (this.state.y === 1));
        }
    }

    protected BlueBehaviour(deltaTime: number, goRight: boolean): void {
        let increasement = this.speed.x;
        if (goRight === false) increasement *= -1;
        this.position.x += increasement * deltaTime;
    }

    public UpdateGravity(gravityScale: number): void {
        if (this.isExisted === false) {
            this.position = { x: 100000, y: 100000 };
            return;
        }
        this.position.y += gravityScale;
    }

    protected UpdateNewPosition(): void {
        if (this.position.y > this.canvas.height) {
            this.ResetPosition();
        }
        if (this.state.x === 1) {
            if (this.position.x > this.canvas.width)
                this.position.x -= this.canvas.width * 1.2;
            if (this.position.x < -this.size.x * 2)
                this.position.x = this.canvas.width;

        } else {
            if (this.position.x > this.canvas.width / 1.22)
                this.position.x -= this.canvas.width / 1.22;
            if (this.position.x < -this.size.x)
                this.position.x = this.canvas.width / 1.22;
        }
    }

    protected ResetPosition(): void {
        this.position.y -= this.baseY;
        this.position.x = getRandomInt(this.baseX - this.segmentWidth / 2, this.baseX + this.segmentWidth / 2);
        this.position.y = getRandomInt(this.baseY - this.segmentHeight / 2 - this.flexHeight,
            this.baseY + this.segmentHeight / 2 + this.flexHeight);
        this.RandomizeNewPlatform();
        if (this.scoreRemoval === null) { }
        else if (this.scoreRemoval < this.scene.getScore()) {
            this.scene.erasePlatform(this);
            this.isExisted = false;
        }
    }

    protected RandomizeNewPlatform() {
        this.tempExisted === true;
        this.state.x = 0;
        let sceneState = this.scene.getState();
        let chance = 0;
        this.scale = this.tempScale;
        let randomNumber = getRandomInt(1, 100);
        if (sceneState >= 1 && this.scoreRemoval !== null) {
            chance = this.platformSpawnChances[(sceneState - 1) * 3 + 1];
            if (randomNumber < chance) {
                this.state.x = 2;
                this.state.y = 1;
            }
        }
        randomNumber = getRandomInt(1, 100);
        if (sceneState >= 2) {
            chance = this.platformSpawnChances[(sceneState - 1) * 3];
            if (randomNumber < chance) {
                this.state.x = 1;
                this.state.y = 1;
                if (randomNumber < chance / 2) this.state.y = 2;
                console.log(chance);
            }
        }
        randomNumber = getRandomInt(1, 100);
        if (sceneState >= 3) {
            chance = this.platformSpawnChances[(sceneState - 1) * 3 + 2];
            if (randomNumber < chance) {
                this.scale = this.monsterScale;
                this.state.x = 3;
                this.state.y = 1;
            }
        }
    }

    public getState(): number {
        if (this.isExisted === false || this.tempExisted === false) return -1;
        return this.state.x;
    }

    public temporaryRemove(): void {
        if (this.isExisted === false) return;
        this.tempExisted = false;
    }
}