import BaseSprite from "./BaseSprite";
import Image from "./Image"
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
    stageObject: Record<any, any>;
    backdrops: ImageList;
    constructor(stageObject: Record<any, any>) {
        if (typeof stageObject !== "object") {
            throw new Error("Invalid stage object")
        }
        super(125, stageObject);
        this.stageObject = stageObject;
        this.id = 125;
        this.name = this.stageObject.objName;
        this.backdrops = this.stageObject.costumes.map(v => new Image(v));
        this.backdrops.currentIndex = this.stageObject.currentCostumeIndex
    }
}