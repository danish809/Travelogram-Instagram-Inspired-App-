import auth from '@react-native-firebase/auth';
import Snackbar from 'react-native-snackbar';
import database from '@react-native-firebase/database';

// instead of dispatching we are showing error using snackbar
export const signUp = (data) => async (dispatch) => {
  console.log(data);
  const {name, instaUserName, bio, email, password, country, image} = data;
  auth()
    .createUserWithEmailAndPassword(email, password)
    .then((data) => {
      console.log(data);
      console.log('User account created & signed in!');
      database()
        .ref('/users/' + data.user.uid)
        .set({
          name,
          instaUserName,
          country,
          image,
          bio,
          uid: data.user.uid,
        })
        .then(() => console.log('Data set.'));
      Snackbar.show({
        text: 'account created',
        textColor: 'white',
        backgroundColor: '#1b262c',
      });
    })
    .catch((error) => {
      console.error(error);
      Snackbar.show({
        text: 'something went wrong',
        textColor: 'white',
        backgroundColor: 'red',
      });
    });
};

export const signIn = (data) => async (dispatch) => {
  console.log(data);
  const {email, password} = data;
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      console.log('User account created & signed in!');
      Snackbar.show({
        text: 'account created',
        textColor: 'white',
        backgroundColor: '#1b262c',
      });
    })
    .catch((error) => {
      console.error(error);
      Snackbar.show({
        text: 'something went wrong',
        textColor: 'white',
        backgroundColor: 'red',
      });
    });
};

export const signOut = () => async (dispatch) => {
  auth()
    .signOut()
    .then(() => {
      Snackbar.show({
        text: 'please visit us again',
        textColor: 'white',
        backgroundColor: '#1b262c',
      });
    })
    .catch((error) => {
      console.error(error);
      Snackbar.show({
        text: 'something went wrong',
        textColor: 'white',
        backgroundColor: 'red',
      });
    });
};
