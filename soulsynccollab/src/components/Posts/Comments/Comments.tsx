import { Post, postState } from "@/atoms/postAtom";
import {
  Box,
  Flex,
  Text,
  SkeletonCircle,
  SkeletonText,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import CommentInput from "./CommentInput";
import { authModalState } from "@/atoms/authModalAtom";
import { firestore } from "@/firebase/clientApp";
import {
  writeBatch,
  doc,
  collection,
  serverTimestamp,
  increment,
  Timestamp,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  getDoc,
  deleteField,
} from "firebase/firestore";
import { useSetRecoilState } from "recoil";
import CommentItem, { Comment } from "./CommentItem";
import { Filter } from "bad-words";

type CommentsProps = {
  user: User;
  selectedPost: Post | null;
  communityId: string;
};

const Comments: React.FC<CommentsProps> = ({
  user,
  selectedPost,
  communityId,
}) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const setAuthModalState = useSetRecoilState(authModalState);
  const setPostState = useSetRecoilState(postState);
  const [loadingDeleteId, setLoadingDeleteId] = useState("");
  const toast = useToast();

  const onCreateComment = async (commentText: string) => {
    setCreateLoading(true);

    const filter = new Filter();
    if (filter.isProfane(commentText)) {
      toast({
        title: "Inappropriate Language",
        description:
          "Your comment contains inappropriate language and cannot be posted.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setCreateLoading(false);
      return;
    }

    try {
      const batch = writeBatch(firestore);
      const commentDocRef = doc(collection(firestore, "comments"));

      const newComment: Comment = {
        id: commentDocRef.id,
        creatorId: user.uid,
        creatorDisplayText: user.email!.split("@")[0],
        communityId,
        postId: selectedPost?.id!,
        postTitle: selectedPost?.title!,
        text: commentText,
        createdAt: serverTimestamp() as Timestamp,
        voteStatus: 0, // Default value for voteStatus
        votes: {} // Initialize an empty object for votes
      };
      batch.set(commentDocRef, newComment);

      newComment.createdAt = { seconds: Date.now() / 1000 } as Timestamp;

      const postDocRef = doc(firestore, "posts", selectedPost?.id!);
      batch.update(postDocRef, {
        numberOfComments: increment(1),
      });
      await batch.commit();

      setCommentText("");
      setComments((prev) => [newComment, ...prev]);
      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! + 1,
        } as Post,
      }));
    } catch (error: any) {
      console.log("onCreateComment error", error.message);
    }
    setCreateLoading(false);
  };

  const onDeleteComment = async (comment: Comment) => {
    setLoadingDeleteId(comment.id);
    try {
      const batch = writeBatch(firestore);
      const commentDocRef = doc(firestore, "comments", comment.id);
      batch.delete(commentDocRef);

      const postDocRef = doc(firestore, "posts", selectedPost?.id!);
      batch.update(postDocRef, {
        numberOfComments: increment(-1),
      });

      await batch.commit();

      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! - 1,
        } as Post,
      }));

      setComments((prev) => prev.filter((item) => item.id !== comment.id));
    } catch (error: any) {
      console.log("onDeleteComment error", error.message);
    }
    setLoadingDeleteId("");
  };

  const onEditComment = async (updatedText: string, comment: Comment) => {
    try {
      const commentDocRef = doc(firestore, "comments", comment.id);

      // Update the comment in Firestore
      const updatedAt = serverTimestamp();
      const isEdited = true;
      await updateDoc(commentDocRef, {
        text: updatedText,
        createdAt: updatedAt,
        isEdited: isEdited,
      });

      // Update the comment locally and sort the list
      setComments((prev) => {
        const updatedComments = prev.map((item) =>
          item.id === comment.id
            ? {
                ...item,
                text: updatedText,
                createdAt: { seconds: Date.now() / 1000 } as Timestamp,
                isEdited: true,
              }
            : item
        );
        return updatedComments.sort(
          (a, b) => b.createdAt.seconds - a.createdAt.seconds
        );
      });
    } catch (error: any) {
      console.error("onEditComment error", error.message);
    }
  };

  const onVote = async (commentId: string, voteValue: 1 | -1) => {
    if (!user?.uid) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }
  
    const voteType = voteValue === 1 ? "up" : "down";
    const userRef = doc(firestore, "users", user.uid);
    const commentRef = doc(firestore, "comments", commentId);
    const commentDoc = await getDoc(commentRef);
  
    if (!commentDoc.exists()) return;
  
    const currentVotes = commentDoc.data()?.votes || {};
    const hasVoted = currentVotes[user.uid];
    let newVoteCount = commentDoc.data()?.voteStatus || 0;
  
    // If the user has already voted
    if (hasVoted) {
      if (hasVoted === voteType) {
        // If the user clicks the same vote again, unhighlight and reduce vote count
        newVoteCount -= voteValue;
        await updateDoc(commentRef, {
          [`votes.${user.uid}`]: deleteField(),
          voteStatus: newVoteCount,
        });
      } else {
        // If the user switches votes, adjust the vote count accordingly
        newVoteCount += voteValue * 2; // +2 for upvote after downvote, -2 for downvote after upvote
        await updateDoc(commentRef, {
          [`votes.${user.uid}`]: voteType,
          voteStatus: newVoteCount,
        });
      }
    } else {
      // If the user is voting for the first time
      newVoteCount += voteValue;
      await updateDoc(commentRef, {
        [`votes.${user.uid}`]: voteType,
        voteStatus: newVoteCount,
      });
    }
  
    // Update local state for immediate UI feedback
    setComments((prev) =>
      prev.map((item) =>
        item.id === commentId
          ? {
              ...item,
              votes: {
                ...item.votes,
                [user.uid]: hasVoted === voteType ? null : voteType, // Unhighlight or switch
              },
              voteStatus: newVoteCount,
            }
          : item
      )
    );
  };  
  
  const getPostComments = async () => {
    if (!selectedPost?.id) {
      console.log("No post ID available");
      setFetchLoading(false);
      return;
    }
    try {
      const commentsQuery = query(
        collection(firestore, "comments"),
        where("postId", "==", selectedPost?.id),
        orderBy("createdAt", "desc")
      );
      const commentDocs = await getDocs(commentsQuery);
      const comments = commentDocs.docs.map((doc) => ({
        id: doc.id,
        voteStatus: doc.data()?.voteStatus || 0, // Set a default if not present
        ...doc.data(),
      }));
      setComments(comments as Comment[]);
    } catch (error: any) {
      console.log("getPostComments error", error.message);
    }
    setFetchLoading(false);
  };

  useEffect(() => {
    if (!selectedPost) return;
    getPostComments();
  }, [selectedPost]);

  return (
    <Box bg="white" p={2} borderRadius="0px 0px 4px 4px">
      <Flex
        direction="column"
        pl={10}
        pr={4}
        mb={6}
        fontSize="10pt"
        width="100%"
      >
        {!fetchLoading && (
          <CommentInput
            commentText={commentText}
            setCommentText={setCommentText}
            user={user}
            createloading={createLoading}
            onCreateComment={onCreateComment}
          />
        )}
      </Flex>
      <Stack spacing={6} p={2}>
        {fetchLoading ? (
          <>
            {[0, 1, 2].map((item) => (
              <Box key={item} padding="6" bg="white">
                <SkeletonCircle size="10" />
                <SkeletonText mt="4" noOfLines={2} spacing="4" />
              </Box>
            ))}
          </>
        ) : (
          <>
            {comments.length === 0 ? (
              <Flex
                direction="column"
                justify="center"
                align="center"
                borderTop="1px solid"
                borderColor="gray.100"
                p={20}
              >
                <Text fontWeight={700} opacity={0.3}>
                  No Comments Yet
                </Text>
              </Flex>
            ) : (
              <>
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    onVote={onVote} // <-- Make sure this is here
                    onDeleteComment={onDeleteComment}
                    onEditComment={onEditComment}
                    loadingDelete={loadingDeleteId === comment.id}
                    userId={user?.uid}
                  />
                ))}
              </>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
};
export default Comments;
