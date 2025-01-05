import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export interface Community {
    id: string;
    creatorId: string;
    numberOfMembers: number;
    privacyType: "public" | "restrictied" | "private";
    createdAt?: Timestamp;
    imageURL?: string;
  }

interface CommunitySnippet {
    communityId: string;
    isModerator?: boolean;
    ImageURL?: string;
}

interface CommunityState {
    mySnippets: CommunitySnippet[];

}

const defaultCommunityState: CommunityState = {
    mySnippets: []
}

export const communityState = atom<CommunityState>({
    key: "communitiesState",
    default: defaultCommunityState,
  });