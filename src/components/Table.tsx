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


    const listMarkup = coinsList.map(({ id, market_cap_rank, name, symbol, current_price, price_change_percentage_24h, market_cap, total_volume, circulating_supply }) => {
        return <StyledCurrencyData className="row row-currency-data" key={id}>
            <div className="coin-rank">{market_cap_rank}</div>
            <div className="coin-name">{name} <span className="symbol">{symbol}</span></div>
            <div className="coin-price">{current_price}</div>
            <div className="coin-24h-change">{price_change_percentage_24h}</div>
            <div className="coin-market-cap">{market_cap}</div>
            <div className="coin-volume">{total_volume}</div>
            <div className="coin-circulating-supply">{circulating_supply}</div>
        </StyledCurrencyData>
    })

    return (
        <StyledTable className="currency-container">
            <StyledHeader className="row row-header">
                <div className="header-title">
                    #
                </div>
                <div className="header-title">
                    Name
                </div>
                <div className="header-title">
                    Price
                </div>
                <div className="header-title">
                    24h %
                </div>
                <div className="header-title">
                    Market Cap
                </div>
                <div className="header-title">
                    Volume{"(24h)"}
                </div>
                <div className="header-title">
                    Circulating Supply
                </div>
            </StyledHeader>
            {listMarkup}

        </StyledTable>
    )
}

const StyledTable = styled.div`
   max-width: 1200px;
    margin:  0 auto;
    padding: 0 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
    .row {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        color: white;
        width: 100%;
        margin-bottom: 1rem;
    }
`;

const StyledHeader = styled.div`
    &.row-header {
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.9em;
    }
    .header-title {
        width: 100%;
        text-align: center;
    }
    `;

const StyledCurrencyData = styled.div`
    [class*="coin-"] {
        width: 100%;
        text-align: center;
    }
`;

export default Table