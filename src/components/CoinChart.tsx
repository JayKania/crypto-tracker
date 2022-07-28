import axios from "axios";
import {
  CategoryScale, Chart as ChartJS, Filler,
  Legend, LinearScale, LineElement, PointElement, Title,
  Tooltip
} from "chart.js";
import { User } from "firebase/auth";
import { doc, DocumentData, getDoc, setDoc } from "firebase/firestore";
import parse from "html-react-parser";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { db } from "../firebaseConfig";
import { convertToInternationalCurrencySystem, numberWithCommas } from "../Utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface coinChartProps {
  userFavs: string[],
  handleFavs: any;
  user: User | undefined | null,
}

const CoinChart = ({ userFavs, handleFavs, user }: coinChartProps) => {
  const [coinPrices, setCoinPrices] = useState([]);
  const [days, setDays] = useState(1);
  const [coinData, setCoinData] = useState<any>([]);

  let { coinID } = useParams();

  const dayHandler = (noOfDays: number) => {
    setDays(noOfDays);
  };

  useEffect(() => {
    console.group("coin chart logs");

    const getCoinData = async () => {
      const { data: pricesData } = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinID}/market_chart?vs_currency=usd&days=${days}`
      );
      const { data: coinData } = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinID}`
      );
      console.dir(coinData);
      const {
        market_cap_rank,
        name,
        description,
        image,
        symbol,
        market_data,
        links,
      } = coinData;
      // console.dir(data.prices);
      setCoinData({
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
      });
      setCoinPrices(pricesData.prices);
    };

    getCoinData();
  }, [days]);

  let labels: any = [];

  if (coinPrices.length !== 0) {
    labels = coinPrices.map((coin) => {
      const date = new Date(coin[0]);
      if (days === 1) {
        return `${date.getHours()}:${date.getMinutes()}`;
      } else {
        return `${date.toLocaleDateString()}`;
      }
    });
  }

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Price Chart in USD",
        backgroundColor: "rgb(13, 20, 73, 0.5)",
        borderColor: "rgb(12, 123, 238)",
        pointRadius: 1,
        pointStyle: "rect",
        data: coinPrices.map((coin) => {
          return coin[1];
        }),
        fill: {
          target: "origin",
        },
      },
    ],
  };


  const options = {
    scales: {
      x: {
        // The axis for this scale is determined from the first letter of the id as `'x'`
        // It is recommended to specify `position` and / or `axis` explicitly.
        display: false
      },
    },
  };

  const createCoinMarkup = () => {
    let temp_current_price: string[] = Number(coinData.current_price)
      .toString()
      .split(".");
    // console.log(new_current_price);
    let new_current_price =
      numberWithCommas(temp_current_price[0]) +
      "." +
      (temp_current_price[1] || "00");

    // const new_current_price = current_price;
    let new_price_change_percentage_24h: string = Number(
      coinData.price_change_percentage_24h
    ).toFixed(2);

    const changeColor: string =
      new_price_change_percentage_24h[0] === "-"
        ? "price-decrease"
        : "price-increase";

    new_price_change_percentage_24h = Math.abs(
      Number(coinData.price_change_percentage_24h)
    ).toFixed(3);

    const new_market_cap: any = convertToInternationalCurrencySystem(
      coinData.market_cap
    );
    const new_total_volume: any = convertToInternationalCurrencySystem(
      coinData.total_volume
    );
    const new_circulating_supply: any = convertToInternationalCurrencySystem(
      coinData.circulating_supply
    );

    return (
      <StyledCurrencyData className="row row-currency-data">
        <div className="coin-rank-container">
          <span>{coinData.market_cap_rank}</span>
        </div>
        <div className="coin-name-container" id={`${coinID}-container`}>
          <div className="coin-name">{coinData.name}</div>
          <div className="coin-symbol">{coinData.symbol}</div>
        </div>
        <div className="coin-price">${new_current_price}</div>
        <div className={`coin-24h-change ${changeColor}`}>
          {new_price_change_percentage_24h} %
        </div>
        <div className="coin-market-cap">${new_market_cap}</div>
        <div className="coin-volume">${new_total_volume}</div>
        <div className="coin-circulating-supply">
          {new_circulating_supply} {`${coinData.symbol}`.toUpperCase()}
        </div>
      </StyledCurrencyData>
    );
  };

  const coinMarkup = createCoinMarkup();
  console.groupEnd();

  if (coinData.length === 0) {
    return <StyledSpinner className="spinner" />;
  }

  const favouriteHandler = async (id: string | undefined) => {
    if (!user) {
      alert("Please Login first!");
      return;
    }

    console.log(id);
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    const docData: DocumentData | undefined = docSnap.data();
    if (docData) {
      if (docData.favourites.includes(id)) {
        const tempFavourites = docData?.favourites.filter((coin: any) => {
          return coin !== id;
        });
        await setDoc(docRef, {
          favourites: [...tempFavourites]
        }, {
          merge: true,
        })
        handleFavs(tempFavourites)
      } else {
        await setDoc(docRef, {
          favourites: [...docData?.favourites, id],
        }, {
          merge: true,
        });
        handleFavs([...docData?.favourites, id])
      }
    }
  }

  return (
    <StyledCoinChartContainer>
      <StyledStatsContainer>
        <StyledHeader>
          <h4>Statistics</h4>
          <StyledFavDaysContainer className="fav-days-container">
            <i className={`fa fa-thin fa-star fa-2x ${coinID ? userFavs.includes(coinID.toString()) ? "fav-coin" : "" : ""}`} onClick={() => favouriteHandler(coinID?.toString())}></i>
            <StyldeDaysContainer>
              <div
                className={`days ${days === 1 ? "active" : ""}`}
                onClick={() => {
                  dayHandler(1);
                }}
              >
                24 Hours
              </div>
              <div
                className={`days ${days === 30 ? "active" : ""}`}
                onClick={() => {
                  dayHandler(30);
                }}
              >
                30 Days
              </div>
              <div
                className={`days ${days === 90 ? "active" : ""}`}
                onClick={() => {
                  dayHandler(90);
                }}
              >
                3 Months
              </div>
              <div
                className={`days ${days === 365 ? "active" : ""}`}
                onClick={() => {
                  dayHandler(365);
                }}
              >
                1 Year
              </div>
            </StyldeDaysContainer>
          </StyledFavDaysContainer>
        </StyledHeader>
        {window.screen.width > 542 ? <StyledChartContainer>
          <Line data={data} />
        </StyledChartContainer> : null}
        {window.screen.width <= 542 ? <StyledChartContainer className="mobile-chart">
          <Line data={data} options={options} />
        </StyledChartContainer> : null}
        <StyledCurrencyContainer>
          <StyledCurrencyHeader className="row-header">
            <div className="header-title-rank">Rank</div>
            <div className="header-title-name">Name</div>
            <div className="header-title-price">Price</div>
            <div className="header-title-change">24h %</div>
            <div className="header-title-market-cap">Market Cap</div>
            <div className="header-title-volume">Volume{"(24h)"}</div>
            <div className="header-title-csupply">Circulating Supply</div>
          </StyledCurrencyHeader>
          {coinMarkup}
        </StyledCurrencyContainer>
      </StyledStatsContainer>
      <StyledDescription>
        <h4>About {coinData.name}</h4>
        <div className="coin-data">
          {/* {coinData.length !== 0 ? (coinData.description ? coinData.description.split(". ")[0] : "Nothing to show here!") : ""} */}
          <p>
            {coinData.length !== 0
              ? coinData.description
                ? parse(coinData.description)
                : "Nothing to show here!"
              : ""}
          </p>
          <a className="site-link" href={coinData.link} target="_blank">
            For More Info
          </a>
        </div>
      </StyledDescription>
    </StyledCoinChartContainer>
  );
};

