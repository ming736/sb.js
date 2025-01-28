const { sb } = require("./sb.js")
const fs = require("node:fs")
const { version } = require("../package.json")

function loadProjectFromBuffer(buffer) {
    let proj = new sb.Project(buffer)
    proj.open()
    return proj
}

function loadProjectFromPath(path) {
    let proj = new sb.Project(fs.readFileSync(path))
    proj.open()
    return proj
}

var exportTable = {
    /**
     * Loads a project from the specified {@link Buffer|`buffer`}.
     * @param {Buffer} buffer The buffer containing a project.
     */
    loadProjectFromBuffer,
    /**
     * Loads a project from the specified path.
     * @param {string} path A path to a Scratch Project.
     */
    loadProjectFromPath,
    /** 
     * The current version of sb.js. 
     */ 
    version,
    sb
}

module.exports = {
    ...exportTable,
    /**
     * ESM compatibility.
     */
    default: exportTable
}