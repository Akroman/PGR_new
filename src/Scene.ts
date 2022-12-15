import {SceneObject} from './SceneObject';

export class Scene {
    private objects: Map<string, SceneObject> = new Map<string, SceneObject>;


    public addObject(object: SceneObject): Scene {
        this.objects.set(object.name, object);
        return this;
    }


    public removeObject(obj: string | SceneObject): Scene {
        this.objects.delete(obj instanceof SceneObject ? obj.name : obj);
        return this;
    }


    public getObject(obj: string | SceneObject): SceneObject | undefined {
        return this.objects.get(obj instanceof SceneObject ? obj.name : obj);
    }


    public clear(): Scene {
        this.objects.clear();
        return this;
    }


    public iterateObjects(fn: (object: SceneObject) => void): Scene {
        this.objects.forEach(fn);
        return this;
    }
}