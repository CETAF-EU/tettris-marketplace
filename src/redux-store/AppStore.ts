import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from 'app/Store';
import type { ApiStatus } from 'api/apiStatus';

export interface AppState {
    apiStatus: ApiStatus;
}

const initialState: AppState = { apiStatus: 'available' };

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setApiStatus: (state, action: PayloadAction<ApiStatus>) => {
            state.apiStatus = action.payload;
        },
    },
});

export const { setApiStatus } = appSlice.actions;
export const getApiStatus = (state: RootState) => state.app.apiStatus;
export default appSlice.reducer;
