import axios from 'axios'
import { User } from 'firebase/auth'
import { doc, DocumentData, getDoc, setDoc } from 'firebase/firestore'
import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import rocket_img from "../assets/rocket.png"
import { db } from '../firebaseConfig'
import { convertToInternationalCurrencySystem, numberWithCommas } from '../Utils'

interface watchlistProps {
    userFavs: any,
    user: User | undefined | null,
    handleFavs: any
}

const Watchlist = ({ userFavs, user, handleFavs }: watchlistProps) => {

    let navigate = useNavigate();
    console.log(userFavs);

    const routeHandler = (id: string) => {
        navigate("/coins/" + id);
    }

    const favouriteHandler = async (id: string) => {
        if (!user) {
            alert("Please Login first!");
            return;
        }

        console.log(id);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        const docData: DocumentData | undefined = docSnap.data();
        if (docData) {
            console.log(docData.favourites[id]);
            if (docData.favourites[id]) {
                const tempFavourites = { ...docData.favourites };
                console.log(tempFavourites);
                delete tempFavourites[id];
                await setDoc(docRef, {
                    ...docData, favourites: { ...tempFavourites }
                })
                handleFavs(tempFavourites)
                console.log(tempFavourites);

            }
            else {
                const { data: coinData } = await axios.get(
                    `https://api.coingecko.com/api/v3/coins/${id}`
                );
                console.log(coinData);
                const {
                    market_cap_rank,
                    name,
                    description,
                    image,
                    symbol,
                    market_data,
                    links,
                } = coinData;

                const tempFavourites = { ...docData.favourites, };

                tempFavourites[id] = {

                    market_cap_rank: market_cap_rank,
                    market_cap: market_data.market_cap.usd,
                    name: name,
                    description: description.en,
                    image: image,
                    symbol: symbol,
                    price_change_percentage_24h: market_data.price_change_percentage_24h,
                    current_price: market_data.current_price.usd,
                    total_volume: market_data.total_volume.usd,
                    circulating_supply: market_data.circulating_supply,
                    link: links.homepage[0],

                }

                await setDoc(docRef, {
                    favourites: { ...tempFavourites },
                }, {
                    merge: true,
                });

                console.log(tempFavourites);
                handleFavs(tempFavourites)
            }
        }
    }

    let listMarkup = [];

    if (!userFavs) {
        return null;
    } else if (Object.keys(userFavs).length === 0) {
        return <StyledEmptyWatchList className='watchlist'>
            <div className='rocket-img'>
                <img src={rocket_img} alt="empty-watchlist" />
            </div>
            <h5>
                No coins in the watchlist!
            </h5>
            <p>
                Looks like an empty watchlist. Add some coins to the list now.
            </p>
            <button onClick={() => { navigate("/") }}>Go Home</button>
        </StyledEmptyWatchList>
    } else {
        for (let coin in userFavs) {
            console.log(coin);

            const { market_cap_rank, image, name, symbol, current_price, price_change_percentage_24h, market_cap, total_volume, circulating_supply } = userFavs[coin];

            let id = coin;

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

            const markup = <StyledCurrencyData className="row row-currency-data" key={id}>
                <div className="coin-rank-fav-container">
                    <span>{market_cap_rank}</span>
                    <i
                        className={`fa fa-thin fa-star ${userFavs ? (userFavs[id] ? "fav-coin" : "") : ""}`}
                        onClick={() => favouriteHandler(id.toString())}
                    />
                </div>
                <div className="coin-name-container" id={`${id}-container`}
                    onClick={() => { routeHandler(id.toString()) }}
                >
                    <div className="coin-image">
                        <img src={image.thumb} alt={symbol} />
                    </div>
                    <div className="coin-name">{name}</div>
                    <div className="coin-symbol">{symbol}</div>
                </div>
                <div className="coin-price">
                    <span>${new_current_price}</span>
                    <div className={`coin-24h-change ${changeColor}`}>{new_price_change_percentage_24h}%</div>
                </div>
                <div className={`coin-24h-change ${changeColor}`}>{new_price_change_percentage_24h}%</div>
                <div className="coin-market-cap">${new_market_cap}</div>
                <div className="coin-volume">${new_total_volume}</div>
                <div className="coin-circulating-supply">{new_circulating_supply} {`${symbol}`.toUpperCase()}</div>
            </StyledCurrencyData>

            listMarkup.push(markup);

        }
        return <StyledWatchlist>
            <h3>Watchlist</h3>
            <StyledTable className="currency-container">
                <StyledHeader className="row row-header">
                    <div className="header-title-rank">
                        Rank
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
        </StyledWatchlist>
    }
}

