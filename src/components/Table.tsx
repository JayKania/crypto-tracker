import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components"

const Table = () => {

    const currency = "usd";
    const [coinsList, setCoinsList] = useState([]);


    useEffect(() => {
        const getCoinsData = async () => {
            const response = await axios(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`);
            console.dir(response.data);
            setCoinsList(response.data);
        }
        getCoinsData();
        console.log();
    }, []);

    const numberWithCommas = (amount: String) => {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    const listMarkup = coinsList.map(({ id, market_cap_rank, image, name, symbol, current_price, price_change_percentage_24h, market_cap, total_volume, circulating_supply }) => {

        const new_current_price = numberWithCommas(Number(current_price).toFixed(3));
        // const new_current_price = current_price;
        let new_price_change_percentage_24h = Number(price_change_percentage_24h).toFixed(2);
        const changeColor = new_price_change_percentage_24h[0] === '-' ? "price-decrease" : "price-increase";
        new_price_change_percentage_24h = Math.abs(Number(price_change_percentage_24h)).toFixed(3);
        const new_market_cap = numberWithCommas(market_cap);
        const new_total_volume = numberWithCommas(total_volume);
        const new_circulating_supply = numberWithCommas(Number(circulating_supply).toFixed(3));


        return <StyledCurrencyData className="row row-currency-data" key={id}>
            <div className="coin-rank">{market_cap_rank}</div>
            <div className="coin-name-container">
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


    return (
        <StyledTable className="currency-container">
            <StyledHeader className="row row-header">
                <div className="header-title-rank">
                    #
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
            {listMarkup}

        </StyledTable>
    )
}

const StyledTable = styled.div`
    margin:  0 auto;
    padding: 0 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    .row {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        color: white;
        width: 100%;
        padding: 2rem 1rem;
        border-bottom: 1px solid #828282;
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
        flex-basis: 20%;
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
        flex-basis: 20%;
        text-align: left;
    }
    .coin-name-container {
        display: flex;
        gap: 10px;
        align-items: center;
        justify-content: space-evenly;
        .coin-name {
            text-align: left;
        }
        .coin-image {
            width: 50px;
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
        cursor: pointer;
        background-color: rgb(36, 43, 123);
    }
`;

export default Table