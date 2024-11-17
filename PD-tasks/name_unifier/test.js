import { json } from "../auditories/data_fetching.js";
import { auditories } from "../auditories/methods.js";
import {writeFileSync} from "fs";

const data = JSON.parse(json);

writeFileSync("auditories.json", JSON.stringify(auditories(data)));
