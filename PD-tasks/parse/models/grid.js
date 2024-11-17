import { StudyDay } from "./day.js";

/**
 * @class Grid - Хранит расписание занятий по дням
 * @field {Day} monday - первая пара
 * @field {Day} tuesday - вторая пара
 * @field {Day} wednesday - третья пара
 * @field {Day} thursday - четвертая пара
 * @field {Day} friday - пятая пара
 * @field {Day} saturday - шестая пара
 */
export class Grid {
    monday = new StudyDay;
    tuesday = new StudyDay;
    wednesday = new StudyDay;
    thursday = new StudyDay;
    friday = new StudyDay;
    saturday = new StudyDay;
}