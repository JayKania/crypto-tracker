import { useState } from "react"
import styled from "styled-components"

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const inputHandler = (event: any) => {
        if (event.target.id === "user") {
            setUsername(event.target.value);
        } else {
            setPassword(event.target.value);
        }
    }

    return (
        <StyledLoginContent onSubmit={(event: any) => { event?.preventDefault() }} >
            <h2>Login</h2>
            <div className="username-container">
                <label htmlFor="user">Username</label>
                <input type="text" name="username" id="user" placeholder="Enter Username" value={username} onChange={inputHandler} />
            </div>
            <div className="password-container">
                <label htmlFor="pass">Password</label>
                <input type="text" name="password" id="pass" placeholder="Enter Password" value={password} onChange={inputHandler} />
            </div>
            <div className="new-acc">
                <a>Don't have an account?  Sing Up</a>
            </div>
            <button>Submit</button>
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

    h2 {
        color: white;
        font-size: 2rem;
        margin: 2rem 0;
        font-weight: 400;
        text-align: center;
    }

    .username-container, .password-container {
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
        color: rgb(255, 255, 255, 0.7);
        background-color: #29699e;
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
    }

`;

export default Login