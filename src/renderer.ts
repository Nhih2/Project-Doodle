import { Scene } from "./scene";
import { Vector } from "./gameObject";

export class Renderer {
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D | null;
    protected scene: Scene;
    protected backgroundAssets: HTMLImageElement[];
    public doodleAssets: HTMLImageElement[];
    public platformAssets: HTMLImageElement[];

    private prevScore = 0;

    private elements: { image: HTMLImageElement, position: Vector, scale: Vector, size: Vector }[] = [];

    private readonly imagePaths: string[] = [
        'assets/game/BG.png',
        'assets/game/Doodle.png',
        'assets/game/Doodle_Left.png',
        'assets/game/platform1_3.png',
        'assets/game/platform2.png',
        'assets/game/platform3.png',
        'assets/game/platform4.png'
    ];

    constructor(canvasId: string) {

        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d');

        const images = this.pathsToImg(this.imagePaths);

        this.backgroundAssets = [
            images[0]
        ];

        this.doodleAssets = [
            images[1],
            images[2]
        ];

        this.platformAssets = [
            images[3],
            images[4],
            images[5],
            images[6]
        ];
    }

    public setScene(scene: Scene) {
        this.scene = scene;
    }

    public Update(): void {
        if (this.backgroundAssets.length !== 0) {
            this.addElement(this.backgroundAssets[0], { x: 0, y: 0 }, { x: 1, y: 1 });
        }
        this.drawElements();
        this.elements.length = 0;
        this.drawScore();
    }

    protected drawScore() {
        if (this.ctx === null) return;
        // Set the font size and style
        this.ctx.font = '48px serif';

        // Set the color of the text
        this.ctx.fillStyle = 'blue';

        // Draw the number on the canvas
        let score = this.scene.getScore();
        score = Math.floor(score);
        if (score === 0) this.ctx.fillText(this.prevScore.toString(), 10, 50);
        else {
            this.prevScore = score;
            this.ctx.fillText(score.toString(), 10, 50);
        }
    }

    public addElement(image: HTMLImageElement, position: Vector, scale: Vector): void {
        const size = { x: image.width * scale.x, y: image.height * scale.y };
        this.elements.push({ image, position, scale, size });
    }

    protected drawImage(image: HTMLImageElement, coord: Vector, scale: Vector): void {
        if (this.ctx === null) return;
        const width = image.width * scale.x;
        const height = image.height * scale.y;
        this.ctx.drawImage(image, coord.x, coord.y, width, height);
        //this.drawHitBox(image, coord, scale);
    }

    public drawHitBox(image: HTMLImageElement, coord: Vector, scale: Vector): void {
        if (this.ctx === null) return;
        this.ctx.strokeStyle = 'green';
        this.ctx.lineWidth = 3;

        let x = coord.x, y = coord.y;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + image.width * scale.x, y);
        this.ctx.lineTo(x + image.width * scale.x, y + image.height * scale.y);
        this.ctx.lineTo(x, y + image.height * scale.y);
        this.ctx.lineTo(x, y);
        this.ctx.closePath();

        this.ctx.stroke();
    }

    public drawElements(): void {
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the entire canvas

            /*for (const element of this.elements) {
                this.drawImage(element.image, element.position, element.scale);
                console.log(element.image)
            }*/

            for (let i = this.elements.length - 1; i >= 0; i--) {
                this.drawImage(this.elements[i].image, this.elements[i].position, this.elements[i].scale);
                //console.log(this.elements[i].image)
            }
        }
    }

    public pathToImg(path: string): HTMLImageElement {
        const img = new Image();
        img.src = path;
        /*img.onload = () => {
            console.log('Image loaded successfully!');
            document.body.appendChild(img); // Append the image to the document body
        };*/
        return img;
    }

    public pathsToImg(paths: string[]): HTMLImageElement[] {
        let images: HTMLImageElement[] = [];

        paths.forEach(path => {
            const img = this.pathToImg(path);
            images.push(img);
        });

        return images;
    }
}