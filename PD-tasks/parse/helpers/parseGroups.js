import { parseGrid } from "./parseGrid.js";

/**
 * @function Разбивает объект расписания по группам и передает обработку в следующие парсеры
 * @param {Object} contents
 */
export const parseGroups = (contents) => {
    // Пробегаемся по всем группам с расписания
    Object.entries(contents).forEach(([group, content]) => {
        // Нам интересна только сетка расписания, потому извлекаем ее
        // и вызываем парсер сетки
        parseGrid(content.grid, group);
    });
}
