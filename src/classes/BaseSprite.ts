import BaseMorph from "./BaseMorph";
import type { Variable, Costume, Sound } from "./Legacy.js";
export default class BaseSprite<morphId extends number> extends BaseMorph<morphId> {
    /**
     * The id of this sprite.
     */
    id: morphId;
    /**
     * The name of this sprite.
     */
    name: string;
    variables: Array<Variable>
    constructor(id: morphId, obj?: Record<any, any>) {
        super(id, obj ?? {});
        if (obj) {
            this.variables = obj.variables;
        }
    }
}