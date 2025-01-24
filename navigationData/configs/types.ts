import {toBoolean} from "../functions/commons.ts";

export type Location = {
	id: string
	title: string
	short: string
	available: boolean
	address: string
	corpuses?: Corpus[]
	crossings?: string
}

export type Corpus = {
	id: string
	// locationID: string
	title: string
	available: boolean
	plans?: Plan[]
	stairs?: string
}

export type Plan = {
	rooms?: Room[];
	id: string
	// corpusID: string
	floor: string
	available: boolean
	wayToSvg: string
	graph: string
	entrances: string
}

export type Room = {
	id: string
	type: string
	available: boolean
	numberOrTitle: string
	tabletText: string
	addInfo: string
}