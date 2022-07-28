import { User } from "firebase/auth"
import { Link } from "react-router-dom"
import styled from "styled-components"

interface mobileMenuProps {
    openMobileMenu: any,
    handleMobileMenu: any,
    loginModalHandler: any,
    signupModalHandler: any,
    user: User | undefined | null,
    handleLogout: any
}

const MobileMenu = ({ openMobileMenu, handleMobileMenu, loginModalHandler, signupModalHandler, user, handleLogout }: mobileMenuProps) => {
    return (
        <>
            <StyledMobileMenuOverlay className={`${!openMobileMenu ? "hidden" : ""}`} onClick={handleMobileMenu} />
            <StyledMobileMenuContent className={`${!openMobileMenu ? "hidden" : ""}`}>

                <h3>
                    <StyledLink className="icon" href="/">
                        <i className="fa fa-brands fa-bitcoin fa-lg"></i>
                    </StyledLink>Coin Tracker
                </h3>
                {user ?
                    <StyledListLogoutContainer>
                        <Link to="/watchlist" onClick={handleMobileMenu} className="watchlist-link">WATCHLIST</Link>
                        <StyledLink className="logout-link" onClick={() => { handleMobileMenu(); handleLogout(); }}>LOG OUT</StyledLink>
                    </StyledListLogoutContainer>
                    :
                    <>
                        <StyledLink className="login-link" onClick={() => { handleMobileMenu(); loginModalHandler(); }}>LOG IN</StyledLink>
                        <StyledLink className="signup-link" onClick={() => { handleMobileMenu(); signupModalHandler(); }} >SIGN UP</StyledLink>
                    </>}
            </StyledMobileMenuContent>
        </>
    )
}

const StyledMobileMenuOverlay = styled.div`
    background-color: rgb(0,0,0,0.7);
    position: fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    &.hidden {
        display: none;
    }
`
const StyledMobileMenuContent = styled.div`
    color: white;
    width: 70%;
    position: fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    background-color: rgb(13, 20, 74);
    height: 100%;
    transition: transform 250ms ease;
    display: flex;
    flex-direction: column;
    padding: 2rem 1rem;
    h3 {
        padding: 5px 10px 7px 10px;
        margin-bottom: 2rem;
        display: inline;
        font-size: 1.2rem;
        color: rgb(255,255,255, 0.7);
    }
    &.hidden {
        transform: translateX(-100%);
    }
`

const StyledLink = styled.a`
    text-decoration: none;
    color: rgb(255,255,255);
    padding: 5px 10px 7px 10px;
    border-radius: 5px;
    transition: color 250ms ease, border-color 250ms ease;
    :hover {
        cursor: pointer;
    }

    &.icon {
        padding-left: 0;
        font-size: 1rem;
        color: rgb(255,255,255, 0.7);
    }

`;

const StyledListLogoutContainer = styled.div`
    display: flex;
    flex-direction: column;
    .watchlist-link {
        text-decoration: none;
        color: white;
        padding: 5px 10px 7px 10px;
        border-radius: 5px;
        transition: color 250ms ease, border-color 250ms ease;
    }
`

export default MobileMenu