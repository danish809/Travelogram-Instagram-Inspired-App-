import React, {useEffect, useState} from 'react';
import {StyleSheet, ScrollView, Image} from 'react-native';
import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Text,
  Button,
  H3,
  Textarea,
  Icon,
} from 'native-base';
import Snackbar from 'react-native-snackbar';
import ProgressBar from 'react-native-progress/Bar';

// for firebase database
import database from '@react-native-firebase/database';

// to upload image
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-picker';
import {options} from '../utils/options';

// redux
import {connect} from 'react-redux';
import propTypes from 'prop-types';

import shortid from 'shortid';

const AddPost = ({userState, navigation}) => {
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  // to hold the image link
  const [image, setImage] = useState(null);

  const [uploadStatus, setUploadStatus] = useState(null);
  // to hold image uploading state
  const [imageUploading, setImageUploading] = useState(false);

  // to pick image from the storage
  const chooseImage = async () => {
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        //  calling upload function to upload the selected image
        // sending the whole image response as parameter
        uploadImage(response);
      }
    });
  };

  // to upload the image to the firebase storage
  const uploadImage = async (response) => {
    setImageUploading(true);
    // creating refrence
    const reference = storage().ref(response.fileName);

    // path to existing file on filesystem
    const task = reference.putFile(response.path);

    // to get the status of image upload
    task.on('state_changed', (taskSnapshot) => {
      const percentage =
        (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 1000;

      // setting progress in state
      setUploadStatus(percentage);
    });

    task.then(async () => {
      const url = await reference.getDownloadURL();

      // setting the download image url in the state
      setImage(url);
      setImageUploading(false);
    });
  };

  // to add post in firebase database
  const addPost = async () => {
    try {
      // if not all field prvided then showing error
      if (!location || !description || !image) {
        return Snackbar.show({
          text: 'Please add all fields',
          textColor: 'white',
          backgroundColor: 'red',
        });
      }

      // genearating unique id
      const uid = shortid.generate();
      await database().ref(`/posts/${uid}`).set({
        location,
        description,
        picture: image,
        by: userState.name,
        id: uid,
        date: Date.now(),
        instaId: userState.instaUserName,
        userImage: userState.image,
      });

      // after adding post, navigating to the HOME screen
      console.log('Post Added');
      navigation.navigate('Home');
    } catch (error) {
      // showing error when somethig went wrong
      console.error(error);
      Snackbar.show({
        text: 'Something went wrong',
        textColor: 'white',
        backgroundColor: 'red',
      });
    }
  };
  return (
    <Container style={styles.container}>
      <Content padder>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          {image && (
            <Image
              source={{uri: image}}
              style={styles.image}
              resizeMode="center"
            />
          )}
          <Form>
            <Item regular style={styles.formItem}>
              <Input
                placeholder="location"
                value={location}
                style={{color: '#eee'}}
                onChangeText={(text) => setLocation(text)}
              />
            </Item>

            {imageUploading ? (
              <ProgressBar progress={uploadStatus} style={styles.progress} />
            ) : (
              <Button
                regular
                bordered
                block
                iconLeft
                info
                style={styles.formItem}
                onPress={chooseImage}>
                <Icon
                  name="md-image-outline"
                  type="Ionicons"
                  style={styles.icon}
                />
                <Text
                  style={{
                    color: '#fdcb9e',
                  }}>
                  Choose Image
                </Text>
              </Button>
            )}

            <Item regular style={styles.formItem}>
              <Textarea
                rowSpan={5}
                placeholder="Some description..."
                value={description}
                style={{color: '#eee'}}
                onChangeText={(text) => setDescription(text)}
              />
            </Item>

            <Button regular block onPress={addPost}>
              <Text>Add Post</Text>
            </Button>
          </Form>
        </ScrollView>
      </Content>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  userState: state.auth.user,
});

AddPost.propTypes = {
  userState: propTypes.object.isRequired,
};

export default connect(mapStateToProps)(AddPost);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1b262c',
    flex: 1,
    justifyContent: 'flex-start',
  },
  formItem: {
    marginBottom: 20,
  },
  icon: {fontSize: 20, color: '#fdcb9e'},
  image: {width: null, height: 150, marginVertical: 15},
  progress: {width: null, marginBottom: 20},
});
