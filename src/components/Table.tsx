import { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";


interface tableProps {
    coinsList: coin[],
    searchedCoins: coin[],
    page: number
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

const Table = ({ coinsList, searchedCoins, page }: tableProps) => {

    console.group("table logs")

    let navigate = useNavigate();

    // formatter to get string with commas
    const numberWithCommas = (amount: string) => {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // formatter to get B/M/K at the value
    const convertToInternationalCurrencySystem = (labelValue: number): string | number => {

        // Nine Zeroes for Billions
        return Math.abs(Number(labelValue)) >= 1.0e+9

            ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + "B"
            // Six Zeroes for Millions 
            : Math.abs(Number(labelValue)) >= 1.0e+6

                ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + "M"
                // Three Zeroes for Thousands
                : Math.abs(Number(labelValue)) >= 1.0e+3

                    ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + "K"

                    : Math.abs(Number(labelValue));

    }

    const routeHandler = (id: string) => {
        console.log(id);
        navigate("/coins/" + id);
    }

    let listOfCoins: coin[];

    if (searchedCoins.length !== 0) {
        listOfCoins = [...searchedCoins]
    } else {
        listOfCoins = [...coinsList]
    }
    console.dir(searchedCoins);
    console.dir(coinsList);
    console.dir(listOfCoins);


    const listMarkup = listOfCoins.map(({ id, market_cap_rank, image, name, symbol, current_price, price_change_percentage_24h, market_cap, total_volume, circulating_supply }) => {

        let temp_current_price: string[] = Number(current_price).toString().split('.');
        // console.log(new_current_price);
        let new_current_price = numberWithCommas(temp_current_price[0]) + "." + (temp_current_price[1] || "00");

        // const new_current_price = current_price;
        let new_price_change_percentage_24h: string = Number(price_change_percentage_24h).toFixed(2);

        const changeColor: string = new_price_change_percentage_24h[0] === '-' ? "price-decrease" : "price-increase";

        new_price_change_percentage_24h = Math.abs(Number(price_change_percentage_24h)).toFixed(3);

        const new_market_cap: any = convertToInternationalCurrencySystem(market_cap);
        const new_total_volume: any = convertToInternationalCurrencySystem(total_volume);
        const new_circulating_supply: any = convertToInternationalCurrencySystem(circulating_supply);


        return <StyledCurrencyData className="row row-currency-data" key={id}>
            <div className="coin-rank">{market_cap_rank}</div>
            <div className="coin-name-container" id={`${id}-container`} onClick={() => { routeHandler(id.toString()) }}>
                <div className="coin-image">
                    <img src={image} alt={symbol} />
                </div>
                <div className="coin-name">{name}</div>
                <div className="coin-symbol">{symbol}</div>
            </div>
            <div className="coin-price">$ {new_current_price}</div>
            <div className={`coin-24h-change ${changeColor}`}>{new_price_change_percentage_24h} %</div>
            <div className="coin-market-cap">$ {new_market_cap}</div>
            <div className="coin-volume">$ {new_total_volume}</div>
            <div className="coin-circulating-supply">{new_circulating_supply} {`${symbol}`.toUpperCase()}</div>
        </StyledCurrencyData>
    })

    console.groupEnd();

    return (
        <StyledTable className="currency-container">
            <StyledHeader className="row row-header">
                <div className="header-title-rank">
                    # (Rank)
                </div>
                <div className="header-title-name">
                    Name
                </div>
                <div className="header-title-price">
                    Price
                </div>
                <div className="header-title-change">
                    24h %
                </div>
                <div className="header-title-market-cap">
                    Market Cap
                </div>
                <div className="header-title-volume">
                    Volume{"(24h)"}
                </div>
                <div className="header-title-csupply">
                    Circulating Supply
                </div>
            </StyledHeader>
            {listMarkup.slice((page - 1) * 30, (page - 1) * 30 + 30)}
        </StyledTable>
    )
}

const StyledTable = styled.div`
    margin:  0 auto;
    padding: 1rem 3rem;
    width: 95%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    border-radius: 20px ;
    background-color: rgb(25, 32, 84);
    .row {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        color: white;
        width: 100%;
        padding: 2rem 1rem;
        border-bottom: 1px solid rgba(124, 124, 124, 0.5);
    }
    .row:last-of-type {
        border: none;
    }
`;

const StyledHeader = styled.div`
    &.row-header {
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.9em;
    }
    [class*="header-title-"] {
        width: 100%;
        text-align: left;
    }
    [class*="header-title-"]:first-of-type{
        flex-basis: 40%;
    }
    [class*="header-title-"]:nth-of-type(n+3) {
        text-align: right;
    }

    `;

const StyledCurrencyData = styled.div`
    transition: background-color 200ms ease;
    [class*="coin-"] {
        width: 100%;
        text-align: right;
    }
    .coin-rank {
        flex-basis: 40%;
        text-align: left;
    }
    .coin-name-container {
        display: flex;
        gap: 10px;
        align-items: center;
        justify-content: space-evenly;
        .coin-name {
            text-decoration: none;
            text-align: left;
        }
        .coin-image {
            width: 60px;
            display: flex;
            align-items: center;
            img {
                width: 100%;
                object-fit: cover;
            }
        }
        .coin-symbol {
            text-align: left;
            color: rgb(128, 138, 157);
            text-transform: uppercase;
        }
        :hover {
            cursor: pointer;
        }
    }
    .coin-24h-change {
        &.price-increase {
            color: rgb(22, 220, 132);
            ::before {
                display: inline-block;
                content: "";
                width: 0; 
                height: 0; 
                margin-right: 5px;
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                
                border-bottom: 5px solid rgb(22, 220, 132);
            }
        }
        &.price-decrease {
            color: rgb(234, 57, 67);
            ::before {
                display: inline-block;
                content: "";
                width: 0; 
                height: 0;
                margin-right: 5px;
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                
                border-top: 5px solid rgb(234, 57, 67);
            }
        }
    }
    :hover {
        background-color: rgb(27, 32, 92);
    }
`;

export default memo(Table);