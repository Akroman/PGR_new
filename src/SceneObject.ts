import * as vec3 from 'gl-matrix/cjs/vec3';
import * as mat4 from 'gl-matrix/cjs/mat4';
import {Point} from './Point';
import {Arrays} from 'twgl.js';

export abstract class SceneObject {
    public modelMatrix: mat4 = mat4.create();
    public name: string;
    protected position: Point
    protected uniforms: object = {};
    protected attributes: Arrays = {};


    protected constructor(position: Point, name: string) {
        this.name = name;
        this.position = position;
    }


    public get positionVec(): vec3 {
        return this.position.position;
    }


    public setPosition(position: vec3 | Point) {
        if (position instanceof Point) {
            this.position = position;
        } else {
            this.position.position = position;
        }
    }


    public createMatrix(): SceneObject {
        this.modelMatrix = mat4.create();
        return this;
    }


    public setUniform(value: any, name: string): SceneObject {
        this.uniforms[name] = value;
        return this;
    }


    public getUniforms(): object {
        return this.uniforms;
    }


    public setAttribute(value: any, name: string): SceneObject {
        this.attributes[name] = value;
        return this;
    }


    public getAttribute(name: string): any {
        return this.attributes[name];
    }


    public getAttributes(): Arrays {
        return this.attributes;
    }
}