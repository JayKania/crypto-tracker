import styled from "styled-components";

const Nav = () => {
    return (
        <StyledNav>
            <StyledLink href="#">LOG IN</StyledLink>
        </StyledNav>
    )
}

const StyledNav = styled.nav`
    height: 70px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    max-width: 1200px;
    margin:  0 auto;
    padding: 0 2rem;
`;

const StyledLink = styled.a`
    text-decoration: none;
    color: #ccc;
    padding: 5px 10px 7px 10px;
    border-radius: 5px;
    transition: color 250ms ease, border-color 250ms ease;
    :hover {
        color: white;
    }
`


export default Nav