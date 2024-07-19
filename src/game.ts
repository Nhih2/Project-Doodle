import { Scene } from "./scene";
import { Doodle } from "./doodle";
import { GameObject, Vector } from "./gameObject";
import { Renderer } from "./renderer";
import { NONE } from "phaser";

export class Game {
    protected canvasId = 'game-canvas';
    protected buttonId = 'myButton';

    protected renderer: Renderer;
    protected doodle: Doodle;
    protected scene: Scene;

    protected lastTime: number = 0;

    protected isPlaying = false;

    protected currentScore = 0;
    protected highScore = 0;

    constructor() {
        this.menuLoop = this.menuLoop.bind(this);
        this.isPlaying = false;
    }

    protected gameLoop(currentTime: number): void {
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // Updates
        this.doodle.Update(deltaTime);
        this.scene.Update(deltaTime);

        //Update every other gameObjects before this.
        this.renderer.Update();

        this.currentScore = Math.floor(this.scene.getScore());

        //this.doodle.drawHitBox();
        /*for (const platform of this.scene.platforms) {
            platform.drawHitBox();
        }*/

        // Request the next frame
        if (this.isPlaying === true) {
            window.requestAnimationFrame(this.gameLoop);
        } else {
            window.requestAnimationFrame(this.menuLoop);
        }
    }

    protected menuLoop() {
        if (this.isPlaying === true) {
            window.requestAnimationFrame(this.gameLoop);
        }
        else {
            let button = document.getElementById('myButton') as HTMLButtonElement;

            button.textContent = "PLAY";
            button.style.backgroundImage = 'assets/game/play.jpg';
            button.style.display = 'inline';
            button.disabled = false;

            let button2 = document.getElementById('myButton2') as HTMLButtonElement;

            button2.textContent = "Current score: " + this.currentScore + "\n"
                + 'High Score: ' + this.highScore;
            button2.disabled = true;
            button2.style.display = 'inline';


            button.addEventListener('click', () => {
                this.gameLoop = this.gameLoop.bind(this);
                this.renderer = new Renderer(this.canvasId);
                this.doodle = new Doodle({ x: 220, y: 400 }, { x: 50, y: 100 }, { x: 0.2, y: 0.2 }, { x: 350, y: 800 }, this.canvasId, this.renderer);
                this.scene = new Scene(this, this.doodle, 20, this.canvasId, this.renderer);
                this.renderer.setScene(this.scene);
                this.isPlaying = true;
                this.doodle.setState(1);

                button.disabled = true;
                button.style.display = 'none';

                button2.disabled = true;
                button2.style.display = 'none';
            })

            window.requestAnimationFrame(this.menuLoop);
        }
    }

    // Start the animation
    start(): void {
        window.requestAnimationFrame(this.menuLoop);
    }

    public gameOver() {
        if (this.currentScore > this.highScore) {
            this.highScore = this.currentScore;
        }
        this.isPlaying = false;
    }
}

let game = new Game();
game.start();