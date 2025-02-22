import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export type Post = {
    id?: string;
    communityId: string;
    communityImageURL?: string;
    creatorDisplayName: string; // change to authorDisplayText
    creatorId: string;
    title: string;
    body: string;
    numberOfComments: number;
    voteStatus: number;
    currentUserVoteStatus?: {
      id: string;
      voteValue: number;
    };
    imageURL?: string;
    postIdx?: number;
    createdAt: Timestamp;
    editedAt?: Timestamp;
  };

  export type PostVote = {
    id?: string;
    postId: string;
    communityId: string;
    voteValue: number;
  };
  
  interface PostState {
    selectedPost: Post | null;
    posts: Post[];
    postVotes: PostVote[];
    // postsCache: {
    //   [key: string]: Post[];
    // };
    // postUpdateRequired: boolean;
  }

  export const defaultPostState: PostState = {
    selectedPost: null,
    posts: [],
    postVotes: [],
    // postsCache: {},
    // postUpdateRequired: true,
  };

  export const postState = atom <PostState>({
    key: "postState",
    default: defaultPostState,
  });