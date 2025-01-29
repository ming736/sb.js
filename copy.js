import fs from "fs"

fs.copyFileSync("./src/index.ts", "./dist/index.ts")
fs.copyFileSync("./src/sb.ts", "./dist/sb.ts")