import { parseLesson } from "./parseLesson.js";
import { Auditory } from "../models/aud.js";
import { is_valid } from "../../name_unifier/main.js"
import { updateSchedule, getAuditories } from "../state.js";

// Нужно для более лаконичного доступа к полям моделей
const dayNumToName = {
    "1": "monday",
    "2": "tuesday",
    "3": "wednesday",
    "4": "thursday",
    "5": "friday",
    "6": "saturday",
};

/**
 * @function parseDay - Парсит запись дня из расписания и вносит в состояние
 * @param {String} dayNum
 * @param {Object} day
 * @param {String} group
 */
export const parseDay = (dayNum, day, group) => {
    // Перебираем все пары за день (они записаны в формате 'номер': {Объект вариантов})
    Object.entries(day)
        .filter(([_, lesson]) => Object.values(lesson).some(v => is_valid(v.location)))
        .forEach(([lessonNum, lesson]) => {
            // Получаем спаршенную модель пары и аудитории для нее
            let [lessonCont, auds] = parseLesson(lesson, group);
            if (auds.length == 0) return;
            // Перебираем все аудитории
            auds
                .filter(v => v.toLowerCase() in getAuditories()) // Отфильтровываем те, которых нет в объекте аудиторий
                .forEach(aud => updateSchedule(state => {
                    aud = getAuditories()[aud.toLowerCase()];
                    // Если в состоянии еще нет такой аудитории, то создаем новый объект и пишем его в состояние
                    if (!(aud in state)/* !(state.has(aud)) */) {
                        state[aud] = new Auditory;
                        state[aud].id = aud;
                    }
                    // Записываем для дня dayNum информацию о паре lessonNum
                    if (state[aud].rasp[dayNumToName[dayNum]][lessonNum] === undefined) {
                        state[aud].rasp[dayNumToName[dayNum]][lessonNum] = lessonCont;
                        // Дополняем массив lessons информацией о номере пары
                        state[aud].rasp[dayNumToName[dayNum]].lessons.push(lessonNum);
                    } else {
                        state[aud].rasp[dayNumToName[dayNum]][lessonNum].merge(lessonCont);
                    }
                }));
    });
}