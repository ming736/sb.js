import { Project, sb } from "./sb"
import fs from "fs"
import API from "./classes/api/API"

/** 
 * The current version of sb.js.
 */
export const version: string = (JSON.parse(fs.readFileSync("./package.json", "utf-8"))).version
/**
 * Loads a project from the specified {@link Buffer|`buffer`}.
 * @param {Buffer} buffer The buffer containing a project.
 */
export function loadProjectFromBuffer(buffer: Buffer): Project<false> {
    let proj = new sb.Project<false>(buffer, false)
    return proj
}
/**
* Loads a project from the specified path.
* @param {string} path A path to a Scratch Project.
*/
export function loadProjectFromPath(path: string): Project<false> {
    const data = fs.readFileSync(path);
    const proj = new sb.Project<false>(data, false);
    return proj;
}


export {
    /**
     * @deprecated This is only for backwards compatibility.
     */
    sb,
    Project,
    API
}

export default {
    /**
     * Loads a project from the specified {@link Buffer|`buffer`}.
     * @param {Buffer} buffer The buffer containing a project.
     * @returns {Project}
     */
    loadProjectFromBuffer,
    /**
     * Loads a project from the specified path.
     * @param {string} path A path to a Scratch Project.
     * @returns {Project}
     */
    loadProjectFromPath,
    /** 
     * The current version of sb.js. 
     */
    version,
    /**
     * @deprecated This is only for backwards compatibility.
     */
    sb,
    Project,
    API
}