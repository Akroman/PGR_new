import {PCDLoader} from 'three/examples/jsm/loaders/PCDLoader';
import {PointCloud} from './PointCloud';

export class FileLoader {
    public loadFile(file: File, onLoad: (points: PointCloud) => void) {
        const fileName = file.name.split('.');
        const fileType = fileName[fileName.length - 1].toLowerCase();
        const fileUrl = URL.createObjectURL(file);

        switch (fileType) {
            case PointCloudFileFormats.PCD:
                const loader = new PCDLoader();
                loader.load(fileUrl, points => {
                    const pointCloud = new PointCloud(file.name);

                    pointCloud.setAttribute(points.geometry.attributes.position.array, 'position');
                    if (points.geometry.attributes.color !== undefined) {
                        pointCloud.setAttribute(points.geometry.attributes.color.array, 'color');
                    }

                    onLoad(pointCloud);
                }, event => {

                }, event => {
                    console.error(event);
                    throw new Error(event.message);
                });
                break;
            default:
                throw new InvalidFileFormatError(
                    'Unknown point cloud file format. Supported file formats are: ' +
                    Object.values(PointCloudFileFormats).join(', ')
                );
        }
    }
}


export class InvalidFileFormatError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidFileFormatError';
    }
}


enum PointCloudFileFormats {
    PCD = 'pcd'
}