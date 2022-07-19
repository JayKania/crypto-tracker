import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Line } from "react-chartjs-2";
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const CoinChart = () => {

    const [coinData, setCoinData] = useState([]);
    const [days, setDays] = useState(1);

    let { coinID } = useParams();

    const dayHandler = (noOfDays: number) => {
        setDays(noOfDays);
    }

    useEffect(() => {
        console.group("coin chart logs")

        const getCoinData = async () => {
            const { data } = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinID}/market_chart?vs_currency=usd&days=${days}`);
            // console.dir(data.prices);
            setCoinData(data.prices);
        }

        getCoinData();

    }, [days])



    let labels: any = [];

    if (coinData.length !== 0) {
        labels = coinData.map(coin => {
            const date = new Date(coin[0]);
            if (days === 1) {
                return `${date.getHours()}:${date.getMinutes()}`;
            } else {
                return `${date.toLocaleDateString()}`
            }
        })

    }

    const data = {
        labels: labels,
        datasets: [{
            label: 'Price Chart in USD',
            backgroundColor: 'rgb(25, 32, 84)',
            borderColor: 'white',
            pointRadius: 1,
            pointStyle: "rect",
            data: coinData.map(coin => {
                return coin[1];
            }),
            fill: true,
        }]
    };

    console.groupEnd()

    return (
        <StyledLineChartContainer>
            <Line data={data} />
            <StyldeDaysContainer>
                <div className={`days ${days === 1 ? "active" : ""}`} onClick={() => { dayHandler(1) }}>24 Hours</div>
                <div className={`days ${days === 30 ? "active" : ""}`} onClick={() => { dayHandler(30) }}>30 Days</div>
                <div className={`days ${days === 90 ? "active" : ""}`} onClick={() => { dayHandler(90) }}>3 Months</div>
                <div className={`days ${days === 365 ? "active" : ""}`} onClick={() => { dayHandler(365) }}>1 Year</div>
            </StyldeDaysContainer>
        </StyledLineChartContainer>
    )
}

const StyledLineChartContainer = styled.div`
    width: 95%;
    margin: 0 auto;
`
const StyldeDaysContainer = styled.div`
    display: flex;
    color: white;
    gap: 2rem;
    margin: 2rem auto;
    width: fit-content;
    .days {
        border: 2px solid white;
        padding: 1rem 2rem;
        border-radius: 5px;
        background-color: transparent;
        transition: background-color 250ms ease;
        &.active {
            background-color: rgb(25, 32, 84);
        }
        :hover {
            cursor: pointer;
        }
    }

`

export default CoinChart