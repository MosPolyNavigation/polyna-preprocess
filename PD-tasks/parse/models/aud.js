import { Grid } from "./grid.js";

/**
 * @class Auditory - класс, хранящий расписание занятий в аудитории
 * @field {string} id - номер аудитории
 * @field {Grid} rasp - сетка расписания
 */
export class Auditory {
    id = "";
    rasp = new Grid;
}