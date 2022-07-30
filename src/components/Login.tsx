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
    const [emailErrMsg, setEmailErrMsg] = useState("");
    const [passErrMsg, setPassErrMsg] = useState("");

    const submitHandler = async (event: any) => {
        event.preventDefault();
        setEmailErrMsg("");
        setPassErrMsg("");
        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            loginModalHandler();
            setLoading(false);
        } catch (err: any) {
            const errCode = err.code;
            switch (errCode) {
                case "auth/user-not-found":
                    setEmailErrMsg("No such account.");
                    break;
                case "auth/wrong-password":
                    setPassErrMsg("Please check your password.");
                    break;
                default:
                    break;
            }
            setLoading(false);
        }
    }

    const inputHandler = (event: any) => {
        if (event.target.id === "email") {
            setEmail(event.target.value.trim());
        } else {
            setPassword(event.target.value.trim());
        }
    }

    return (
        <StyledLoginContent onSubmit={submitHandler} >
            <div className="close-logo" onClick={loginModalHandler} >X</div>
            <h2>Login</h2>
            <div className="email-container">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" placeholder="Enter Email" value={email} onChange={inputHandler} autoComplete="off" required />
                <p className="err-msg">{emailErrMsg}</p>
            </div>
            <div className="password-container">
                <label htmlFor="pass">Password</label>
                <input type="password" name="password" id="pass" placeholder="Enter Password" value={password} onChange={inputHandler} required />
                <p className="err-msg">{passErrMsg}</p>
            </div>
            <div className="new-acc">
                <a onClick={signupModalHandler}>Don't have an account?  Sing Up</a>
            </div>
            <button disabled={loading}>Submit</button>
        </StyledLoginContent >
    )
}


const StyledLoginContent = styled.form`
    background-color: rgb(25, 32, 84);
    margin: 0 auto;
    padding: 1rem 2rem;
    border-radius: 10px;
    box-shadow: 1px 1px 5px 2px rgb(9, 14, 52);
    animation: top-center 300ms ease 1;
    position: relative;

    .err-msg {
        border-radius: 10px;
        color: rgba(255, 255, 0);
        padding-top: 5px;
        font-size: 0.8rem;
    }

    .close-logo {
        display: none;
    }

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

    @media only screen and (max-width: 540px) {
        .close-logo {
            display: block;
            position: absolute;
            right: 5%;
            font-weight: 600;
            font-size: 20px;
            color: white;
            :hover {
                cursor: pointer;
            }
        }
    }

`;

export default Login