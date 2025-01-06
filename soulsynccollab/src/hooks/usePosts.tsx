import { deleteObject, ref } from 'firebase/storage';
import { Post, postState } from '../atoms/postAtom';
import React from 'react';
import { useRecoilState } from 'recoil';
import { firestore, storage } from '@/firebase/clientApp';
import { doc, deleteDoc } from 'firebase/firestore';

const usePosts = () => {
    const [postStateValue, setPostStateValue] = useRecoilState(postState);
    const onVote = async () => {};
    const onSelectPost = () => {};
    const onDeletePost = async (post: Post): Promise<boolean> => {
        console.log("DELETING POST: ", post.id);
        try {
          // if post has an image url, delete it from storage
          if (post.imageURL) {
            const imageRef = ref(storage, `posts/${post.id}/image`);
            await deleteObject(imageRef);
          }
    
          // delete post from posts collection
          const postDocRef = doc(firestore, "posts", post.id!);
          await deleteDoc(postDocRef);
    
          // Update post state
          setPostStateValue((prev) => ({
            ...prev,
            posts: prev.posts.filter((item) => item.id !== post.id),
            // postsCache: {
            //   ...prev.postsCache,
            //   [post.communityId]: prev.postsCache[post.communityId]?.filter(
            //     (item) => item.id !== post.id
            //   ),
            // },
          }));
    
          /**
           * Cloud Function will trigger on post delete
           * to delete all comments with postId === post.id
           */
          return true;
        } catch (error: any) {
          console.log("THERE WAS AN ERROR", error.message);
          return false;
        }
    };


    return {
        postStateValue,
        setPostStateValue,
        onVote,
        onSelectPost,
        onDeletePost,
    };
}
export default usePosts;