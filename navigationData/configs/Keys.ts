const Keys = {
	// Общие:
	id: 'ID',
	title: 'Название',
	short: 'Сокращение',
	available: 'Готов',

	locations: {
		address: 'Адрес',
		metro: 'Метро',
		crossings: 'Переходы'
	},
	corpuses: {
		location: 'Локация',
		stairs: 'Группы лестниц'
	},
	plans: {
		corpus: 'Корпус',
		floor: 'Этаж',
		wayToSvg: 'Путь к SVG',
		entrances: 'Входы',
		graph: 'Граф',
		nearest: {
			enter: "Ближайший Вход",
			ww: "Ближайший женский туалет",
			wm: "Ближайший мужской туалет",
			ws: "Ближайший общий туалет"
		}
	},
	rooms: {
		type: 'Тип',
		plan: 'План',
		numberOrTitle: "Номер\\Название",
		tabletText: "Надпись с таблички",
		addInfo: "Дополнительная информация",
	}
};

export {Keys};
