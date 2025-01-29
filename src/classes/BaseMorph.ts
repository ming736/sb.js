export default class BaseMorph<morphId extends number> {
    /**
     * The id of this morph.
     */
    id: morphId;
    /**
     * The name of this morph.
     */
    name: string;
    constructor(id: morphId, obj: Record<any, any>) {
        this.id = id
        if (obj) {
            if (obj.objName) {
                this.name = obj.objName
            }
        }
    }
}