import * as mat4 from 'gl-matrix/mat4';
import * as vec3 from 'gl-matrix/cjs/vec3';
import {glMatrix} from 'gl-matrix/gl-matrix';
import {SceneObject} from './SceneObject';
import {Point} from './Point';

export class Camera extends SceneObject {
    public static defaultPosition: Point = new Point(0, 0, 3);
    public static defaultPitch: number = 0;
    public static defaultYaw: number = -90;
    public pitch: number = Camera.defaultPitch;
    public yaw: number = Camera.defaultYaw;
    public front: vec3 = vec3.fromValues(0, 0, -1);
    public up: vec3 = vec3.fromValues(0, 1, 0);
    private projectionMatrix: mat4 = mat4.create();
    public inputs: CameraInputs = {
        FOV: 60,
        zNear: 0.1,
        zFar: 5000,
        speed: 0.1,
        sensitivity: 0.2
    };


    constructor(position: Point = Camera.defaultPosition) {
        super(position, 'camera');
    }


    public processKeyboardInput(keys: object) {
        const speed = this.inputs.speed;
        const helperVector = vec3.create();
        const cameraFrontScaled = vec3.create();
        const cameraFrontCrossNormScaled = vec3.create();

        vec3.scale(cameraFrontScaled, this.front, speed);
        vec3.cross(cameraFrontCrossNormScaled, this.front, this.up);
        vec3.normalize(cameraFrontCrossNormScaled, cameraFrontCrossNormScaled);
        vec3.scale(cameraFrontCrossNormScaled, cameraFrontCrossNormScaled, speed);

        if (keys['87']) {
            vec3.add(helperVector, this.positionVec, cameraFrontScaled);
            this.setPosition(helperVector);
        }
        if (keys['83']) {
            vec3.subtract(helperVector, this.positionVec, cameraFrontScaled);
            this.setPosition(helperVector);
        }
        if (keys['65']) {
            vec3.subtract(helperVector, this.positionVec, cameraFrontCrossNormScaled);
            this.setPosition(helperVector);
        }
        if (keys['68']) {
            vec3.add(helperVector, this.positionVec, cameraFrontCrossNormScaled);
            this.setPosition(helperVector);
        }

        this.move(this.position);
    }


    public processMouseInput(xOffset: number, yOffset: number) {
        this.yaw += xOffset;
        this.pitch += yOffset;

        if (this.pitch > 89) {
            this.pitch = 89;
        } else if (this.pitch < -89) {
            this.pitch = -89;
        }
    }


    private get viewProjectionMatrix(): mat4 {
        const viewProjectionMatrix = mat4.create();
        mat4.multiply(viewProjectionMatrix, this.projectionMatrix, this.modelMatrix);

        return viewProjectionMatrix;
    }


    public getWorldViewProjectionMatrix(world: mat4): mat4 {
        this.lookAt(this.direction, this.up);

        const worldViewProjectionMatrix = mat4.create();
        mat4.multiply(worldViewProjectionMatrix, this.viewProjectionMatrix, world);

        return worldViewProjectionMatrix;
    }


    public get direction(): vec3 {
        this.front = vec3.fromValues(
            Math.cos(glMatrix.toRadian(this.yaw)) * Math.cos(glMatrix.toRadian(this.pitch)),
            Math.sin(glMatrix.toRadian(this.pitch)),
            Math.sin(glMatrix.toRadian(this.yaw)) * Math.cos(glMatrix.toRadian(this.pitch))
        );
        vec3.normalize(this.front, this.front);

        const direction = vec3.create();
        vec3.add(direction, this.positionVec, this.front);

        return direction;
    }


    public setPerspective(fieldOfView: number, aspect: number, zNear: number, zFar: number): Camera {
        this.projectionMatrix = mat4.create();
        mat4.perspective(this.projectionMatrix, fieldOfView, aspect, zNear, zFar);

        return this;
    }


    public lookAt(target: vec3, up: vec3): Camera {
        mat4.lookAt(this.modelMatrix, this.positionVec, target, up);
        return this;
    }


    public move(position: Point): Camera {
        this.position = position;

        mat4.translate(this.modelMatrix, this.modelMatrix, position);
        mat4.invert(this.modelMatrix, this.modelMatrix);

        return this;
    }
}


export interface CameraInputs {
    FOV: number;
    zNear: number;
    zFar: number;
    speed: number;
    sensitivity: number;
}