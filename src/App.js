import React, {useState, useEffect} from 'react';
import 'react-native-gesture-handler';

import auth from '@react-native-firebase/auth';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {useDispatch, connect} from 'react-redux';

// screens
import AddPost from './screens/AddPost';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import Home from './screens/Home';
import CustomHeader from './layout/CustomHeader';
import {SET_USER, IS_AUTHENTICATED} from './action/action.types';

// firebase db
import database from '@react-native-firebase/database';
import EmptyContainer from './components/EmptyContainer';
import {requestPermission} from './utils/AskPermission';

const Stack = createStackNavigator();

const App = ({authState}) => {
  // using redux dipatch hooks
  const dispatch = useDispatch();

  // Handle user state changes
  // will fire when the firebase auth state change
  const onAuthStateChanged = (user) => {
    // checking the user exists or not
    if (user) {
      // if user exists then disptaching the user and getting the other details of the user and then setting ti in redux state
      dispatch({
        type: IS_AUTHENTICATED,
        payload: true,
      });

      console.log(user._user.uid);

      database()
        .ref(`/users/${user._user.uid}`)
        .on('value', (snapshot) => {
          console.log('User Detais', snapshot.val());
          dispatch({
            type: SET_USER,
            payload: snapshot.val(),
          });
        });
    } else {
      dispatch({
        type: IS_AUTHENTICATED,
        payload: false,
      });
    }
  };

  useEffect(() => {
    // asking the permission if not granted
    requestPermission();
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // if the state is loading then rendering the empty container
  if (authState.loading) return <EmptyContainer />;

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            header: (props) => <CustomHeader {...props} />,
          }}>
          {authState.isAuthenticated ? (
            <>
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="AddPost" component={AddPost} />
            </>
          ) : (
            <>
              <Stack.Screen name="SignIn" component={SignIn} />
              <Stack.Screen name="SignUp" component={SignUp} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const mapStateToProps = (state) => ({
  authState: state.auth,
});

export default connect(mapStateToProps)(App);
