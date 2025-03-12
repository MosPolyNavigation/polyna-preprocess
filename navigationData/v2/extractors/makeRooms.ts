import {GoogleSpreadsheet} from 'google-spreadsheet';
import {Keys} from '../../configs/Keys.ts';
import config from '../../configs/config.json';
import {getSheetRows, toBoolean} from '../../functions/commons.js';
import {filterRow} from './filter.ts';
import {Room} from '../types.js';

export async function makeRooms(spreadsheet: GoogleSpreadsheet): Promise<Room[]> {
    const rows = await getSheetRows(spreadsheet, config.sheetsIDs.rooms);
    const rooms = rows.filter(filterRow).map(row => {
        const room: Room = {
            id: row.get(Keys.id),
            type: row.get(Keys.rooms.type),
            available: toBoolean(row.get(Keys.available)),
            numberOrTitle: row.get(Keys.rooms.numberOrTitle),
            tabletText: row.get(Keys.rooms.tabletText),
            addInfo: row.get(Keys.rooms.addInfo),
            planId: row.get(Keys.rooms.plan),
        };
        return room;
    });
    console.log('Помещения (аудитории) заполнены\n');
    return rooms;
}
