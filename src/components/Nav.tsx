import { useState } from "react";
import styled from "styled-components";

interface navprops {
    coinsList: coin[]
    setSearcedCoins: any,
    page: number,
    pageHandler: any
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
const Nav = ({ setSearcedCoins, coinsList, page, pageHandler }: navprops) => {


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
                if (name.startsWith(searchInput) || name.includes(searchInput)) {
                    // console.log(coin.name);

                }
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
            <StyledLink className="icon" href="/"><i className="fa fa-brands fa-bitcoin fa-lg"></i></StyledLink>
            <StyledSearchLoginContainer className="search-login-container">
                <StyledSearchBar placeholder="Search" onChange={inputHandler} value={input} />
                <StyledLink href="#" className="login-link" >LOG IN</StyledLink>
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
    border-radius: 20px ;
    background-color: rgb(25, 32, 84);
    box-shadow: 1px 1px 30px 15px rgb(9, 14, 52);

    @media only screen and (max-width: 540px) {
        width: 100%;
        border-radius: 0;
        padding: 1rem 0.5rem;
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
        color: white;
    }

    @media only screen and (max-width: 540px) {
        &.login-link {
            display: none;
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
    border: 1px solid rgb(255, 255, 255, 0.5);
    border-radius: 20px;
    padding: 0.7rem 1.2rem;
    outline: none;
    color: white;
    box-shadow: inset 1px 1px 2px 1px rgb(13, 20, 73);

    @media only screen and (max-width: 540px) {
        width: 180px;
    }
`;


export default Nav