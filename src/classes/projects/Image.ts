import BaseMorph from "./BaseMorph";
import type { Costume } from "./Legacy";
import { Canvas } from "canvas";

export default class Image extends BaseMorph<162> {
    /**
     * The id of this image.
     */
    id: 162;
    /**
     * The name of this image.
     */
    name: string;
    rotationCenterX: number;
    rotationCenterY: number;
    private canvas: Canvas;
    constructor(imageObject: Record<any, any>) {
        if (typeof imageObject !== "object") {
            throw new Error("Invalid stage object")
        }
        super(162, imageObject);
        //this.imageObject = imageObject;
        this.id = 162;
        this.name = imageObject.costumeName;
        this.rotationCenterX = imageObject.rotationCenterX;
        this.rotationCenterY = imageObject.rotationCenterY;
        this.canvas = (imageObject.image as Canvas);
    }
    /**
     * Converts this image into a buffer.
     */
    toBuffer(): Buffer {
        return this.canvas.toBuffer()
    }
    /**
     * Converts this image into a {@link Canvas} object.
     */
    toCanvas(): Canvas {
        return this.canvas
    }
    /**
     * Converts this image into a data URL.
     */
    toDataURL(): string {
        return this.canvas.toDataURL()
    }
    /**
     * @alias toDataURL
     */
    toDataURI(): string {
        return this.canvas.toDataURL()
    }
}