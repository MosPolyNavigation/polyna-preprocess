import {GoogleSpreadsheet} from 'google-spreadsheet';
import {Keys} from '../configs/Keys.ts';
import config from '../configs/config.json';
import {getCorpusByID, getPlanID, getSheetRows, minifyJSON, toBoolean} from '../functions/commons.js';
import {Location, Plan, Room} from '../configs/types.js';

export async function makeRooms(spreadsheet: GoogleSpreadsheet, locations: Location[]): Promise<void> {
	await (getSheetRows(spreadsheet, config.sheetsIDs.rooms)
		.then(rows => {
			rows.forEach(row => {
			const plan = getPlanID(row.get('План'), locations);
			if(plan && plan.available) {
				const room: Room = {
					id: row.get('ID'),
					type: row.get('Тип'),
					available: toBoolean(row.get('Готов')),
					numberOrTitle: row.get('Номер\\Название'),
					tabletText: row.get('Надпись с таблички'),
					addInfo: row.get('Дополнительная информация')
				}
				plan.rooms.push(room)
			}
			});
			console.log('Помещения (аудитории) заполнены\n');
		}));
}

