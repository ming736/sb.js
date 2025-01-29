import { Project, sb } from "./sb"
import fs from "fs"

/** 
 * The current version of sb.js.
 */
export const version: string = (JSON.parse(fs.readFileSync("./package.json", "utf-8"))).version
/**
 * Loads a project from the specified {@link Buffer|`buffer`}.
 * @param {Buffer} buffer The buffer containing a project.
 */
export function loadProjectFromBuffer(buffer: Buffer): Project {
    let proj = new sb.Project(buffer)
    proj.open()
    return proj
}
/**
* Loads a project from the specified path.
* @param {string} path A path to a Scratch Project.
*/
export function loadProjectFromPath(path: string): Project {
    let proj = new sb.Project(fs.readFileSync(path))
    proj.open()
    return proj
}

export {
    /**
     * @deprecated This is only for backwards compatibility.
     */
    sb
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
    sb
}