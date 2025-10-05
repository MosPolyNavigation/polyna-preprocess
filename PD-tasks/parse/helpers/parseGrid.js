import { parseDay } from "./parseDay.js";

/**
 * @function parseGrid - Извлекает объекты дней недели из объекта сетки расписания и передает в следующие обработчики
 * @param {Object} grid
 * @param {String} group
 */
export const parseGrid = (grid, group) => {
  if (!grid || typeof grid !== "object") return;
  Object.entries(grid).forEach(([dayNum, day]) => {
    parseDay(dayNum, day, group);
  });
};
