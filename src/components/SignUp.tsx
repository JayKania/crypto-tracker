import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import styled from "styled-components"
import { auth, db } from "../firebaseConfig";
import { setDoc, doc } from "firebase/firestore"

interface signupProps {
    signupModalHandler: any,
}

const SignUp = ({ signupModalHandler }: signupProps) => {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);


    const inputHandler = (event: any) => {
        if (event.target.id === "user") {
            setUsername(event.target.value);
        } else if (event.target.id === "email") {
            setEmail(event.target.value);
        } else {
            setPassword(event.target.value);
        }
    }

    const submitHandler = async (event: any) => {
        event.preventDefault();
        try {
            setLoading(true);
            const data = await createUserWithEmailAndPassword(auth, email, password)
            console.log(data.user);
            await updateProfile(data.user, {
                displayName: username
            })

            const docRef = doc(db, "users", data.user.uid);
            await setDoc(docRef, {
                name: username,
                favourites: [],
            })
            signupModalHandler();
            setLoading(false);
        } catch (err: any) {
            console.log(err.code);
            setLoading(false);
        }
    }

    return (
        <StyledSignUpContent onSubmit={submitHandler} >
            <h2>Sign Up</h2>
            <div className="username-container">
                <label htmlFor="user">Username</label>
                <input type="text" name="username" id="user" placeholder="Enter Username" onChange={inputHandler} value={username} required />
            </div>
            <div className="email-container">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" placeholder="Enter Email" onChange={inputHandler} value={email} required />
            </div>
            <div className="password-container">
                <label htmlFor="pass">Password</label>
                <input type="text" name="password" id="pass" placeholder="Enter Password" onChange={inputHandler} value={password} required />
            </div>
            <div className="existing-acc">
                <a>Already have an account?</a>
            </div>
            <button disabled={loading}>Submit</button>
        </StyledSignUpContent>
    )
}

const StyledSignUpContent = styled.form`
    width: 450px;
    background-color: rgb(25, 32, 84);
    margin: 0 auto;
    padding: 1rem 2rem;
    border-radius: 10px;
    box-shadow: 1px 1px 5px 2px rgb(9, 14, 52);
    animation: top-center 300ms ease 1;

    h2 {
        color: white;
        font-size: 2rem;
        margin: 2rem 0;
        font-weight: 400;
        text-align: center;
    }

    .email-container, .username-container, .password-container {
        display: flex;
        flex-direction: column;
        margin-bottom: 2rem;
        label {
            color: rgb(255,255,255,0.7);
            margin-bottom: 4px;
        }
        input {
            background-color: transparent;
            width: 100%;
            border: 1px solid rgb(255,255,255,0.7);
            outline: none;
            padding: 1rem ;
            color: white;
            border-radius: 10px;
        }
    }

    .existing-acc {
        font-weight: 200;
        a {
            color: white;
            text-decoration: underline;
            :hover {
                cursor: pointer;
            }  
        }
    }

    button {
        width: 100%;
        color: rgb(255, 255, 255, 0.7);
        background-color: rgb(41, 105, 158);
        border: none;
        padding: 1rem;
        border-radius: 10px;
        transition: box-shadow 200ms ease;
        font-size: 1.2rem;
        margin: 2rem 0;
        font-weight: 600;
        :hover {
            cursor: pointer;
        }
        :disabled {
            background-color: rgb(41, 105, 158, 0.5);
        }

        :hover:disabled {
            cursor: default;
        }
    }

    @media only screen and (max-width: 540px) {
        width: 100%;
    }

    @keyframes top-center {
        from {
            transform: translateY(-100%);
            opacity: 0;
        }

        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;

export default SignUp