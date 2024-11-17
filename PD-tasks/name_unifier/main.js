import {av, bs, m, pr, pk} from "./helpers.js";

const LOCATION_NAMES = [
    "автозаводская",
    "большая семеновская",
    "михалковская",
    "прянишникова",
    "павла корчагина"
];

const PATTERNS = {
    "автозаводская": av,
    "большая семеновская": bs,
    "михалковская": m,
    "прянишникова": pr,
    "павла корчагина": pk
};

export const is_valid = (location) => LOCATION_NAMES.some(loc => loc == location.trim().toLowerCase());

export const unify = (location, auditorie) => {
    return [auditorie, PATTERNS[location.trim().toLowerCase()](auditorie)]
};

export default {is_valid, unify};
