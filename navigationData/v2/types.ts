export type Location = {
    id: string
    title: string
    short: string
    available: boolean
    address: string
    crossings?: string
}

export type Corpus = {
    id: string
    title: string
    available: boolean
    stairs?: string
    locationId: string
}

export type Plan = {
    id: string
    floor: string
    available: boolean
    wayToSvg: string
    graph: string
    entrances: string
    corpusId: string
    nearest: {
        enter: string
        ww?: string
        wm?: string
        ws?: string
    }
}

export type Room = {
    planId: string
	id: string
	type: string
	available: boolean
	numberOrTitle: string
	tabletText: string
	addInfo: string
}

export type ExportData = {
    locations: Array<Location>
    corpuses: Array<Corpus>
    plans: Array<Plan>
    rooms: Array<Room>
}
