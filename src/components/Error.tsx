import { Link } from "react-router-dom"
import styled from "styled-components"

const Error = () => {
    return (
        <StyledError>
            <h2>Oops!</h2>
            <h3>404, Page not Found</h3>
            <p>This is not the webpage you are looking for.</p>
            <Link to="/"> Go back to the site</Link>
        </StyledError>
    )
}

const StyledError = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgb(255,255,255);
    padding: 1rem;
    border-radius: 10px;
    box-shadow: 1px 1px 15px 10px rgb(9, 14, 52);
    h2{
        margin-bottom: 0.5rem
    }

    h3 {
        margin-bottom: 0.5rem;
    }

    p {
        margin-bottom: 1.5rem;
    }

    @media only screen and (max-width: 540px) {
        width: 70%
    }
`

export default Error