const StyledEmptyWatchList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    align-items: center;
    position: absolute;
    top:0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    .rocket-img {
        width: 200px;
        color: white;
        img {
            width: 100%;
            object-fit: cover;
        }
    }
   
    h5 {
        color: rgb(255, 255, 255);
        font-size: 1.5rem;
        text-align: center;
    }
    p{
        color: rgb(255, 255, 255, 0.7);
        font-size: 1.5rem;
        text-align: center;
    }
    button {
        padding: 1rem 2rem;
        background-color: rgb(12, 123, 238);
        border: none;
        border-radius: 50px;
        font-size: 1.2rem;
        color: white;
        transition: box-shadow 250ms ease, transform 250ms ease;
        :hover {
            transform: translateY(-2%);
            cursor: pointer;
        }
        :active {
            box-shadow: none;
            transform: translateY(0);
        }
    }

    @media only screen and (max-width: 540px) {
        h5 {
            font-size: 1.3rem;
        }
        p{
            font-size: 1.3rem;
        }
    }
`

const StyledWatchlist = styled.div`
    color: white;
    display: flex;
    flex-direction: column;
    margin:  0 auto;
    width: 95%;
    h3 {
        font-size: 1.5rem;
        margin-bottom: 2rem;
    }

    @media only screen and (max-width: 540px) {
        width: 100%;
        h3{
            font-size: 1.2rem;
            padding: 1rem 1rem 0.5rem 1rem;
            margin-bottom: 0rem;
        }
    }
`

const StyledTable = styled.div`
    margin:  0 auto;
    padding: 1rem 3rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    border-radius: 10px ;
    background-color: rgb(25, 32, 84);
    box-shadow: 1px 1px 30px 15px rgb(9, 14, 52);

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

    @media only screen and (max-width: 540px) {
        width: 100%;
        border-radius: 0;
        padding: 1rem 0rem;
        box-shadow: none;
        border: none;
        background-color: transparent;
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

    @media only screen and (max-width: 540px) {
        &.row-header {
            padding: 0rem 1rem 1rem 1rem;
        }
        [class*="header-title-"]:nth-of-type(n+4) {
            display: none;
        }
    }
    @media only screen and (min-width: 542px) and (max-width: 1104px) {
        [class*="header-title-"]:last-of-type {
            display: none;
        }
    }

    `;


const StyledCurrencyData = styled.div`
    transition: background-color 200ms ease;
    [class*="coin-"] {
        width: 100%;
        text-align: right;
    }
    .coin-rank-fav-container {
        flex-basis: 40%;
        text-align: left;
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        i {
            -webkit-text-fill-color: transparent;
            -webkit-text-stroke-width: 1px;
            -webkit-text-stroke-color: rgb(255,255,255, 0.5);
            :hover {
                cursor: pointer;
                ::after {
                    content: "Add To Watchlist";
                    position: absolute;
                    -webkit-text-stroke-width: 0;
                    -webkit-text-fill-color: white;
                    font-family: "Noto Sans", sans-serif;
                    display: block;
                    font-size: 10px;
                    background-color: rgb(0,0,0,0.7);
                    padding: 1rem;
                    margin-top: 5px;
                    border-radius: 10px;
                }
            }
            &.fav-coin {
                -webkit-text-stroke-width: 0;
                -webkit-text-fill-color: yellow;
                :hover {
                    ::after {
                        content: "Remove from Watchlist";
                    }
                }
            }
        }
        @media only screen and (max-width: 540px) {
            i {
                display: none;
            }
        }
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

    .coin-price {
        .coin-24h-change {
            display: none;
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

    @media only screen and (max-width: 540px) {
        [class*="coin-"]:nth-of-type(n+4) {
            display: none;
        }
        .coin-price {
            .coin-24h-change {
                display: block;
            }
        }
    }
    @media only screen and (min-width: 542px) and (max-width: 1104px) {
        [class*="coin-"]:last-of-type {
            display: none;
        }
    }
`;

export default memo(Watchlist)