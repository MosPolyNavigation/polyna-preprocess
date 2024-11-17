import {json} from "./data_fetching.js";
import {auditories} from "./methods.js";

const contents = JSON.parse(json);

const spaces = auditories(contents);

console.log(spaces);