const StyledSpinner = styled.div`
  border: 5px solid transparent;
  border-top: 5px solid rgb(12, 123, 238);
  border-bottom: 5px solid rgb(12, 123, 238);
  border-radius: 50%;
  padding: 1rem;
  animation: spin infinite linear 1s;
  position: fixed;
  top: 45%;
  left: 47%;
  transform: translate(-50%, -50%);
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const StyledCoinChartContainer = styled.div`
  width: 95%;
  margin: 0 auto;
  @media only screen and (max-width: 540px) {
    width: 100%;
  }
`;

const StyledStatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 2rem;
  margin: 0 auto 4rem auto;
  background-color: rgb(25, 32, 84);
  border-radius: 10px;
  box-shadow: 1px 1px 30px 15px rgb(9, 14, 52);

  @media only screen and (max-width: 540px) {
    padding: 1rem;
    border-radius: 0;
  }
`;
const StyledChartContainer = styled.div`
  width: 100%;
`


const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  h4 {
    color: white;
    font-size: 1.5rem;
  }
  @media only screen and (max-width: 540px) {
    flex-direction: column;
    align-items: flex-start;
    h4 {
      font-size: 1.2rem;
    }
  }
`;

const StyledFavDaysContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
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
    width: 100%;
    flex-direction: row-reverse;
    justify-content: space-between;
    i {
      font-size: 1.2rem;
    }
  }
`

