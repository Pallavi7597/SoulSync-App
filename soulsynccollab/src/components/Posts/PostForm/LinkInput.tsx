import { Button, Flex, Input, Stack, Text, Textarea } from "@chakra-ui/react";
import React, { useState } from "react";
import { RiErrorWarningLine } from "react-icons/ri";

type LinkInputProps = {
  linkInputs: {
    title: string;
    url: string;
  };
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleCreatePost: () => void;
  loading: boolean;
};

const LinkInput: React.FC<LinkInputProps> = ({
  linkInputs,
  onChange,
  handleCreatePost,
  loading,
}) => {
  const [isValidLink, setIsValidLink] = useState(true);

  // Validate URL
  const validateURL = (url: string) => {
    const urlRegex =
      /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z]{2,6}([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    return urlRegex.test(url);
  };

  const handleURLChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event);
    const isValid = validateURL(event.target.value);
    setIsValidLink(isValid || event.target.value === ""); // Allow empty for initial input
  };

  return (
    <Stack spacing={3} width="100%">
      <Input
        name="title"
        value={linkInputs.title}
        onChange={onChange}
        _placeholder={{ color: "gray.500" }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "black",
        }}
        fontSize="10pt"
        borderRadius={4}
        placeholder="Title"
      />
      <Textarea
        name="url"
        value={linkInputs.url}
        onChange={handleURLChange}
        fontSize="10pt"
        placeholder="Link (e.g., https://example.com)"
        _placeholder={{ color: "gray.500" }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "black",
        }}
        height="100px"
      />
      {/* Reserve space for the error message */}
      <Flex align="center" minHeight="18px">
        {!isValidLink && (
          <>
            <RiErrorWarningLine color="red" style={{ marginRight: "5px", marginLeft: "5px" }} />
            <Text fontSize="9pt">
              Link doesn't look right
            </Text>
          </>
        )}
      </Flex>
      <Flex justify="flex-end">
        <Button
          height="34px"
          padding="0px 30px"
          disabled={!linkInputs.title || !linkInputs.url || !isValidLink}
          isLoading={loading}
          onClick={handleCreatePost}
        >
          Post
        </Button>
      </Flex>
    </Stack>
  );
};

export default LinkInput;
