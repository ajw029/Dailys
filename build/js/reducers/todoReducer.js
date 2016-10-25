import * as types from '../constants/ActionTypes';

const createInitialState = () => {

  return {
    isFetching: false,
    didInvalidate: false,
    todos: null
  };
}

const initialState = createInitialState();

export default function Todos (state = initialState, action) {

  let newPackagesArray = [];
  switch (action.type) {
    case types.GET_TODOS:
      return {
        ...state
      };
    case types.CHECK_TODO:
      newPackagesArray = [];
      for (let i = 0; i < state.todos.length; i++) {
        if (state.todos[i].id === action.todoID)
          state.todos[i].isComplete = action.val

        console.log(state.todos[i])
        newPackagesArray.push(state.todos[i])
      }
      return {
        ...state,
        todos: newPackagesArray
      };
    case types.DELETE_TODO:
      newPackagesArray = [];
      for (let i = 0; i < state.todos.length; i++) {
        if (state.todos[i].id !== action.todoID)
          newPackagesArray.push(state.todos[i])
      }
      return {
        ...state,
        packages: newPackagesArray
      };
    case types.ADD_TODO:
      return {
        ...state,
        todos: state.todos.concat([action.pkg])
      };
    case types.SAVE_TODOS:
      return {
        ...state,
        todos: action.todos
      };
    case types.EDIT_TODO:
      return {
        ...state,
      };
    default:
      return state;
  }
};