const StyldeDaysContainer = styled.div`
  display: flex;
  color: white;
  width: fit-content;
  border: 2px solid #8d8d8d;
  border-radius: 50px;
  overflow: hidden;
  /* flex-wrap: wrap; */
  .days {
    padding: 1rem 2rem;
    background-color: transparent;
    transition: background-color 250ms ease;
    &.active {
      background-color: rgb(13, 20, 73);
    }
    :hover {
      cursor: pointer;
    }
  }

  @media only screen and (max-width: 540px) {
    border-radius: 0;
    margin: 1rem 0;
    .days {
      padding: 0.5rem;
      font-size: 0.7rem;
    }
  }
`;

const StyledCurrencyContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  @media only screen and (max-width: 542px) {
    flex-direction: row;
    margin: 2rem auto 1rem auto;
  }
`

const StyledCurrencyHeader = styled.div`
  display: flex;
  width: 100%;
  gap: 1rem;
  margin: 2rem 0rem 1rem 0rem;
  &.row-header {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9em;
  }
  [class*="header-title-"] {
    width: 100%;
    text-align: left;
  }
  [class*="header-title-"]:first-of-type {
    flex-basis: 40%;
  }
  [class*="header-title-"]:nth-of-type(n + 3) {
    text-align: right;
  }

  
  @media only screen and (max-width: 540px) {
    margin-bottom: 0.5rem; 
    flex-direction: column;
    margin: 0;
    &.row-header {
      font-size: 0.7rem;
    }
    [class*="header-title-"] {
      width: fit-content;
      text-align: left;
    }
  }

`;

const StyledCurrencyData = styled.div`
  display: flex;
  color: whitesmoke;
  width: 100%;
  gap: 1rem;
  transition: background-color 200ms ease;
  font-size: 1rem;
  align-items: center;

  [class*="coin-"] {
    width: 100%;
    text-align: right;
  }
  .coin-rank-container {
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
      width: fit-content;
    }
    .coin-symbol {
      text-align: left;
      color: rgb(128, 138, 157);
      text-transform: uppercase;
    }
  }
  .coin-24h-change {
    &.price-increase {
      display: flex;
      align-items: center;
      justify-content: flex-end;
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
      display: flex;
      align-items: center;
      justify-content: flex-end;
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

  @media only screen and (max-width: 540px) {
    font-size: 0.7rem;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    [class*="coin-"] {
      width: fit-content;
    }
  }

`;

const StyledDescription = styled.div`
  width: 100%;
  padding: 2rem;
  margin: 0 auto 2rem auto;
  background-color: rgb(25, 32, 84);
  border-radius: 10px;
  box-shadow: 1px 1px 30px 15px rgb(9, 14, 52);
  h4 {
    color: white;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  .coin-data {
    display: flex;
    flex-direction: column;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.722);
    p {
      font-size: 0.95rem;
      a {
        color: white;
        text-decoration: none;
        font-style: italic;
      }
    }
    .site-link {
      margin-top: 1rem;
      color: white;
      font-style: italic;
      text-decoration: none;
      text-decoration: underline;
    }
  }
  @media only screen and (max-width: 540px) {
    padding: 1rem;
    border-radius: 0;
    /* background: transparent;
    box-shadow: none; */
    h4{
      font-size: 1.2rem;
    }
    .coin-data {
      font-size: 0.7rem;
      p {
        font-size: 0.7rem;
      }
    }
  }
`;

export default CoinChart;
