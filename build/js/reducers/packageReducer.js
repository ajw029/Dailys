import * as types from '../constants/ActionTypes';

const createInitialState = () => {

  return {
    isFetching: false,
    didInvalidate: false,
    packages: null
  };
}

const initialState = createInitialState();

export default function Packages (state = initialState, action) {
  switch (action.type) {
    case types.GET_PACKAGES:
      return {
        ...state
      };
    case types.DELETE_PACKAGE: 
      let newPackagesArray = [];
      for (let i = 0; i < state.packages.length; i++) {
        if (state.packages[i].id !== action.pkgId)
          newPackagesArray.push(state.packages[i])
      }
      return {
        ...state,
        packages: newPackagesArray
      };
    case types.ADD_PACKAGE:
      return {
        ...state,
        packages: state.packages.concat([action.pkg])
      };
    case types.SAVE_PACKAGE:
      return {
        ...state,
        packages: action.pkg
      };
    case types.EDIT_PACKAGE:
      return {
        ...state,
      };
    default:
      return state;
  }
};
