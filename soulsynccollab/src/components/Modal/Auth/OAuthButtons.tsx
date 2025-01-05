import { Button, Flex, Image, Text } from '@chakra-ui/react';
import React from 'react';
import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase/clientApp";

const OAuthButtons:React.FC = () => {
    const [signInWithGoogle, user, loading, formerror] = useSignInWithGoogle(auth);
    return (
        <Flex direction="column" width="100%" mb={4}>
            <Button 
              variant="oauth" 
              mb={2} 
              isLoading={loading}
              onClick={() => signInWithGoogle()}  
            >
                <Image src='/images/googlelogo.png' height = '20px' mr={4}>
                </Image>
                Continue with Google
            </Button>
            <Button variant="oauth"> Some Other Provider</Button>
            {formerror && (
             <Text textAlign="center" fontSize="10pt" color="red" mt={2}>
                {formerror.message} {/* Accessing the message property */}
             </Text>
            )}   
        </Flex>
    )
}
export default OAuthButtons;