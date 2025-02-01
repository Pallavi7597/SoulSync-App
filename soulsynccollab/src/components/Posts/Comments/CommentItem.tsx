import {
  Box,
  Flex,
  Icon,
  Spinner,
  Stack,
  Text,
  Textarea,
  Button,
} from "@chakra-ui/react";
import { Timestamp } from "firebase/firestore";
import moment from "moment";
import React, { useState } from "react";
import { FaReddit } from "react-icons/fa";
import {
  IoArrowDownCircleOutline,
  IoArrowUpCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowUpCircleSharp,
} from "react-icons/io5";

export type Comment = {
  id: string;
  creatorId: string;
  creatorDisplayText: string;
  communityId: string;
  postId: string;
  postTitle: string;
  text: string;
  createdAt: Timestamp;
  isEdited?: boolean;
  voteStatus: number; // Global voteStatus for tracking overall comment status
  votes: { [userId: string]: "up" | "down" | null }; // Track each user's vote status
};

type CommentItemProps = {
  comment: Comment;
  onVote: (commentId: string, voteValue: 1 | -1) => Promise<void>;
  onDeleteComment: (comment: Comment) => void;
  onEditComment: (updatedText: string, comment: Comment) => Promise<void>;
  loadingDelete: boolean;
  userId: string;
};

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onVote,
  onDeleteComment,
  onEditComment,
  loadingDelete,
  userId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);

  const handleEditSave = async () => {
    if (editedText.trim() !== comment.text) {
      await onEditComment(editedText, comment); // Pass both arguments
    }
    setIsEditing(false); // Close the editor
  };

  const handleEditCancel = () => {
    setEditedText(comment.text); // Reset the edited text to the original
    setIsEditing(false); // Close the editor
  };

  return (
    <Flex direction="column">
      <Stack direction="row" align="flex-start" spacing={2}>
        <Box mr={2}>
          <Icon as={FaReddit} fontSize={30} color="gray.300" />
        </Box>
        <Stack spacing={1} width="100%">
          <Stack direction="row" align="center" spacing={2} fontSize="8pt">
            <Text
              fontWeight={700}
              _hover={{ textDecoration: "underline", cursor: "pointer" }}
            >
              {comment.creatorDisplayText}
            </Text>
            {comment.isEdited && <Text color="gray.600">(edited)</Text>}
            {comment.createdAt?.seconds && (
              <Text color="gray.600">
                {moment(new Date(comment.createdAt?.seconds * 1000)).fromNow()}
              </Text>
            )}
            {loadingDelete && <Spinner size="sm" />}
          </Stack>
          {!isEditing ? (
            <Text fontSize="10pt">{comment.text}</Text>
          ) : (
            <Flex direction="column" position="relative" width="100%">
              <Textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                fontSize="10pt"
                borderRadius={4}
                minHeight="60px"
                pb={10}
                width="100%" // Set width to 100%
                _focus={{
                  outline: "none",
                  bg: "white",
                  border: "1px solid black",
                }}
              />
              <Stack direction="row" spacing={2} mt={2}>
                <Button size="sm" colorScheme="blue" onClick={handleEditSave}>
                  Save
                </Button>
                <Button size="sm" onClick={handleEditCancel}>
                  Cancel
                </Button>
              </Stack>
            </Flex>
          )}
          {!isEditing && (
            <Stack
              direction="row"
              align="center"
              cursor="pointer"
              fontWeight={600}
              color="gray.500"
            >
              <Icon
                as={
                  comment.votes[userId] === "up"
                    ? IoArrowUpCircleSharp
                    : IoArrowUpCircleOutline
                }
                color={
                  comment.votes[userId] === "up" ? "green.500" : "gray.500"
                }
                onClick={() => onVote(comment.id, 1)}
              />
              <Text fontSize="9pt">
                {comment.voteStatus}
              </Text>
              <Icon
                as={
                  comment.votes[userId] === "down"
                    ? IoArrowDownCircleSharp
                    : IoArrowDownCircleOutline
                }
                color={
                  comment.votes[userId] === "down" ? "red.500" : "gray.500"
                }
                onClick={() => onVote(comment.id, -1)}
              />

              {userId === comment.creatorId && (
                <>
                  <Text
                    fontSize="9pt"
                    _hover={{ color: "blue.500" }}
                    onClick={() => setIsEditing(true)} // Enable editing
                  >
                    Edit
                  </Text>
                  <Text
                    fontSize="9pt"
                    _hover={{ color: "blue.500" }}
                    onClick={() => onDeleteComment(comment)}
                  >
                    Delete
                  </Text>
                </>
              )}
            </Stack>
          )}
        </Stack>
      </Stack>
    </Flex>
  );
};

export default CommentItem;
