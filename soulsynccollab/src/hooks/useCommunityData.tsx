import { Community, communityState } from "@/atoms/communitiesAtom";
import { auth, firestore } from "@/firebase/clientApp";
import { collection, getDoc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";

const useCommunityData = () => {
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user] = useAuthState(auth);

  const onJoinOrLeaveCommunity = (
    communityData: Community,
    isJoined?: boolean
  ) => {
    console.log("ON JOIN LEAVE", communityData.id);

    if (!user) {
      // setAuthModalState({ open: true, view: "login" });
      // return;
    }

    // setLoading(true);
    if (isJoined) {
      leaveCommunity(communityData.id);
      return;
    }
    joinCommunity(communityData);
  };

  const getMySnippets = async () => {
    setLoading(true);
    try {
      const snippetDocs = await getDocs(
        collection(firestore, `user/${user?.uid}/communitySnippets`)
      );

      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));

    } catch (error) {
      console.log("getmySnippets error", error);
    }
  };

  const joinCommunity = (communityData: Community) => {};
  const leaveCommunity = (communityId: string) => {};

  useEffect(() => {
    if (!user) return;
    getMySnippets();
  }, [user]);

  return {
    communityStateValue,
    onJoinOrLeaveCommunity,
  };
};
export default useCommunityData;
