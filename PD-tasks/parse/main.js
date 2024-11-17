import { parseGroups } from "./helpers/parseGroups.js";
import { setSchedule, getSchedule, setAuditories } from "./state.js";

/**
 * @function parse - Парсит содержимое расписания и предоставляет занятия по аудиториям
 * @param {Object} contents - содержимое поля contents расписания
 * @param {Object} auditories - список сопоставлений аудиторий и унифицированных имен
 * @returns Object
 */
export const parse = (contents, auditories) => {
    setSchedule({});
    setAuditories(auditories);
    parseGroups(contents);
    return {...getSchedule()};
}
// Пример вызова функции
// import { json } from "../auditories/data_fetching.js";
// import { auditories } from "../auditories/methods.js";
// const content = JSON.parse(json)
// const auds = auditories(content)
// parse(content, auds)
