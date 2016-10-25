import * as types from '../constants/ActionTypes';
import { get, post } from '../tools/httpModule';

import * as firebase from 'firebase';

export const addTodo = (todo) => {
  const newPostKey = firebase.database().ref().child('todos').push().key;
  const uid = firebase.auth().currentUser.uid;

  let updates = {};
  updates['/user-todos/' + uid + '/' + newPostKey] = todo;
  firebase.database().ref().update(updates);
  return { type: types.ADD_TODO, todo }
}

const deleteTodoDispatcher = (todoID) => {
  return { type: types.DELETE_TODO, todoID: todoID }
}

export const deleteTodo = (todoID) => dispatch=> {
  dispatch(deletePackageDispatcher(todoID));
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      firebase.database().ref('/user-packages/' + user.uid + '/').once('value').then(function(snapshot) {
        var data = snapshot.val();
        data[todoID].deleted=true;

        let updates = {};
        updates['/user-packages/' + user.uid + '/'] = data;
        firebase.database().ref().update(updates);
      });
    }
  });
}

export const checkTodo = (todoID, val) => {
  return { type: types.CHECK_TODO, todoID, val }
}

const saveTodos = (todos) => {
  return { type: types.SAVE_TODOS, todos }
}

const requestTodos = () => ({
  type: types.REQUEST_TODOS,
});

export const receiveTodos = (json) =>  {
  return {
    type: types.RECEIVE_TODOS,
    todos: json,
    receivedAt: Date.now()
  };
}

const fetchTodos = () => dispatch => {
  dispatch(requestTodos());
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      firebase.database().ref('/user-todos/' + user.uid + '/').once('value')
      .then( (snapshot) => {
        const data = snapshot.val();
        let keys = Object.keys(data);

        let myPackages = [];
        for (var i = 0; i < keys.length; i++) {
          if (data[keys[i]].deleted === false) {
            let package_ = data[keys[i]];
            package_.id = keys[i];
            myPackages.push(package_);
          }
        }
        dispatch(saveTodos(myPackages));
      })
      .then(json => dispatch(receiveTodos(json)))
      .catch (err => {
        console.log('err:', err)
      });

    }
  });

}

const shouldFetchTodos = (state) => {
  const todoReducer = state.todoReducer;
  if (!todoReducer.todos) {
    return true;
  }
  if (todoReducer.isFetching) {
    return false
  }
  return todoReducer.didInvalidate
}

export const fetchTodosIfNeeded = () => (dispatch, getState) => {
  const shouldFetch= shouldFetchTodos(getState());
  if (shouldFetch) {
    return dispatch(fetchTodos())
  }
}
