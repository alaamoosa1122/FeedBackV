import usersReducer from "./userReducer";
import { createStore } from "redux";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  users: usersReducer,
  // other reducers...
});

const store = createStore(rootReducer);

export default store;