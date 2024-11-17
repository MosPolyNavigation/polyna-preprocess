import {JWT} from 'google-auth-library';

export const auth: JWT = new JWT({
	email: process.env.CLIENT_EMAIL,
	key: process.env.PRIVATE_KEY,
	scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
})
