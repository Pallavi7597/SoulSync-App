import { authModalState } from '@/atoms/authModalAtom';
import { Button, Flex, Input, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase/clientApp'
import { FIREBASE_ERRORS } from "../../../firebase/errors";

const SignUp:React.FC = () => {
    
    const setAuthModalState = useSetRecoilState(authModalState);
    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
      });

    const [formError, setFormError] = useState("");  
    const [
        createUserWithEmailAndPassword,
        user,
        loading,
        userError,
    ] = useCreateUserWithEmailAndPassword(auth);


    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (formError) setFormError("");
        if (!form.email.includes("@")) {
          return setFormError("Please enter a valid email");
        }
        if (form.password !== form.confirmPassword) {
            return setFormError("Passwords do not match");
          }
        if (form.password.length < 6) {
            return setFormError("Password must be at least 6 characters");
        }
        // Valid form inputs
        createUserWithEmailAndPassword(form.email, form.password);
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
          mb={1}
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
        <Input
          required
          name="confirmPassword"
          placeholder="confirm password"
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

        <Text textAlign="center" color="red" fontSize="10pt">
           {formError ||
            FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS]}
        </Text>
        
        <Button width = "100%" height="36px" mt={2} mb={2} type = 'submit' isLoading={loading}>
          Sign Up
        </Button>
        <Flex fontSize="9pt" justifyContent="center">
            <Text mr={1}> Already a redditer?</Text>
            <Text color='blue.500' fontWeight={700} cursor='pointer' 
              onClick={()=> 
              setAuthModalState ((prev) => ({
                ...prev,
                view: "login",
              }))
              }
        > 
              LOG IN
            </Text>

        </Flex>
    </form>
  )
}
export default SignUp;