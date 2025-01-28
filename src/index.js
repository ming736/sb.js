const { sb } = require("./sb.js")
const fs = require("node:fs")
const { /** @description The current version of sb.js. */ version } = require("../package.json")

/**
 * @description Loads a project from the specified buffer.
 * @param {Buffer} buffer
 */
function loadProjectFromBuffer(buffer) {
    let proj = new sb.Project(buffer)
    proj.open()
    return proj
}
/**
 * @description Loads a project from the specified path.
 * @param {Buffer} buffer 
 */
function loadProjectFromPath(path) {
    let proj = new sb.Project(fs.readFileSync(path))
    proj.open()
    return proj
}

var exportTable = {
    loadProjectFromBuffer,
    loadProjectFromPath,
    version,
    sb
}

module.exports = {
    ...exportTable,
    default: exportTable
}