import { Stack, Box, SkeletonText, Skeleton } from '@chakra-ui/react';
import React from 'react';

type PostLoaderProps = {
    
};

const PostLoader:React.FC<PostLoaderProps> = () => {
    
    return (
        <Stack spacing={6}>
        <Box padding="10px 10px" boxShadow="lg" bg="white" borderRadius={4}>
          <SkeletonText mt="4" noOfLines={1} width="40%" spacing="4" />
          <SkeletonText mt="4" noOfLines={4} spacing="4" />
          <Skeleton mt="4" height="200px" />
        </Box>
        <Box padding="10px 10px" boxShadow="lg" bg="white" borderRadius={4}>
          <SkeletonText mt="4" noOfLines={1} width="40%" spacing="4" />
          <SkeletonText mt="4" noOfLines={4} spacing="4" />
          <Skeleton mt="4" height="200px" />
        </Box>
      </Stack>
    )
}
export default PostLoader;