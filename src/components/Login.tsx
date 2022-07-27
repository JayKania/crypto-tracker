import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useState } from "react";
import styled from "styled-components";
import { auth } from "../firebaseConfig";

interface loginProps {
    loginModalHandler: any,
    signupModalHandler: any
}

const Login = ({ loginModalHandler, signupModalHandler }: loginProps) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const submitHandler = async (event: any) => {
        event.preventDefault();
        try {
            setLoading(true);
            const data = await signInWithEmailAndPassword(auth, email, password);
            console.log(data.user);
            loginModalHandler();
            setLoading(false);
        } catch (err: any) {
            console.log(err.code);
            setLoading(false);
        }
        // signOut(auth);
    }

    const inputHandler = (event: any) => {
        if (event.target.id === "email") {
            setEmail(event.target.value);
        } else {
            setPassword(event.target.value);
        }
    }

    return (
        <StyledLoginContent onSubmit={submitHandler} >
            <h2>Login</h2>
            <div className="email-container">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" placeholder="Enter Email" value={email} onChange={inputHandler} required />
            </div>
            <div className="password-container">
                <label htmlFor="pass">Password</label>
                <input type="password" name="password" id="pass" placeholder="Enter Password" value={password} onChange={inputHandler} required />
            </div>
            <div className="new-acc">
                <a onClick={signupModalHandler}>Don't have an account?  Sing Up</a>
            </div>
            <button disabled={loading}>Submit</button>
        </StyledLoginContent>
    )
}


const StyledLoginContent = styled.form`
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

    .email-container, .password-container {
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

    .new-acc {
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
        color: rgb(255, 255, 255);
        background-color: rgb(41, 98, 255);
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
            color: rgb(255, 255, 255, 0.5);
            background-color: rgb(41, 105, 158, 0.5);
        }

        :hover:disabled {
            cursor: default;
        }
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

export default Login