import { parse } from "./parse/main.js"
import {json} from "./auditories/data_fetching.js";
import {auditories} from "./auditories/methods.js";
import {writeFileSync} from "fs";

const data = JSON.parse(json);
const auds = auditories(data);

let result = parse(data, auds);

writeFileSync("dist/schedule.json", JSON.stringify(result));
writeFileSync("dist/auditories.json", JSON.stringify(auds));
