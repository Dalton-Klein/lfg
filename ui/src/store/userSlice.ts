import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from './store';
import { User, SignIn } from './interfaces';
import { resetPassword, signInUser, verifyUser } from '../utils/rest';

const initialState: any = {
	user: {
		token: '',
		id: 0,
		email: '',
		avatarUrl: '/assets/avatarIcon.png',
		username: 'none',
		numOfStrikes: 0,
		groupList: [],
		createdAt: undefined,
		updatedAt: undefined,
		error: false,
	},
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser(state, { payload }: PayloadAction<User>) {
			state.user = payload;
		},
		updateUserUrl(state, { payload }: PayloadAction<string | undefined>) {
			state.user.avatarUrl = payload;
		},
		setUserError(state, action: PayloadAction<string>) {
			return state;
		},
	},
});

export const { setUser, setUserError, updateUserUrl } = userSlice.actions;
export default userSlice.reducer;

// THUNK / EPIC

// THUNK1: Creating User
export const createUserInState = (
	email: string,
	vKey: string,
	name: string,
	password: string
): AppThunk => async (dispatch) => {
	try {
		let response: any;
		response = await verifyUser(email, vKey, name, password);
		if (!response.error) {
			dispatch(setUser(response.data));
		}
		return response;
	} catch (err: any) {
		dispatch(setUserError(err.toString()));
	}
};

// THUNK2: Sign In User
export const fetchUser = (signin: SignIn): AppThunk => async (dispatch) => {
	try {
		let response: any;
		response = await signInUser({
			email: signin.email,
			password: signin.password,
		});
		if (!response.error) {
			dispatch(setUser(response.data));
			console.log('what is state? ', userSlice);
		}
		return response;
	} catch (err: any) {
		dispatch(setUserError(err.toString()));
	}
};

// THUNK3: Logout User
export const logoutUser = (userId: number): AppThunk => async (dispatch) => {
	try {
		if (userId !== 0) {
			dispatch(
				setUser({
					token: '',
					id: 0,
					email: '',
					username: '',
					trainerID: 0,
					trainerName: '',
					mtgoID: 0,
					mtgoName: '',
					buyerRating: [],
					sellerRating: [],
					numOfStrikes: 0,
					transactionSales: [],
					transactionPurchases: [],
					transactionTrades: [],
					watchList: [],
					avatarUrl: '',
					error: false,
				})
			);
		}
		return { success: 'true' };
	} catch (err: any) {
		dispatch(setUserError(err.toString()));
	}
};

// THUNK4: Resetting Password For User
export const resetPasswordInState = (
	email: string,
	vKey: string,
	password: string
): AppThunk => async (dispatch) => {
	try {
		let response: any;
		response = await resetPassword(email, vKey, password);
		if (!response.error) {
			console.log('reset pass!!!, ', response.data);
			dispatch(setUser(response.data));
		}
		return response;
	} catch (err: any) {
		dispatch(setUserError(err.toString()));
	}
};
