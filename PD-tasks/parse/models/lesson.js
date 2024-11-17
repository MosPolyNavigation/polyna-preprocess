/**
 * Хранит информацию о занятии
 * @field {Array{string}} groupNames - названия учебных групп/направлений пд
 * @field {string} groupType - тип группы (Study/pd)
 * @field {string} discipline - название дисциплины
 * @field {Array{string}} teachers - преподаватели
*/
export class Lesson {
    groupNames = [];
    groupType = "";
    discipline = "";
    teachers = [];

    /**
     * @field {Lesson} lesson - урок для слияния
     */
    merge(lesson) {
        if (lesson.groupType == this.groupType &&
            lesson.discipline == this.discipline &&
            this.groupNames.lastIndexOf(lesson.groupNames[0]) == -1
        ) this.groupNames.push(lesson.groupNames[0]);
    }
}