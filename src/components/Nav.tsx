import { User } from "firebase/auth";
import { useState } from "react";
import styled from "styled-components";

interface navprops {
    coinsList: coin[]
    setSearcedCoins: any,
    page: number,
    pageHandler: any,
    loginModalHandler: any,
    signupModalHandler: any,
    handleLogout: any,
    user: User | undefined | null,
    handleMobileMenu: any,
}

interface coin {
    id: number,
    market_cap_rank: number,
    image: string,
    name: string,
    symbol: string,
    current_price: number,
    price_change_percentage_24h: number,
    market_cap: number,
    total_volume: number,
    circulating_supply: number,
}
const Nav = ({ setSearcedCoins, coinsList, page, pageHandler, loginModalHandler, signupModalHandler, user, handleLogout, handleMobileMenu }: navprops) => {


    const [input, setInput] = useState("");

    const inputHandler = (event: any) => {
        console.group("search logs");
        let searchInput: string = event.target.value;
        searchInput = searchInput.toLowerCase();
        setInput(searchInput);
        let newCoinsList: coin[] = [];
        if (searchInput.trim()) {
            newCoinsList = coinsList.filter(coin => {
                let name = coin.name.toLowerCase();
                return name.startsWith(searchInput) || name.includes(searchInput);
            })
        }
        setSearcedCoins(newCoinsList);
        if (page !== 1) {
            pageHandler(1);
        }
        console.groupEnd();

    }

    return (
        <StyledNav>
            <div className="logo-menu-wrapper">
                <StyledLink className="burger-menu" onClick={handleMobileMenu}>
                    <i className="fa fa-solid fa-bars fa-lg"></i>
                </StyledLink>
                <StyledLink className="icon" href="/">
                    <i className="fa fa-brands fa-bitcoin fa-lg"></i>
                </StyledLink>
            </div>
            <StyledSearchLoginContainer className="search-login-container">
                <StyledSearchBar placeholder="Search" onChange={inputHandler} value={input} />

                {user ? <StyledLink className="logout-link" onClick={handleLogout}>LOG OUT</StyledLink> :
                    <>
                        <StyledLink className="login-link" onClick={loginModalHandler}>LOG IN</StyledLink>
                        <StyledLink className="signup-link" onClick={signupModalHandler} >SIGN UP</StyledLink>
                    </>}
            </StyledSearchLoginContainer>
        </StyledNav>
    )
}

const StyledNav = styled.nav`
    height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 95%;
    margin:  0rem auto 2rem auto;
    padding: 1rem 2rem;
    border-radius: 10px ;
    background-color: rgb(25, 32, 84);
    box-shadow: 1px 1px 30px 15px rgb(9, 14, 52);

    @media only screen and (max-width: 540px) {
        width: 100%;
        border-radius: 0;
        padding: 1rem 0.5rem;
        margin: 0;
        background-color: transparent;
        box-shadow: none;
    }
`;

const StyledLink = styled.a`
    text-decoration: none;
    color: #ccc;
    padding: 5px 10px 7px 10px;
    border-radius: 5px;
    transition: color 250ms ease, border-color 250ms ease;
    :hover {
        color: white;
        cursor: pointer;
    }
    &.icon {
        color: rgb(255, 255, 255, 0.7);
    }

    &.signup-link {
        border-radius: 5px;
        padding: 0.5rem 1rem;
        transition: box-shadow 200ms ease;
        border: 1px solid #ccc;
    }

    &.burger-menu {
        display: none;
    }

    @media only screen and (max-width: 540px) {
        &.login-link, &.signup-link, &.logout-link {
            display: none;
        }
        &.burger-menu {
            display: inline-block;
        }
    }
`

const StyledSearchLoginContainer = styled.div`
    display: flex;
    gap: 1rem;
    align-items: center;
`;

const StyledSearchBar = styled.input`
    background-color: transparent;
    border: 1px solid rgb(255, 255, 255, 0.2);
    border-radius: 10px;
    padding: 0.7rem 1.2rem;
    outline: none;
    color: white;
    box-shadow: inset 1px 1px 2px 1px rgb(13, 20, 73);

    @media only screen and (max-width: 540px) {
        width: 180px;
        box-shadow: none;
    }
`;


export default Nav