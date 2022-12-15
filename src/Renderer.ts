import * as twgl from 'twgl.js';
import {ProgramInfo} from 'twgl.js';
import {Scene} from './Scene';
import {Camera} from './Camera';

export class Renderer {
    private gl: WebGLRenderingContext;
    private sharedUniforms: object;
    private programInfo: ProgramInfo;


    constructor(canvas: HTMLCanvasElement) {
        this.gl = canvas.getContext('webgl');
        if (!this.gl) {
            throw Error('WebGL not supported');
        }
    }


    public setUniform(value: any, name: string): Renderer {
        this.sharedUniforms[name] = value;
        return this;
    }


    public createProgram(vertexShader: string, fragmentShader: string): Renderer {
        this.programInfo = twgl.createProgramInfo(this.gl, [vertexShader, fragmentShader]);
        return this;
    }


    public render(scene: Scene, camera: Camera): Renderer {
        this.prepareGl();
        this.renderCameraView(scene, camera);
        return this;
    }


    private prepareGl() {
        this.gl.enable(this.gl.DEPTH_TEST);

        twgl.resizeCanvasToDisplaySize(this.gl.canvas as HTMLCanvasElement);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

        this.gl.clearColor(0, 0, 0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.gl.useProgram(this.programInfo.program);
    }


    private renderCameraView(scene: Scene, camera: Camera) {
        scene.iterateObjects((object) => {
            twgl.setUniforms(this.programInfo, {
                u_worldViewProjection: camera.getWorldViewProjectionMatrix(object.modelMatrix),
                ...this.sharedUniforms,
                ...object.getUniforms()
            });

            const bufferInfo = twgl.createBufferInfoFromArrays(this.gl, object.getAttributes());
            twgl.setBuffersAndAttributes(this.gl, this.programInfo, bufferInfo);
            twgl.drawBufferInfo(this.gl, bufferInfo, this.gl.POINTS);
        });
    }
}