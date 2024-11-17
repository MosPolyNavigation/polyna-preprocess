import { readFileSync } from "fs"

let parsed = await fetch("https://rasp.dmami.ru/semester.json",
    {
        headers: {
            Authority: "rasp.dmami.ru",
            Referer: "https://rasp.dmami.ru"
        }
    })
    .then(result => result.json())
    .catch(error => {
        console.error(`File fetching failed with error: ${error}. Using fallback source`);
        return JSON.parse(readFileSync("./semester.json").toString());
    });

export const json = JSON.stringify(parsed.contents);
