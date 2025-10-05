// PD-tasks/export.js
import { parse } from "./parse/main.js";
// import {json} from "./auditories/data_fetching.js";
import { auditories } from "./auditories/methods.js";
import { writeFileSync } from "fs";
import { getFullScheduleObject } from "./shedule_extractor.js";

// let data = JSON.parse(json);
const data = await getFullScheduleObject();
const auds = auditories(data);

const result = parse(data, auds);

writeFileSync("dist/schedule.json", JSON.stringify(result));
writeFileSync("dist/auditories.json", JSON.stringify(auds));