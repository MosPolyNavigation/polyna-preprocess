import {GoogleSpreadsheet} from 'google-spreadsheet';
import * as fs from 'fs';
import config from './configs/config.json' assert {type: 'json'};
import {auth} from './functions/auth.ts';
import {makeLocations} from './stages/makeLocations.js';
import {makeCorpuses} from './stages/makeCorpuses.js';
import {makePlans} from './stages/makePlans.js';


const spreadsheet: GoogleSpreadsheet = new GoogleSpreadsheet(config.spreadsheetID, auth); //Создаем документ таблицы по айди и токену
await spreadsheet.loadInfo(); //Загружаем основные данные таблицы

const locations = await makeLocations(spreadsheet)
await makeCorpuses(spreadsheet, locations) //заполнение корпусов в локации, сама
// переменная нужна чтобы потом было удобнее искать корпусы и локации
await makePlans(spreadsheet, locations)


fs.rmSync('dist', { recursive: true, force: true })
fs.mkdirSync('dist', {recursive: true});
fs.writeFileSync('dist/locationsLined.json', JSON.stringify(locations, null, 2)); //Сохраняем
fs.writeFileSync('dist/locations.json', JSON.stringify(locations));

console.log('ФАЙЛ СОХРАНЕН');
setTimeout(() => {
}, 1500)

// await makeCorpuses()


