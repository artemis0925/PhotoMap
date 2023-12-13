import { Image, View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Comments from "../../../assets/icons/message-circle.jpg";
import Comments__orange from "../../../assets/icons/message-circle-orange.jpg";
import { Feather, AntDesign } from "@expo/vector-icons";

import { selectUserId } from "../../redux/auth/selectors";
import { selectAllPosts, selectUserPosts } from "../../redux/posts/selectors";
import { toggleLikeInFirebase } from "../../redux/posts/operations";

import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../../config";

const PostItem = ({ obj, navigation, userDetails, isProfileScreen }) => {
  const [lengthAllPosts, setLengthAllPosts] = useState(0);
  const [lengthUserPosts, setLengthUserPosts] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [isLikedPost, setIsLikedPost] = useState(false);

  const userPosts = useSelector(selectUserPosts);
  const allPosts = useSelector(selectAllPosts);
  const currentUserId = useSelector(selectUserId);

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, `posts/${obj.item.id}/comments`),
      () => {
        const fetchLength = async () => {
          const length = await fetchCommentsLength(obj.item.id);
          setCommentsCount(length);
        };

        fetchLength();
      }
    );

    return () => unsubscribe();
  }, []);

  const { item } = obj;
  const { data } = item;

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, `posts/${obj.item.id}/whoLeavedLike`),
      () => {
        if (obj.item.data.whoLeavedLike.includes(currentUserId)) {
          setIsLikedPost(true);
        } else {
          setIsLikedPost(false);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setLengthAllPosts(allPosts.length - 1);
  }, [allPosts]);

  useEffect(() => {
    setLengthUserPosts(userPosts.length - 1);
  }, [userPosts]);

  const fetchCommentsLength = async (postId) => {
    const snapshot = await getDocs(collection(db, `posts/${postId}/comments`));
    let length = 0;
    snapshot.docs.map(() => (length += 1));
    return length;
  };

  const handlePostComments = (postId, photoUrl) => {
    navigation.navigate("CommentsPost", { postId, photoUrl });
  };

  const toogleLike = (postId, userId) => {
    dispatch(toggleLikeInFirebase({ postId, userId }));
  };

  return (
    <View
      style={{
        ...styles.itemContainer,
        paddingBottom:
          (isProfileScreen ? lengthUserPosts : lengthAllPosts) === obj.index
            ? 32
            : 0,
      }}
    >
      {userDetails && (
        <View style={styles.userDetailsContainer}>
          <Image style={styles.avatarImg} source={{ uri: data.avatarUser }} />
          <View style={{ marginLeft: 8 }}>
            <Text style={{ fontSize: 13 }}>{data.userName}</Text>
            <Text style={{ fontSize: 11, color: "rgba(33, 33, 33, 0.8)" }}>
              {data.email}
            </Text>
          </View>
        </View>
      )}
      <Image src={data.photoUrl} style={styles.photoImg} />
      <Text style={styles.nameOfPost}>{data.postName}</Text>
      <View style={styles.commentsAndLocationContainer}>
        <TouchableOpacity
          style={{ flexDirection: "row" }}
          onPress={() => {
            handlePostComments(item.id, data.photoUrl);
          }}
        >
          {isProfileScreen ? (
            <Image style={styles.commentIcon} source={Comments__orange} />
          ) : (
            <Image style={styles.commentIcon} source={Comments} />
          )}
          <Text
            style={{
              ...styles.textComment,
              color: isProfileScreen ? "#212121" : "rgba(189, 189, 189, 1)",
            }}
          >
            {commentsCount}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.likesContainer}
          onPress={() => toogleLike(item.id, currentUserId)}
        >
          {isLikedPost ? (
            <AntDesign name="like1" size={24} color="#FF6C00" />
          ) : (
            <AntDesign name="like2" size={24} color="#FF6C00" />
          )}
          <Text
            style={{
              ...styles.likesCount,
              color: isProfileScreen ? "#212121" : "rgba(189, 189, 189, 1)",
            }}
          >
            {data.whoLeavedLike.length}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: "row", marginLeft: "auto" }}
          activeOpacity={0.7}
          onPress={() => {
            if(data.location.coords === undefined) {
              Alert.alert('Info', 'No location data', [{ text: 'OK' }]);
            } else {
              navigation.navigate("MapPost", {
                locationParams: data.location.coords,
              });
            }
          }}
        >
          <Feather
            name="map-pin"
            size={24}
            color={isProfileScreen ? "#FF6C00" : "rgba(189, 189, 189, 1)"}
            style={{}}
          />
          <Text style={styles.textLocation}>{data.postLocation}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    paddingTop: 32,
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
  },
  userDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  photoImg: {
    width: "100%",
    height: 240,
    borderRadius: 8,
  },
  commentsAndLocationContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 8,
  },
  nameOfPost: { fontSize: 16, marginTop: 8 },
  commentIcon: { width: 24, height: 24 },
  textComment: {
    fontSize: 16,
    marginLeft: 6,
  },
  textLocation: {
    fontSize: 16,
    marginLeft: 4,
    textDecorationLine: "underline",
  },
  avatarImg: { width: 60, height: 60, borderRadius: 16 },
  likesContainer: { marginLeft: 27, flexDirection: "row" },
  likesCount: { fontSize: 16, paddingLeft: 6 },
});

export default PostItem;
