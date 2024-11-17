import { Lesson } from "../models/lesson.js"
import { is_valid } from "../../name_unifier/main.js";

const today = new Date();

/**
 * @function parseLesson - Обработка уроков
 * @param {Object} lesson - Объект урока из расписания, хранит 1 и более вариантов по датам
 * @param {String} group - учебная группа
 * @returns [Lesson, Array{String}]|[null, []]
 */
export const parseLesson = (lesson, group) => {
    // Фильтруем все варианты пары на то, что сейчас они доступны
    let valid_variant = Object.values(lesson).filter(v => {
        let df = new Date(v.df);
        let dt = new Date(v.dt);
        return df <= today && dt >= today && is_valid(v.location);
    })[0];  // Получаем первый удачный вариант (либо никакой)
    // После фильтра обычно не остается вообще вариантов,
    // либо иногда всплывает единственный.
    // Два и более после фильтрации не возникает
    if (valid_variant === undefined) return [null, []];
    return parseVariant(valid_variant, group);
}

/**
 * @function parseVariant - Преобразует структуру из расписания в наш стандарт
 * @param {Object} variant - вариант пары
 * @param {String} group - учебная группа
 * @returns [Lesson, Array{String}]
 */
const parseVariant = (variant, group) => {
    let result = new Lesson;
    result.discipline = variant.sbj;
    result.groupNames = [group];
    result.groupType = "study";
    // Преподаватели указаны через ,
    result.teachers = variant.teacher.split(', ');
    // Получаем все номера аудиторий
    let rooms = [...Object.values(variant.shortRooms)];
    return [result, rooms];
}
