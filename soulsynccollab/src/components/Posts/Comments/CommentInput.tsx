import AuthButton from "@/components/Navbar/RightContent/AuthButton";
import { Flex, Textarea, Button, Text } from "@chakra-ui/react";
import { User } from "firebase/auth";
import { comment } from "postcss";
import React from "react";

type CommentInputProps = {
  commentText: string;
  setCommentText: (value: string) => void;
  user: User;
  createloading: boolean;
  onCreateComment: (comment: string) => void;
};

const CommentInput: React.FC<CommentInputProps> = ({
  commentText,
  setCommentText,
  user,
  createloading,
  onCreateComment,
}) => {
  return (
    <Flex direction="column" position="relative">
      {user ? (
        <>
          <Text mb={1}>
            Comment as{" "}
            <span style={{ color: "#3182CE" }}>
              {user?.email?.split("@")[0]}
            </span>
          </Text>
          <Textarea
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            placeholder="What are your thoughts?"
            fontSize="10pt"
            borderRadius={4}
            minHeight="160px"
            pb={10}
            _placeholder={{ color: "gray.500" }}
            _focus={{
              outline: "none",
              bg: "white",
              border: "1px solid black",
            }}
          />
          <Flex
            position="absolute"
            left="1px"
            right={0.1}
            bottom="1px"
            justify="flex-end"
            bg="gray.100"
            p="6px 8px"
            borderRadius="0px 0px 4px 4px"
            zIndex={2} // Ensure the button container is above the Textarea
          >
            <Button
              height="26px"
              isDisabled={!commentText.length} // Prevent empty/whitespace-only submission
              isLoading={createloading}
              onClick={() => onCreateComment(commentText)}
            >
              Comment
            </Button>
          </Flex>
        </>
      ) : (
        <Flex
          align="center"
          justify="space-between"
          borderRadius={2}
          border="1px solid"
          borderColor="gray.100"
          p={4}
        >
          <Text fontWeight={600}>Log in or sign up to leave a comment</Text>
          <AuthButton/>
        </Flex>
      )}
    </Flex>
  );
};
export default CommentInput;