import { parseGrid } from "./parseGrid.js";

/**
 * @function Разбивает объект расписания по группам и передает обработку в следующие парсеры
 * @param {Object} contents
 */
export const parseGroups = (contents) => {
  // Пробегаемся по всем группам расписания
  Object.entries(contents).forEach(([group, content]) => {
    // Не у всех групп может быть сетка. Пропускаем такие.
    if (!content || typeof content.grid === "undefined") return;
    // Нам интересна только сетка расписания -> передаём её дальше
    parseGrid(content.grid, group);
  });
};
