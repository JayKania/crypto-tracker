import styled from "styled-components"

const Login = () => {
    return (
        <StyledLoginContainer>
            <StyledLoginContent onSubmit={(event: any) => { event?.preventDefault() }} >
                <h2>Login</h2>
                <div className="username-container">
                    <label htmlFor="user">Username</label>
                    <input type="text" name="username" id="user" placeholder="Enter Username" />
                </div>
                <div className="password-container">
                    <label htmlFor="pass">Password</label>
                    <input type="text" name="password" id="pass" placeholder="Enter Password" />
                </div>
                <button>Submit</button>
            </StyledLoginContent>
        </StyledLoginContainer>
    )
}

const StyledLoginContainer = styled.div`
    width: 100%;
    height: 100vh;
    position: fixed;
    z-index: 1;
`;

const StyledLoginContent = styled.form`
    width: 450px;
    background-color: rgb(25, 32, 84);
    margin: 0 auto;
    padding: 1rem 2rem;
    border-radius: 10px;
    box-shadow: 2px 2px 10px 5px rgb(9, 14, 52);

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
        box-shadow:0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
        :hover {
            cursor: pointer;
        }
    }
`;

export default Login