import { Canvas } from "canvas";

/**
 * Interface representing a variable in the project.
 */
export interface Variable {
    /** The name of this variable. */
    name: string;

    /** The value of this variable. */
    value: any;

    /** Whether or not the variable is persistent. */
    isPersistent: boolean;
}

/**
 * Interface representing a costume in the project.
 */
export interface Costume {
    /** The name of this costume. */
    costumeName: string;

    /** The rotation center X of this costume. */
    rotationCenterX: number;

    /** The rotation center Y of this costume. */
    rotationCenterY: number;

    /** The image of this costume. */
    image: Canvas;
}

/**
 * Interface representing a sound in the project (not fully implemented).
 */
export interface Sound {
    /** The name of this sound. */
    soundName: string;

    /** The sound data (not implemented). */
    sound: null;
}