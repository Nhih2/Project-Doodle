import { Game } from "./game";
import { Doodle } from "./doodle";
import { getRandomInt, Vector } from "./gameObject";
import { Platform } from "./platform";
import { Renderer } from "./renderer";

export class Scene {
    protected gravityScale: number = 1;
    protected doodle: Doodle;
    public platforms: Platform[] = [];
    protected score: number = 0;
    protected game: Game;

    protected checkPoint: number = 5;
    protected checkPoints: boolean[] = [false, false, false, false, false];
    protected checkScores: number[] = [2500, 5000, 10000, 16000, 25000];

    protected segments: number = 5;
    protected state: number = 0;

    constructor(game: Game, doodle: Doodle, gravityScale: number, canvasId: string, renderer: Renderer) {
        this.game = game;
        this.doodle = doodle;
        this.gravityScale = gravityScale;

        let canvas = document.getElementById(canvasId) as HTMLCanvasElement;

        let segmentHeight: number = canvas.height / 4;
        let segmentWidth: number = canvas.width;

        //For more natural platforms generation
        let flexHeight = segmentHeight / 20;

        let baseX = segmentWidth / 2;
        let baseY = segmentHeight / 2;
        for (let i = 0; i < this.segments; i++) {
            let randomX = getRandomInt(baseX - segmentWidth / 2, baseX + segmentWidth / 2);
            let randomY = getRandomInt(baseY - segmentHeight / 6, baseY + segmentHeight / 6);
            let newPlatform = new Platform({ x: randomX, y: randomY }, { x: 62, y: 17 }, { x: 1.8, y: 1.36 }, this, canvasId, renderer);
            newPlatform.SetSpawnPoint(this.segments, this.platforms.length, null, baseX, baseY - (i + 1) * segmentHeight, segmentHeight / 6, segmentWidth, 0);
            this.platforms.push(newPlatform);
            for (let j = 0; j < 3; j++) {
                let scoreRemove: number = this.checkScores[this.checkPoint - 1] + (j - 1) * 200;
                if (j > 0) scoreRemove = this.checkScores[j - 1] + (j - 1) * 200;
                let randomX = getRandomInt(baseX - segmentWidth / 2, baseX + segmentWidth / 2);
                let randomY = getRandomInt(baseY - segmentHeight / 2 - flexHeight, baseY + segmentHeight / 2 + flexHeight);
                let newPlatform = new Platform({ x: randomX, y: randomY }, { x: 62, y: 17 }, { x: 1.8, y: 1.36 }, this, canvasId, renderer);
                newPlatform.SetSpawnPoint(this.segments, this.platforms.length, scoreRemove, baseX, baseY - (i + 1) * segmentHeight, segmentHeight, segmentWidth, flexHeight);
                this.platforms.push(newPlatform);
            }
            baseY += segmentHeight;
        }
    }

    public Update(deltaTime: number) {
        this.doodle.UpdateGravity(this.gravityScale);

        this.UpdateCollision(deltaTime);

        this.UpdateScore();
    }

    protected UpdateCollision(deltaTime: number): void {
        for (const platform of this.platforms) {
            if (platform.getState() === -1) continue;
            platform.Update(deltaTime);
            if (this.doodle.detectCollision(platform, this.doodle, false, true))
                if (platform.getState() === 3) {
                    if (this.doodle.MonsterJump() === -1) this.gameOver();
                    else platform.temporaryRemove();
                }
                else if (platform.getState() === 2) this.doodle.FallingLowJump();
                else this.doodle.FallingJump();
            platform.UpdateGravity(-this.doodle.exceedSpeed.y);
        }
    }

    protected UpdateScore() {
        this.score -= this.doodle.exceedSpeed.y;
        this.doodle.exceedSpeed.y = 0;
        for (let i = 0; i < this.checkPoint; i++) {
            if (this.score > this.checkScores[i] && this.checkPoints[i] === false && i >= 1) {
                this.checkPoints[i] = true;
                this.state++;
            }
        }
        //console.log(this.state, ' ', this.score);

        if (this.doodle.getState() === -1) {
            this.gameOver();
        }
    }

    public gameOver(): void {
        this.game.gameOver();
    }

    public getScore(): number {
        return this.score;
    }

    public erasePlatform(platform: Platform): void {
        this.platforms.filter(plat => plat.id === platform.id, 1);
    }

    public getState(): number {
        return this.state;
    }
}