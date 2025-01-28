# sb.js

A library for reading and writing to .sb (Scratch 1.x) project files

> [!NOTE]
> The [original version](https://github.com/trumank/sb.js) of sb.js was made by trumank.

# Installation
```
npm install @ming736/sb.js
```
# Examples
## Loading a project
### Current
```js
const sb = require("@ming736/sb.js")
const fs = require("node:fs")

let project = sb.loadProjectFromBuffer(fs.readFileSync("./examples/exampleProject.sb"))

console.log(project)
```
### Compatibility
```js
const { sb } = require("@ming736/sb.js")
const fs = require("node:fs")

let project = new sb.Project(fs.readFileSync("./examples/exampleProject.sb"))

project.open(function(success) {
    if (success) {
        console.log(project)
    } else {
        console.warn("Failed to load project :(")
    }
})
```