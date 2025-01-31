import BaseSprite from "./BaseSprite";
import Image from "./Image"
import Sound from "./Sound"
type ImageList = {
    currentIndex: number;
} & Image[];
export default class Stage extends BaseSprite<125> {
    /**
     * The id of this stage.
     */
    id: 125;
    /**
     * The name of this stage.
     */
    name: "Stage" | "Background";
    backdrops: ImageList;
    constructor(stageObject: Record<any, any>) {
        if (typeof stageObject !== "object") {
            throw new Error("Invalid stage object")
        }
        super(125, stageObject);
        this.id = 125;
        this.name = stageObject.objName;
        this.backdrops = stageObject.costumes.map(v => new Image(v));
        this.backdrops.currentIndex = stageObject.currentCostumeIndex
        this.sounds = stageObject.sounds.map(v => new Sound(v));
    }
}