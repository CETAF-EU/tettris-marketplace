/* Import Dependencies */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'app/Store';

/* Import Types */
import { TaxonomicService } from 'app/Types';


export interface TaxonomicServiceState {
    taxonomicService?: TaxonomicService,
    taxonomicServices: TaxonomicService[]
};

const initialState: TaxonomicServiceState = {
    taxonomicService: undefined,
    taxonomicServices: []
};

export const TaxonomicServiceSlice = createSlice({
    name: 'taxonomicService',
    initialState,
    reducers: {
        setTaxonomicService: (state, action: PayloadAction<TaxonomicService>) => {
            state.taxonomicService = action.payload;
        },
        setTaxonomicServices: (state, action: PayloadAction<TaxonomicService[]>) => {
            state.taxonomicServices = action.payload;
        },
        concatToTaxonomicServices: (state, action: PayloadAction<TaxonomicService[]>) => {
            state.taxonomicServices = state.taxonomicServices.concat(action.payload);
            state.taxonomicServices.sort((a, b) => a < b ? 1 : 0);
        }
    }
})

/* Action Creators */
export const {
    setTaxonomicService,
    setTaxonomicServices,
    concatToTaxonomicServices
} = TaxonomicServiceSlice.actions;

/* Connect with Root State */
export const getTaxonomicService = (state: RootState) => state.taxonomicService.taxonomicService;
export const getTaxonomicServices = (state: RootState) => state.taxonomicService.taxonomicServices;

export default TaxonomicServiceSlice.reducer;