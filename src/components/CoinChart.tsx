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

    useEffect(() => {
        console.group("coin chart logs")

        const getCoinData = async () => {
            const { data } = await axios.get("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1");
            // console.dir(data.prices);
            setCoinData(data.prices);
        }

        getCoinData();

    }, [])



    let labels: any = [];

    if (coinData.length !== 0) {
        labels = coinData.map(coin => {
            const date = new Date(coin[0]);
            return `${date.getHours()}:${date.getMinutes()}`;
        })

    }

    const data = {
        labels: labels,
        datasets: [{
            label: 'BTC Price Chart in USD',
            backgroundColor: 'rgb(25, 32, 84)',
            borderColor: 'white',
            pointRadius: 3,
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
        </StyledLineChartContainer>
    )
}

const StyledLineChartContainer = styled.div`
    width: 95%;
    margin: 0 auto;
`

export default CoinChart