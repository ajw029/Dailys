import * as types from '../constants/ActionTypes';
import { get, post } from '../tools/httpModule';

import * as firebase from 'firebase';

export const addPackage = (pkg) => {
  const newPostKey = firebase.database().ref().child('todos').push().key;
  const uid = firebase.auth().currentUser.uid;

  let updates = {};
  updates['/user-packages/' + uid + '/' + newPostKey] = pkg;
  firebase.database().ref().update(updates);
  return { type: types.ADD_PACKAGE, pkg }
}

const deletePackageDispatcher = (pkgId) => {
  return { type: types.DELETE_PACKAGE, pkgId: pkgId }
}

export const deletePackage = (pkgId) => dispatch=> {
  dispatch(deletePackageDispatcher(pkgId));
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      firebase.database().ref('/user-packages/' + user.uid + '/').once('value').then(function(snapshot) {
        var data = snapshot.val();
        data[pkgId].deleted=true;

        let updates = {};
        updates['/user-packages/' + user.uid + '/'] = data;
        firebase.database().ref().update(updates);
      });
    }
  });
}

const savePackage = (pkg) => {
  return { type: types.SAVE_PACKAGE, pkg }
}

const requestPackages = () => ({
  type: types.REQUEST_PACKAGES,
});

export const receivePackages = (json) =>  {
  return {
    type: types.RECEIVE_PACKAGES,
    packages: json,
    receivedAt: Date.now()
  };
}

const fetchPackages = () => dispatch => {
  dispatch(requestPackages(location));
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      firebase.database().ref('/user-packages/' + user.uid + '/').once('value')
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
        dispatch(savePackage(myPackages));
      })
      .then(json => dispatch(receivePackages(json)))
      .catch (err => {
        console.log('err:', err)
      })
    }
  });

}

const shouldFetchPackages = (state) => {
  const packageReducer = state.packageReducer;

  if (!packageReducer.packages) {
    return true;
  }
  if (packageReducer.isFetching) {
    return false
  }
  return packageReducer.didInvalidate
}

export const fetchPackagesIfNeeded = () => (dispatch, getState) => {
  const shouldFetch= shouldFetchPackages(getState());
  if (shouldFetch) {
    return dispatch(fetchPackages())
  }
}
