import React, {useState, useEffect} from 'react';
import {Image, Linking} from 'react-native';
import {
  Card,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Right,
} from 'native-base';
import database from '@react-native-firebase/database';

const Post = ({item, userDetails}) => {
  const [upvote, setUpvote] = useState(0);
  const [downvote, setDownvote] = useState(0);

  // counting the total upvote and downvote when the component mount and also when the item changes
  useEffect(() => {
    console.log(item);
    if (item.vote) {
      let upVote = 0;
      let downVote = 0;

      Object.values(item.vote).map((val) => {
        console.log({val});
        if (val.upvote) {
          upVote += 1;
        }
        if (val.downvote) {
          downVote += 1;
        }
      });
      setUpvote(upVote);
      setDownvote(downVote);
    }
  }, [item]);

  // to upvote the post
  const upVotePost = () => {
    // upvoting the post by 1 same logic as angular app
    database()
      .ref(`/posts/${item.id}/vote/${userDetails.uid}`)
      .set({
        upvote: 1,
      })
      .then(() => console.log('Upvoted'));
  };

  // to downvote the post
  const downVotePost = () => {
        // downvoting the post by 1 same logic as angular app
    database()
      .ref(`/posts/${item.id}/vote/${userDetails.uid}`)
      .set({
        downvote: 1,
      })
      .then(() => console.log('DownVoted'));
  };

  return (
    <Card
      style={{
        backgroundColor: '#0f4c75',
        borderColor: '#0f4c75',
      }}>
      <CardItem
        style={{
          backgroundColor: 'transparent',
        }}>
        <Left>
          <Thumbnail source={{uri: item.userImage}} small />
          <Body>
            <Text
              style={{
                color: '#fdcb9e',
              }}>
              {item.by}
            </Text>

            <Text note>{item.location}</Text>
          </Body>
        </Left>
      </CardItem>
      <CardItem cardBody>
        <Image
          source={{uri: item.picture}}
          style={{height: 200, width: null, flex: 1}}
        />
      </CardItem>
      <CardItem
        cardBody
        style={{
          backgroundColor: 'transparent',
        }}>
        <Text
          numberOfLines={2}
          style={{
            color: '#fff',
          }}>
          {item.description}
        </Text>
      </CardItem>

      <CardItem
        style={{
          backgroundColor: '#0f4c75',
        }}>
        <Left>
          <Button transparent onPress={upVotePost}>
            <Icon
              name="thumbs-up"
              type="Entypo"
              style={{fontSize: 20, color: '#fdcb9e'}}
            />
            <Text
              style={{
                color: '#fdcb9e',
              }}>
              {upvote}
            </Text>
          </Button>
          <Button transparent onPress={downVotePost}>
            <Icon
              name="thumbs-down"
              type="Entypo"
              style={{fontSize: 20, color: '#fdcb9e'}}
            />
            <Text
              style={{
                color: '#fdcb9e',
              }}>
              {downvote}
            </Text>
          </Button>
        </Left>
        <Right>
          <Button
            transparent
            iconLeft
            onPress={() => {
              Linking.openURL(`instagram://user?username=${item.instaId}`);
            }}>
            <Text
              style={{
                color: '#fdcb9e',
              }}>
              Open in
            </Text>
            <Icon
              name="instagram"
              type="Feather"
              style={{fontSize: 20, color: '#fdcb9e'}}
            />
          </Button>
        </Right>
      </CardItem>
    </Card>
  );
};

export default Post;
