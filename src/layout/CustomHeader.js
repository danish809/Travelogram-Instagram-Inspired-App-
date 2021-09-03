import React from 'react';
import {Header, Body, Right, Button, Icon, Title, Text} from 'native-base';
import {connect} from 'react-redux';
import propTypes from 'prop-types';
import {signOut} from '../action/auth';

// a custom header component which will be rendered in all screen.
// it will have logout and add post button but both will soon only when the user is lognin
const CustomHeader = ({signOut, authState, navigation}) => {
  return (
    <Header
      androidStatusBarColor="#0f4c75"
      style={{
        backgroundColor: '#0f4c75',
      }}>
      <Body>
        <Title>Social App</Title>
      </Body>
      <Right>
        {authState.isAuthenticated && (
          <>
            <Button
              transparent
              iconLeft
              onPress={() => navigation.navigate('AddPost')}>
              <Icon name="add-circle-outline" style={{color: '#fdcb9e'}} />
              <Text style={{color: '#fdcb9e'}}>Add Post</Text>
            </Button>
            <Button transparent onPress={() => signOut()}>
              <Icon name="log-out-outline" style={{color: 'red'}} />
            </Button>
          </>
        )}
      </Right>
    </Header>
  );
};

const mapStateToProps = (state) => ({
  authState: state.auth,
});

const mapDispatchToProps = {
  signOut,
};

CustomHeader.propTypes = {
  signOut: propTypes.func.isRequired,
  authState: propTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomHeader);
