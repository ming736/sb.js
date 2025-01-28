const fs = require("fs")

fs.copyFileSync("./src/index.js", "./dist/index.js")
fs.copyFileSync("./src/sb.js", "./dist/sb.js")