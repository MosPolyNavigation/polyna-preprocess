import {GoogleSpreadsheet} from 'google-spreadsheet';
import * as fs from 'fs';
import config from './configs/config.json' assert {type: 'json'};
import {auth} from './functions/auth.ts';
import {makeLocations} from './stages/makeLocations.js';
import {makeCorpuses} from './stages/makeCorpuses.js';
import {makePlans} from './stages/makePlans.js';
import {makeRooms} from "./stages/makeRooms.ts";
import { makeLocations as makeLocationsV2 } from './v2/extractors/makeLocations.ts';
import { makeCorpuses as makeCorpusesV2 } from './v2/extractors/makeCorpuses.ts';
import { makePlans as makePlansV2 } from './v2/extractors/makePlans.ts';
import { makeRooms as makeRoomsV2 } from './v2/extractors/makeRooms.ts';
import { ExportData } from './v2/types.ts';


const spreadsheet: GoogleSpreadsheet = new GoogleSpreadsheet(config.spreadsheetID, auth); //Создаем документ таблицы по айди и токену
await spreadsheet.loadInfo(); //Загружаем основные данные таблицы

const locations = await makeLocations(spreadsheet)
await makeCorpuses(spreadsheet, locations) //заполнение корпусов в локации, сама
// // переменная нужна чтобы потом было удобнее искать корпусы и локации
await makePlans(spreadsheet, locations)
await makeRooms(spreadsheet, locations)


fs.rmSync('dist', { recursive: true, force: true })
fs.mkdirSync('dist', {recursive: true});
fs.writeFileSync('dist/locationsLined.json', JSON.stringify(locations, null, 2)); //Сохраняем
fs.writeFileSync('dist/locations.json', JSON.stringify(locations));

console.log('ФАЙЛ СОХРАНЕН');

// V2 part

console.log("Генерация данных согласно спецификации V2")

const data: ExportData = {
    locations: await makeLocationsV2(spreadsheet),
    corpuses: await makeCorpusesV2(spreadsheet),
    plans: await makePlansV2(spreadsheet),
    rooms: await makeRoomsV2(spreadsheet),
};

// V2 export

fs.writeFileSync('dist/locationsLinedV2.json', JSON.stringify(data, null, 2)); //Сохраняем
fs.writeFileSync('dist/locationsV2.json', JSON.stringify(data));

console.log('ФАЙЛ СОХРАНЕН');
setTimeout(() => {
}, 1500)

// await makeCorpuses()


