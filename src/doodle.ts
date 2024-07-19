import { GameObject, Vector } from "./gameObject";
import { Renderer } from "./renderer";

export class Doodle extends GameObject {
    protected speed: Vector = { x: 0, y: 0 };
    protected baseSpeed: Vector;
    public exceedSpeed: Vector = { x: 0, y: 0 };
    //protected velocity: Vector = { x: 0, y: 0 };
    //protected maxSpeed: Vector = { x: 50, y: 20 }
    //protected maxVelocity: Vector = { x: 15, y: 20 }

    private isMovingLeft: boolean = false;
    private isMovingRight: boolean = false;
    private isLookingRight: boolean = true;

    protected isMaxHeight: boolean = false;
    protected maxHeight: 300 = 300;

    private speedMultiplier = 1;
    protected state = 0;

    constructor(position: Vector, size: Vector, scale: Vector, baseSpeed: Vector, canvasId: string, renderer: Renderer) {
        super(renderer.doodleAssets, position, size, scale, canvasId, renderer);
        this.baseSpeed = baseSpeed;

        this.hitBoxOffset = { x: 15, y: 60 };
        this.hitBoxScale = { x: 0.5, y: 0.5 };
    }

    public Update(deltaTime: number): void {
        if (this.ctx == null) return;
        this.addKeyListeners();

        this.UpdateVelocity();

        this.UpdateMovement(deltaTime);

        this.UpdatePosition();

        this.UpdateId();
    }

    protected SuperJump(): void {
        if (this.speed.y > 0)
            this.Jump(2);
    }

    public FallingLowJump(): void {
        if (this.speed.y > 0)
            this.Jump(0.7);
    }

    public MonsterJump(): number {
        if (this.speed.y > 0) {
            this.Jump(1);
            return 0;
        }
        else return -1;
    }

    protected Jump(multiplier: number): void {
        this.speed.y = -this.baseSpeed.y * multiplier;
    }

    public FallingJump(): void {
        if (this.speed.y > 0)
            this.Jump(1);
    }

    protected UpdateMovement(deltaTime: number): void {
        if (this.state === 0) return;
        if (this.position.y < this.maxHeight) this.isMaxHeight = true;
        else this.isMaxHeight = false;

        deltaTime *= this.speedMultiplier;
        this.position.x += this.speed.x * deltaTime;

        if (this.isMaxHeight === false) {
            this.position.y += this.speed.y * deltaTime;
        } else {
            if (this.speed.y > 0)
                this.position.y += this.speed.y * deltaTime;
            else {
                this.exceedSpeed.y = this.speed.y * deltaTime;
                //this.speed.y = 0;
            }
        }
    }

    protected UpdatePosition(): void {
        if (this.position.y > this.canvas.height)
            this.state = -1;
        if (this.position.x > this.canvas.width)
            this.position.x = -this.size.x / 4;
        if (this.position.x < -this.size.x / 4)
            this.position.x = this.canvas.width;
    }

    protected UpdateId(): void {
        let id = 0;
        if (this.isLookingRight === false) id = 1;
        this.UpdateRender(id);
    }

    public UpdateGravity(gravityScale: number) {
        this.speed.y += gravityScale;
    }

    protected UpdateVelocity() {
        if (this.isMovingLeft === true) {
            this.speed.x = -this.baseSpeed.x;
            this.isLookingRight = false;
            this.switchLeft();
        }
        if (this.isMovingRight === true) {
            this.speed.x = this.baseSpeed.x;
            this.isLookingRight = true;
            this.switchRight();
        }
        if (this.isMovingLeft === false && this.isMovingRight === false) this.speed.x = 0;

        /*if (this.isMovingRight === true) this.velocity.x += this.baseSpeed.x;
        if (this.isMovingLeft === true) this.velocity.x += -this.baseSpeed.x;
        
        if (this.isMovingLeft === false && this.isMovingRight === false) this.velocity.x = 0;

        this.speed.x += this.velocity.x;
        this.speed.y += this.velocity.y;

        this.speed.x /= 2;
        this.speed.y /= 2;

        this.velocity.x /= 5;
        this.velocity.y /= 5;

        if (this.speed.x < 1 && this.speed.x > -1) this.speed.x = 0;
        if (this.speed.y < 1 && this.speed.y > -1) this.speed.y = 0;

        if (this.velocity.x < 1 && this.velocity.x > -1) this.velocity.x = 0;
        if (this.velocity.y < 1 && this.velocity.y > -1) this.velocity.y = 0;

        if (this.speed.x > this.maxSpeed.x) this.speed.x = this.maxSpeed.x;
        if (this.speed.y > this.maxSpeed.y) this.speed.y = this.maxSpeed.y;*/
    }

    public getMaxHeightStatus(): boolean {
        return this.isMaxHeight;
    }

    protected addKeyListeners(): void {
        window.addEventListener('keydown', (event) => {
            if (this.isMovingLeft === false) {
                if (event.code === 'KeyA' || event.code === 'ArrowLeft') {
                    this.isMovingLeft = true;
                }
            }
            if (this.isMovingRight === false) {
                if (event.code === 'KeyD' || event.code === 'ArrowRight') {
                    this.isMovingRight = true;
                }
            }
            if (event.code === 'KeyW' || event.code === 'ArrowUp') {

            }
        });

        window.addEventListener('keyup', (event) => {
            if (this.isMovingLeft === true) {
                if (event.code === 'KeyA' || event.code === 'ArrowLeft') {
                    this.isMovingLeft = false;
                }
            }
            if (this.isMovingRight === true) {
                if (event.code === 'KeyD' || event.code === 'ArrowRight') {
                    this.isMovingRight = false;
                }
            }
        });
    }

    private switchRight(): void {
        this.hitBoxOffset = { x: 15, y: 60 };
        this.hitBoxScale = { x: 0.5, y: 0.5 };
    }

    private switchLeft(): void {
        this.hitBoxOffset = { x: 32, y: 60 };
        this.hitBoxScale = { x: 0.5, y: 0.5 };
    }

    public getState(): number {
        return this.state;
    }

    public setState(state: number): void {
        this.state = state;
    }
}