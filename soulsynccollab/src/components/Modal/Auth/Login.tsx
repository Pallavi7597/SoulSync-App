import { authModalState } from '@/atoms/authModalAtom';
import { Button, Flex, Input, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { auth } from "../../../firebase/clientApp";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { FIREBASE_ERRORS } from '@/firebase/errors';

type LoginProps = {
    
};

const Login:React.FC<LoginProps> = () => {
    const setAuthModalState = useSetRecoilState(authModalState);
    const [form, setForm] = useState({
        email: "",
        password: "",
      });

      const [formError, setFormError] = useState("");

      const [signInWithEmailAndPassword, user, loading, authError] =
      useSignInWithEmailAndPassword(auth);

      const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (formError) setFormError("");

        if (!form.email.includes("@")) {
          return setFormError("Please enter a valid email");
        }
        signInWithEmailAndPassword(form.email,form.password);
      };

      const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Update form state
        setForm((prev) => ({
          ...prev,
          [event.target.name]: event.target.value,
        }));
      };
    
    return (
      <form onSubmit={onSubmit}>
        <Input
          required
          name="email"
          placeholder="email"
          type="text"
          mb={2}
          onChange={onChange}
          fontSize="10pt"
          _placeholder={{ color: "gray.500" }}
          _hover= {{
              bg: "white", border: "1px solid", borderColor: "blue.500" ,
          }}
          _focus= {{
             outline: "none", bg: "white", border: "1px solid", borderColor: "blue.500",
          }}
          bg="gray.50"
        />
        <Input
          required
          name="password"
          placeholder="password"
          type="password"
          mb={2}
          onChange={onChange}
          fontSize="10pt"
          _placeholder={{ color: "gray.500" }}
          _hover= {{
              bg: "white", border: "1px solid", borderColor: "blue.500" ,
          }}
          _focus= {{
              outline: "none", bg: "white", border: "1px solid", borderColor: "blue.500",
          }}
          bg="gray.50"      
        />
      <Text textAlign="center" mt={2} fontSize="10pt" color="red">
        {formError ||
        FIREBASE_ERRORS[authError?.message as keyof typeof FIREBASE_ERRORS]}
      </Text>
        <Button width = "100%" height="36px" mt={2} mb={2} type = 'submit' isLoading={loading}>
          Log In
        </Button>
        <Flex justifyContent="center" mb={2}>
          <Text fontSize="9pt" mr={1}>
            Forgot your password?
          </Text>
          <Text
           fontSize="9pt"
           color="blue.500"
           cursor="pointer"
           onClick={()=> 
            setAuthModalState ((prev) => ({
              ...prev,
              view: "resetPassword",
            }))
            }          
          >
            Reset
          </Text>
        </Flex>

        <Flex fontSize="9pt" justifyContent="center">
            <Text mr={1}> New here?</Text>
            <Text color='blue.500' fontWeight={700} cursor='pointer' 
              onClick={()=> 
              setAuthModalState ((prev) => ({
                ...prev,
                view: "signup",
              }))
              }
        > 
              SIGN UP
            </Text>

        </Flex>
    </form>
  )
}
export default Login;