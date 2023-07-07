/**
 * @type: reducer
 * name: __appName__
 */

import {combineReducers, createEntityReducer, createUIReducer} from '@metafox/framework';
import {APP_NAME} from '../constants';

export default combineReducers({
  entities: createEntityReducer(APP_NAME),
});
