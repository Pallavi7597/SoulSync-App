import { deleteObject, ref } from "firebase/storage";
import { Post, postState, PostVote } from "../atoms/postAtom";
import React, { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { auth, firestore, storage } from "@/firebase/clientApp";
import { doc, deleteDoc, writeBatch, collection, query, where, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { communityState } from "@/atoms/communitiesAtom";
import { authModalState } from "@/atoms/authModalAtom";
import { useRouter } from "next/router";

const usePosts = () => {
  const [user] = useAuthState(auth);
  const [postStateValue, setPostStateValue] = useRecoilState(postState);
  const router = useRouter();
  const [communityStateValue] = useRecoilState(communityState);
  const currentCommunity = communityStateValue.currentCommunity;
  const setAuthModalState = useSetRecoilState(authModalState);


  const onVote = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    vote: number,
    communityId: string
  ) => {
    event.stopPropagation();
    if (!user?.uid) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    try {
      const { voteStatus } = post;
      const existingVote = postStateValue.postVotes.find(
        (vote) => vote.postId === post.id
      );

      let voteChange = vote;
      const batch = writeBatch(firestore);
      const updatedPost = { ...post };
      const updatedPosts = [...postStateValue.posts];
      let updatedPostVotes = [...postStateValue.postVotes];

      // new post
      if (!existingVote) {
        // add/subtract 1 to/from post.votestatus
        // create a new postvote doc
        const postVoteRef = doc(
          collection(firestore, "users", `${user?.uid}/postVotes`)
        );

        const newVote: PostVote = {
          id: postVoteRef.id,
          postId: post.id!,
          communityId,
          voteValue: vote, // 1 or -1
        };

        console.log("NEW VOTE!!!", newVote);
        batch.set(postVoteRef, newVote);

        updatedPost.voteStatus = voteStatus + vote;
        updatedPostVotes = [...updatedPostVotes, newVote];
      } else {
        // have voted on the post before

        const postVoteRef = doc(
          firestore,
          "users",
          `${user?.uid}/postVotes/${existingVote.id}`
        );

        if (existingVote.voteValue === vote) {
          // add/subtract 1 to/from vote.status
          updatedPost.voteStatus = voteStatus - vote;
          updatedPostVotes = updatedPostVotes.filter(
            (vote) => vote.id !== existingVote.id
          );
          // delete the postvote doc
          batch.delete(postVoteRef);
          voteChange *= -1;
        }
        // flipping vote up to down or down to up
        else {
          // add/subtract 2 to/from post.votestatus
          // update the existing postvote doc
          updatedPost.voteStatus = voteStatus + 2 * vote;
          const voteIdx = postStateValue.postVotes.findIndex(
            (vote) => vote.id === existingVote.id
          );

          // Vote was found - findIndex returns -1 if not found
            updatedPostVotes[voteIdx] = {
              ...existingVote,
              voteValue: vote,
            };
          
          batch.update(postVoteRef, {
            voteValue: vote,
          });
          voteChange = 2 * vote;
        }
      }

      // update the UI
      const postIdx = postStateValue.posts.findIndex(
        (item) => item.id === post.id
      );
      updatedPosts[postIdx] = updatedPost;
      setPostStateValue((prev) => ({
        ...prev,
        posts: updatedPosts,
        postVotes: updatedPostVotes,
      }));

      if (postStateValue.selectedPost) {
        setPostStateValue((prev)=> ({
          ...prev,
          selectedPost: updatedPost,
        }));
      }

      // Update database
      const postRef = doc(firestore, 'posts', post.id!);
      batch.update(postRef, { voteStatus: voteStatus + voteChange });
      await batch.commit();

    } catch (error: any) {
      console.log("onVote error", error.message);
    }
  };
  
  const onSelectPost = (post: Post) => {
    console.log("HERE IS STUFF", post);

    setPostStateValue((prev) => ({
      ...prev,
      selectedPost: post,
    }));
    router.push(`/r/${post.communityId}/comments/${post.id}`);
  };

  const onDeletePost = async (post: Post): Promise<boolean> => {
    console.log("DELETING POST: ", post.id);
    console.log("Post object:", post);
    if (!post.id) {
      console.log("Invalid post ID, skipping delete.");
      return false;
    }
  
    try {
      // Check if the post has an image URL before attempting to delete the image
      if (post.imageURL) {
        const imageRef = ref(storage, `posts/${post.id}/image`);
  
        try {
          // Attempt to delete the image
          await deleteObject(imageRef);
          console.log("Image deleted successfully.");
        } catch (error: any) {
          // If the image does not exist, log the error but don't fail the deletion
          if (error.code === "storage/object-not-found") {
            console.log("Image not found, skipping deletion.");
          } else {
            throw error; // Re-throw any other errors
          }
        }
      }
  
      // Ensure post.id exists before trying to delete the Firestore document
      if (post.id) {
        const postDocRef = doc(firestore, "posts", post.id); // Ensure the correct reference
        await deleteDoc(postDocRef);
        console.log("Post deleted successfully.");
      }
  
      // Update the post state
      setPostStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter((item) => item.id !== post.id),
      }));
  
      return true;
    } catch (error: any) {
      console.log("THERE WAS AN ERROR", error.message);
      return false;
    }
  };
  

  const getCommunityPostVotes = async (communityId: string) => {
    const postVotesQuery = query(
      collection(firestore, "users", `${user?.uid}/postVotes`),
      where("communityId", "==", communityId)
    );
    const postVoteDocs = await getDocs(postVotesQuery);
    const postVotes = postVoteDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPostStateValue((prev) => ({
      ...prev,
      postVotes: postVotes as PostVote[],
    }));
  };

  useEffect(()=> {
    if(!user || !currentCommunity?.id) return;
    getCommunityPostVotes(currentCommunity?.id);
  }, [user,currentCommunity]);

  useEffect(() => {
    // Logout or no authenticated user
    if (!user) {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }));
      return;
    }
  }, [user]);

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  };
};
export default usePosts;
