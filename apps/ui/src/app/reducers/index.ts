import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';

/* eslint-disable */
export interface State {
}
/* eslint-enable */

export const reducers: ActionReducerMap<State> = {
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
