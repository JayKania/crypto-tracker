import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import styled from "styled-components"
import { auth, db } from "../firebaseConfig";
import { setDoc, doc } from "firebase/firestore"
import { checkPassLength } from "../Utils";

interface signupProps {
    signupModalHandler: any,
    loginModalHandler: any
}

const SignUp = ({ signupModalHandler, loginModalHandler }: signupProps) => {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailErrMsg, setEmailErrMsg] = useState("");
    const [passErrMsg, setPassErrMsg] = useState("");


    const inputHandler = (event: any) => {
        if (event.target.id === "user") {
            setUsername(event.target.value.trim());
        } else if (event.target.id === "email") {
            setEmail(event.target.value.trim());
        } else {
            setPassword(event.target.value.trim());
        }
    }

    const submitHandler = async (event: any) => {
        event.preventDefault();
        setEmailErrMsg("");
        setPassErrMsg("");
        try {
            if (checkPassLength(password)) {
                setPassErrMsg("")
                setLoading(true);
                const data = await createUserWithEmailAndPassword(auth, email, password)
                await updateProfile(data.user, {
                    displayName: username
                })

                const docRef = doc(db, "users", data.user.uid);
                await setDoc(docRef, {
                    email: email,
                    name: username,
                    favourites: [],
                })
                setEmailErrMsg("");
                signupModalHandler();
                setLoading(false);
            } else {
                // alert("Password must be atleast 8 characters long");
                setPassErrMsg("Password must be atleast 8 characters long.")
            }
        } catch (err: any) {
            const errCode = err.code;
            switch (errCode) {
                case "auth/email-already-in-use":
                    setEmailErrMsg("Account already in use.");
                    break;
                case "auth/invalid-email":
                    setEmailErrMsg("Invalid Email Address.")
                    break;
                default:
                    break;
            }
            setLoading(false);
        }
    }

    return (
        <StyledSignUpContent onSubmit={submitHandler} >
            <div className="close-logo" onClick={signupModalHandler} >X</div>
            <h2>Sign Up</h2>
            <div className="username-container">
                <label htmlFor="user">Username</label>
                <input type="text" name="username" id="user" placeholder="Enter Username" onChange={inputHandler} autoComplete="off" value={username} required />
            </div>
            <div className="email-container">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" placeholder="Enter Email" onChange={inputHandler} autoComplete="off" value={email} required />
                <p className="err-msg">{emailErrMsg}</p>
            </div>
            <div className="password-container">
                <label htmlFor="pass">Password</label>
                <input type="password" name="password" id="pass" placeholder="Enter Password" onChange={inputHandler} value={password} required />
                <p className="err-msg">{passErrMsg}</p>
            </div>
            <div className="existing-acc">
                <a onClick={loginModalHandler}>Already have an account?</a>
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
            background-color: rgb(41, 98, 255, 0.5);
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

    @media only screen and (max-width: 320px) {
        font-size: 14px;
        h2 {
            margin: 1rem;
            /* font-size: 1.rem; */
        }
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

    @media only screen and (min-width: 321px) and (max-width: 540px){
        
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

export default SignUp