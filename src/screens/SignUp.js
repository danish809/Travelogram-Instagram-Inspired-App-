import React, {useState} from 'react';
import {StyleSheet, ScrollView, TouchableOpacity, View} from 'react-native';
import {
  Container,
  Form,
  Item,
  Input,
  Text,
  Button,
  Thumbnail,
  Content,
} from 'native-base';

// to upload image
import storage from '@react-native-firebase/storage';
import ProgressBar from 'react-native-progress/Bar';

// to pick image
import ImagePicker from 'react-native-image-picker';
import {options} from '../utils/options';

// redux
import propTypes from 'prop-types';
import {signUp} from '../action/auth';
import {connect} from 'react-redux';

const SignUp = ({signUp}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [instaUserName, setInstaUserName] = useState('');
  const [country, setCountry] = useState('');
  const [bio, setBio] = useState('');

  // setting default image if no image provided
  const [image, setImage] = useState(
    'https://firebasestorage.googleapis.com/v0/b/kirana-f08b6.appspot.com/o/img.png?alt=media&token=1857e7db-06df-4e77-9756-60aa018e1460',
  );
  // to hold image uploading state
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

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
        console.log(response);

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

  const doSignUp = async () => {
    signUp({name, instaUserName, bio, email, password, country, image});
  };

  return (
    <Container style={styles.container}>
      <Content padder>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={chooseImage}>
              <Thumbnail large source={{uri: image}} />
            </TouchableOpacity>
          </View>

          {imageUploading && (
            <ProgressBar progress={uploadStatus} style={styles.progress} />
          )}

          <Form>
            <Item regular style={styles.formItem}>
              <Input
                placeholder="name"
                value={name}
                style={{color: '#eee'}}
                onChangeText={(text) => setName(text)}
              />
            </Item>
            <Item regular style={styles.formItem}>
              <Input
                placeholder="email"
                value={email}
                style={{color: '#eee'}}
                onChangeText={(text) => setEmail(text)}
              />
            </Item>
            <Item regular style={styles.formItem}>
              <Input
                placeholder="password"
                value={password}
                secureTextEntry={true}
                style={{color: '#eee'}}
                onChangeText={(text) => setPassword(text)}
              />
            </Item>
            <Item regular style={styles.formItem}>
              <Input
                placeholder="Instagram user name"
                value={instaUserName}
                style={{color: '#eee'}}
                onChangeText={(text) => setInstaUserName(text)}
              />
            </Item>
            <Item regular style={styles.formItem}>
              <Input
                placeholder="Your Short Bio"
                value={bio}
                style={{color: '#eee'}}
                onChangeText={(text) => setBio(text)}
              />
            </Item>
            <Item regular style={styles.formItem}>
              <Input
                placeholder="country"
                value={country}
                style={{color: '#eee'}}
                onChangeText={(text) => setCountry(text)}
              />
            </Item>
            <Button regular block onPress={doSignUp}>
              <Text>SignUp</Text>
            </Button>
          </Form>
        </ScrollView>
      </Content>
    </Container>
  );
};


const mapDispatchToProps = {
  signUp: (data) => signUp(data),
};

SignUp.propTypes = {
  signUp: propTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(SignUp);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1b262c',
    flex: 1,
    justifyContent: 'flex-start',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 5,
  },
  progress: {width: null, marginBottom: 20},
  formItem: {
    marginBottom: 20,
  },
});
