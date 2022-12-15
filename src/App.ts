import {glMatrix} from 'gl-matrix/gl-matrix';
import {FileLoader, InvalidFileFormatError} from './FileLoader';
import {GUI} from 'dat.gui';
import {Camera} from './Camera';
import {Scene} from './Scene';
import {Renderer} from './Renderer';
import {vertexShader} from './shaders/VertexShader';
import {fragmentShader} from './shaders/FragmentShader';
import {PointCloud} from './PointCloud';

/**
 * Main class of the whole program, handles interaction and drawing with help of other classes
 */
export default class App {
    private gui: GUI;
    private fileLoader: FileLoader;
    private fileUploadElement: HTMLInputElement;
    private canvas: HTMLCanvasElement;
    private camera: Camera;
    private scene: Scene;
    private pointCloud: PointCloud;
    private renderer: Renderer;
    private mouseX: number;
    private mouseY: number;
    private keys: object = {};


    constructor() {
        this.gui = new GUI({ width: 400 });
        this.fileLoader = new FileLoader();
        this.fileUploadElement = document.getElementById('file-upload') as HTMLInputElement;

        this.scene = new Scene();
        this.canvas = document.querySelector('canvas');
        this.camera = new Camera();
        this.renderer = new Renderer(this.canvas);
        this.renderer.createProgram(vertexShader, fragmentShader);
    }


    public initControls(): App {
        this.canvas.addEventListener('mousedown', (event) => {
            const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
            this.mouseX = event.clientX - rect.left;
            this.mouseY = event.clientY - rect.top;

            this.canvas.onmousemove = (ev) => {
                this.mouseX = null;
                this.mouseY = null;

                const sensitivity = this.camera.inputs.sensitivity;
                const previousScreenY = ev.screenY - ev.movementY;

                const xOffset = ev.movementX * sensitivity;
                const yOffset = (previousScreenY - ev.screenY) * sensitivity;

                this.camera.processMouseInput(xOffset, yOffset);
            };
        });

        this.canvas.addEventListener('mouseup', (event) => {
            this.mouseX = null;
            this.mouseY = null;
            this.canvas.onmousemove = null;
        });

        this.canvas.addEventListener('keydown', (event) => {
            this.keys[event.keyCode] = true;
        });

        this.canvas.addEventListener('keyup', (event) => {
            this.keys[event.keyCode] = false;
        });

        return this;
    }


    public initGui(): App {
        this.gui.add({
            loadFile: () => {
                this.fileUploadElement.click();
            }
        }, 'loadFile')
            .name('Load point cloud file');

        this.fileUploadElement.onchange = () => {
            try {
                this.fileLoader.loadFile(this.fileUploadElement.files[0], (pointCloud) => {
                    this.pointCloud = pointCloud;
                    this.scene.clear();
                    this.scene.addObject(pointCloud);
                });
            } catch (err) {
                console.error(err);

                if (err instanceof InvalidFileFormatError) {
                    alert(err.message);
                } else {
                    alert('Unknown error occurred. Check console for further details.');
                }
            }
        };

        const cameraFolder = this.gui.addFolder('Camera');
        cameraFolder.add(this.camera.inputs, 'FOV', 1, 180, 1);
        cameraFolder.add(this.camera.inputs, 'zNear', 0.01);
        cameraFolder.add(this.camera.inputs, 'zFar', 1);
        cameraFolder.add(this.camera.inputs, 'speed', 0.1, 1, 0.1);
        cameraFolder.add(this.camera.inputs, 'sensitivity', 0.1, 1, 0.1);
        cameraFolder.open();

        const pointCloudInputs = this.gui.addFolder('Point cloud');
        pointCloudInputs.add(PointCloud.inputs, 'Scale', 0.1, 10, 0.1);
        pointCloudInputs.add(PointCloud.inputs, 'RotationX', -180, 180, 0.1);
        pointCloudInputs.add(PointCloud.inputs, 'RotationY', -180, 180, 0.1);
        pointCloudInputs.add(PointCloud.inputs, 'RotationZ', -180, 180, 0.1);
        pointCloudInputs.open();

        return this;
    }


    public render() {
        requestAnimationFrame(() => {
            this.canvas.width  = window.innerWidth;
            this.canvas.height = window.innerHeight;

            if (this.pointCloud) {
                this.pointCloud.createMatrix();
                this.pointCloud.scale(PointCloud.inputs.Scale)
                    .rotate(PointCloud.inputs.RotationX, PointCloud.inputs.RotationY, PointCloud.inputs.RotationZ)
                    .center();
            }

            this.camera.createMatrix();
            this.camera.setPerspective(
                glMatrix.toRadian(this.camera.inputs.FOV),
                this.canvas.clientWidth / this.canvas.clientHeight,
                this.camera.inputs.zNear,
                this.camera.inputs.zFar
            );

            this.handleKeyboardInputs();

            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(() => this.render());
        });
    }


    private handleKeyboardInputs() {
        this.camera.processKeyboardInput(this.keys);
    }
}