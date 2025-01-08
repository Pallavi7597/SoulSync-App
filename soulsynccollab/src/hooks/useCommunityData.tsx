import { authModalState } from "@/atoms/authModalAtom";
import { Community, CommunitySnippet, communityState } from "@/atoms/communitiesAtom";
import { auth, firestore } from "@/firebase/clientApp";
import { collection, doc, getDoc, getDocs, increment, writeBatch } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";

const useCommunityData = () => {
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuthModalState = useSetRecoilState(authModalState);
  const [error, setError] = useState("");
  const [user] = useAuthState(auth);

  const onJoinOrLeaveCommunity = (
    communityData: Community,
    isJoined: boolean
  ) => {
    console.log("ON JOIN LEAVE", communityData.id);

    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    setLoading(true);
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
        collection(firestore, `users/${user?.uid}/communitySnippets`)
      );

      const snippets = snippetDocs.docs.map((doc) =>({ ...doc.data() }));
      console.log("here are snippets", snippets);

      setCommunityStateValue(prev => ({
        ...prev,
        mySnippets: snippets as CommunitySnippet[],
      }))

    } catch (error: any) {
      console.log("getmySnippets error", error);
      setError(error.message);
    }
    setLoading(false);
  };

  const joinCommunity = async (communityData: Community) => {
    try {
        const batch = writeBatch(firestore);
        const newSnippet: CommunitySnippet = {
            communityId: communityData.id,
            ImageURL: communityData.imageURL || "",
        };
        batch.set(
            doc(
              firestore,
              `users/${user?.uid}/communitySnippets`,
              communityData.id // will for sure have this value at this point
            ),
            newSnippet
          );

        batch.update(doc(firestore, "communities", communityData.id), {
            numberOfMembers: increment(1),
        });

        await batch.commit();

        // Add current community to snippet
        setCommunityStateValue((prev) => ({
            ...prev,
            mySnippets: [...prev.mySnippets, newSnippet],
      }));
    } catch (error: any) {
        console.log("joinCommunity error", error);
        setError(error.message);
    }
    setLoading(false);
  };

  const leaveCommunity = async (communityId: string) => {

    try {
        const batch = writeBatch(firestore);
        batch.delete(
            doc(firestore, `users/${user?.uid}/communitySnippets`,communityId)
          );
    
          batch.update(doc(firestore, "communities", communityId), {
            numberOfMembers: increment(-1),
          });
        await batch.commit();

        setCommunityStateValue((prev) => ({
            ...prev,
            mySnippets: prev.mySnippets.filter(
              (item) => item.communityId !== communityId
            ),
        }));

    } catch (error: any) {
        console.log("leaveCommunity error", error.message);
        setError(error.message);
    }
    setLoading(false);
  };

  const getCommunityData = async (communityId: string) => {

    console.log("GETTING COMMUNITY DATA");

    try {
      const communityDocRef = doc(
        firestore,
        "communities",
        communityId
      );
      const communityDoc = await getDoc(communityDocRef);
      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          id: communityDoc.id,
          ...communityDoc.data(),
        } as Community,
      }));
    } catch (error: any) {
      console.log("getCommunityData error", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user) {
      setCommunityStateValue(prev => ({
        ...prev,
        postVotes: [],
      }));
      return;
    }
    getMySnippets();
  }, [user]);

  useEffect(() => {
    const { communityId } = router.query

    if (communityId && !communityStateValue.currentCommunity) {
       getCommunityData(communityId as string);
    }
  }, [router.query, communityStateValue.currentCommunity]);

  return {
    communityStateValue,
    onJoinOrLeaveCommunity,
    loading,
  };
};
export default useCommunityData;