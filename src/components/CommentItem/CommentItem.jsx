import { Text, View, Image, StyleSheet } from "react-native";
import { auth } from "../../../config";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectComments } from "../../redux/posts/selectors";

const CommentItem = ({ obj }) => {
  const [lengthComments, setLengthComments] = useState(0);

  const comments = useSelector(selectComments);

  useEffect(() => {
    setLengthComments(comments.length - 1);
  }, [comments]);

  const { item } = obj;
  const { data } = item;

  const isUserComment = auth.currentUser.uid === data.userId;

  return (
    <View
      style={{
        ...styles.commentContainer,
        flexDirection: isUserComment ? "row-reverse" : "row",
        marginBottom: lengthComments === obj.index ? 24 : 0,
      }}
    >
      <Image
        style={[
          { ...styles.userImg },
          isUserComment ? { marginLeft: 16 } : { marginRight: 16 },
        ]}
        source={{ uri: data.avatarPhoto }}
      />

      <View
        style={{
          ...styles.commentTextContainer,
          backgroundColor: isUserComment ? "#C3ECFF" : "rgba(0, 0, 0, 0.03)",
        }}
      >
        <Text style={styles.commentText}>{data.commentText}</Text>
      </View>
      <Text style={styles.commentLeaveDate}>{data.commentLeaveDate}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    width: "100%",
    marginTop: 24,
    display: "flex",
  },
  userImg: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  commentTextContainer: {
    width: "88%",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 35,
    flexWrap: "wrap",
    borderRadius: 10,
  },
  commentText: { width: "100%" },
  commentLeaveDate: {
    position: "absolute",
    fontSize: 10,
    color: "rgba(189, 189, 189, 1)",
    right: 16,
    bottom: 16,
  },
});

export default CommentItem;


