import {glMatrix} from 'gl-matrix/gl-matrix';
import * as mat4 from 'gl-matrix/mat4';
import * as vec3 from 'gl-matrix/cjs/vec3';
import {Point} from './Point';
import {SceneObject} from './SceneObject';

export class PointCloud extends SceneObject {
    public static inputs: PointCloudInputs = {
        Scale: 1,
        RotationX: 0,
        RotationY: 0,
        RotationZ: 0
    };


    constructor(name: string) {
        super(new Point(0, 0, 0), name);
    }


    public scale(scale: number): PointCloud {
        mat4.scale(this.modelMatrix, this.modelMatrix, vec3.fromValues(scale, scale, scale));
        return this;
    }


    public rotate(rotX: number, rotY: number, rotZ: number): PointCloud {
        mat4.rotateX(this.modelMatrix, this.modelMatrix, glMatrix.toRadian(rotX));
        mat4.rotateY(this.modelMatrix, this.modelMatrix, glMatrix.toRadian(rotY));
        mat4.rotateZ(this.modelMatrix, this.modelMatrix, glMatrix.toRadian(rotZ));

        return this;
    }


    public center(): PointCloud {
        this.setPosition(this.centerOffset);
        mat4.translate(this.modelMatrix, this.modelMatrix, this.positionVec);

        return this;
    }


    private get centerOffset() {
        const extents = this.getExtents();
        const range = vec3.create(),
            objOffset = vec3.create();

        vec3.subtract(range, extents.max, extents.min);
        vec3.scale(range, range, 0.5);
        vec3.add(range, range, extents.min);
        vec3.scale(objOffset, range, -1);

        return objOffset;
    }


    private getExtents() {
        const positions = this.getAttribute('position');
        const min = positions.slice(0, 3);
        const max = positions.slice(0, 3);

        for (let positionsIndex = 3; positionsIndex < positions.length; positionsIndex += 3) {
            for (let positionVertexIterator = 0; positionVertexIterator < 3; positionVertexIterator++) {
                const vertex = positions[positionsIndex + positionVertexIterator];

                min[positionVertexIterator] = Math.min(vertex, min[positionVertexIterator]);
                max[positionVertexIterator] = Math.max(vertex, max[positionVertexIterator]);
            }
        }

        return {min, max};
    }
}


export interface PointCloudInputs {
    Scale: number;
    RotationX: number;
    RotationY: number;
    RotationZ: number;
}