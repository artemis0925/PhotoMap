import { AntDesign } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Keyboard } from "react-native";
import { TextInput } from "react-native";
import {
  Image,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import uuid from "react-native-uuid";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../redux/auth/selectors";
import { format, parse } from "date-fns";
import { uk } from "date-fns/locale";
import {
  getCommentsFromFirestore,
  writeCommentToFirestore,
} from "../../redux/posts/operations";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../../config";
import { selectComments } from "../../redux/posts/selectors";
import { FlatList } from "react-native";
import { StyleSheet } from "react-native";
import CommentItem from "../../components/CommentItem/CommentItem";
import ListEmptyComponent from "../../components/ListEmptyComponent/ListEmptyComponent";

const CommentsScreen = ({ route }) => {
  const [commentText, setCommentText] = useState("");
  const [isShowKeyboard, setShowKeyboard] = useState(false);
  const [sortedCommentsByDate, setSortedCommentsByDate] = useState([]);

  const { postId, photoUrl } = route.params;
  const { nickname } = useSelector(selectUser);
  const comments = useSelector(selectComments);
  const dispatch = useDispatch();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setShowKeyboard(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setShowKeyboard(false);
      }
    );

    const unsubscribe = onSnapshot(
      collection(db, `posts/${postId}/comments`),
      () => {
        dispatch(getCommentsFromFirestore({ postId }));
      }
    );

    return () => {
      unsubscribe();
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    sortedComments(comments);
  }, [comments]);

  const leaveComment = () => {
    const commentLeaveDate = format(
      new Date(Date.now()),
      "dd MMMM, yyyy | HH:mm",
      {
        locale: uk,
      }
    );

    if (commentText.length < 6) {
      return alert("There must be at least 6 characters!");
    }

    dispatch(
      writeCommentToFirestore({
        postId,
        commentData: {
          commentText,
          commentLeaveDate,
          nickname,
          userId: auth.currentUser.uid,
          avatarPhoto: auth.currentUser.photoURL,
        },
      })
    );

    setCommentText("");
    Keyboard.dismiss();
  };

  const sortedComments = (array) => {
    // if (comments === []) {
    //   return;
    // }
    if (comments && comments.length === 0) {
      return;
    }
    const parsedDate = (date) => {
      return parse(date, "dd MMMM, yyyy | HH:mm", new Date(), {
        locale: uk,
      });
    };

    const newArray = [...array];

    newArray.sort((a, b) => {
      const aDate = parsedDate(a.data.commentLeaveDate);
      const bDate = parsedDate(b.data.commentLeaveDate);
      return aDate - bDate;
    });
    setSortedCommentsByDate(newArray);
  };

  const keyboardHide = () => {
    Keyboard.dismiss();
    setShowKeyboard(false);
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View
          style={{
            ...styles.screenContainer,
            marginBottom: isShowKeyboard ? 85 : 0,
          }}
        >
          <FlatList
            style={styles.commentList}
            ListHeaderComponent={
              <View style={styles.photoContainer}>
                <Image style={styles.photo} source={{ uri: photoUrl }} />
              </View>
            }
            ListEmptyComponent={
              <ListEmptyComponent text="There are no comments yet, be the first to comment!" />
            }
            data={sortedCommentsByDate || []}
            keyExtractor={() => uuid.v4()}
            renderItem={(obj) => <CommentItem obj={obj} />}
          />
          <View style={styles.addCommentContainer}>
            <TextInput
              onFocus={() => {
                setShowKeyboard(true);
              }}
              placeholder="Comment..."
              value={commentText}
              onChangeText={setCommentText}
              style={styles.inputComment}
            />
            <TouchableOpacity
              onPress={leaveComment}
              activeOpacity={0.7}
              style={styles.addCommentBtn}
            >
              <AntDesign name="arrowup" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "rgba(33, 33, 33, 0.8)",
  },
  commentList: { paddingHorizontal: 16 },
  photoContainer: {
    marginTop: 32,
    marginBottom: 32,
  },
  photo: {
    width: "100%",
    height: 240,
    borderRadius: 8,
  },
  addCommentContainer: { marginHorizontal: 16, marginBottom: 16 },
  inputComment: {
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    backgroundColor: "#F6F6F6",
    marginTop: 16,
    fontSize: 16,
    paddingLeft: 16,
    paddingRight: 46,
  },
  addCommentBtn: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    backgroundColor: "rgba(255, 108, 0, 1)",
    marginTop: 32,
  },
});

export default CommentsScreen;
