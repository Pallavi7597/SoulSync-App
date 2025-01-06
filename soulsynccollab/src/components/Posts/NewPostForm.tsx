import React from 'react';
import { Flex } from '@chakra-ui/react'
import { BiPoll } from "react-icons/bi";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { AiFillCloseCircle } from "react-icons/ai";

const formTabs = [
  {
    title: "Post",
    icon: IoDocumentText,
  },
  {
    title: "Images & Video",
    icon: IoImageOutline,
  },
  {
    title: "Link",
    icon: BsLink45Deg,
  },
  {
    title: "Poll",
    icon: BiPoll,
  },
  {
    title: "Talk",
    icon: BsMic,
  },
];

export type TabItem = {
  title: string;
  // icon: typeof Icon.
};

type NewPostFormProps = {
  
};

const NewPostForm:React.FC<NewPostFormProps> = () => {
  
  return (
    <Flex direction = "column" bg= "white" borderRadius={4} mt = {2}>
      <Flex width="100%">

      </Flex>

    </Flex>
  )
}
export default NewPostForm;