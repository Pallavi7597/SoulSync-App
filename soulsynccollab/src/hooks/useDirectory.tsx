import { communityState } from '@/atoms/communitiesAtom';
import { DirectoryMenuItem, directoryMenuState } from '@/atoms/directoryMenuAtom';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { FaReddit } from "react-icons/fa";

const useDirectory= () => {
    const [directoryState, setDirectoryState] =
    useRecoilState(directoryMenuState);
    const router = useRouter();
    const communiStateValue = useRecoilValue(communityState);
    const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {
        setDirectoryState((prev) => ({
          ...prev,
          selectedMenuItem: menuItem,
        }));
    
        router.push(menuItem.link);
        if (directoryState.isOpen) {
           toggleMenuOpen();
         }
      };

    const toggleMenuOpen = () => {
        setDirectoryState((prev) => ({
          ...prev,
          isOpen: !directoryState.isOpen,
        }));
      };
    
    useEffect ( () => {
        const currentCommunity = communiStateValue.currentCommunity;
        if (currentCommunity) {
            setDirectoryState((prev) => ({
                ...prev,
                selectedMenuItem:{
                    displayText: `r/${currentCommunity.id}`,
                    link: `/r/${currentCommunity.id}`,
                    imageURL: currentCommunity.imageURL,
                    icon: FaReddit,
                    iconColor: "blue.500",
                },
            }));
        }
    }, [communiStateValue.currentCommunity])
    return { directoryState, toggleMenuOpen, onSelectMenuItem};
}
export default useDirectory;