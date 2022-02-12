import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: {
	conversationsOrChat: boolean;
	currentChatId: number;
	currentChatItemId: number;
	partiesAgreed: number[];
	currentChatOtherUser: {
		id: number;
		avatarUrl: string;
		username: string;
	};
	messages: any;
	ratingValue: number;
} = {
	conversationsOrChat: true,
	currentChatId: 0,
	currentChatItemId: 0,
	partiesAgreed: [],
	currentChatOtherUser: {
		id: 0,
		avatarUrl: '',
		username: '',
	},
	messages: [],
	ratingValue: 0,
};

const preferencesSlice = createSlice({
	name: 'userPreferences',
	initialState,
	reducers: {
		setPreferences(
			state,
			{
				payload,
			}: PayloadAction<{
				conversationsOrChat: boolean;
				currentChatId: number;
				currentChatItemId: number;
				partiesAgreed: number[];
				currentChatOtherUser: {
					id: number;
					avatarUrl: string;
					username: string;
				};
				messages: any;
				ratingValue: number;
			}>
		) {
			state = payload;
			return state;
		},
		resetPreferences(state) {
			state = {
				conversationsOrChat: true,
				currentChatId: 0,
				currentChatItemId: 0,
				partiesAgreed: [],
				currentChatOtherUser: {
					id: 0,
					avatarUrl: '',
					username: '',
				},
				messages: [],
				ratingValue: 0,
			};
			return state;
		},
	},
});

export const { setPreferences, resetPreferences } = preferencesSlice.actions;
export default preferencesSlice.reducer;
