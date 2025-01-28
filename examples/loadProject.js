const sb = require("../src/index.js")
const fs = require("node:fs")

let project = sb.loadProjectFromBuffer(fs.readFileSync("./exampleProject.sb"))

console.log(project.stage.children[0].scripts[0])