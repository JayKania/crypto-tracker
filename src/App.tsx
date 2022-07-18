import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import CoinChart from "./components/CoinChart";
import Nav from './components/Nav';
import PaginationBar from "./components/PaginationBar";
import Table from "./components/Table";



const App = () => {

  const currency = "usd";
  const [coinsList, setCoinsList] = useState([]);
  const [searchedCoins, setSearcedCoins] = useState([]);
  const [page, setPage] = useState<number>(1);

  const pageHandler = (pageNo: number) => {
    setPage(pageNo);
  }


  useEffect(() => {
    const getCoinsData = async () => {
      const response_1 = await axios(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=150&page=1&sparkline=false`);
      const response_2 = await axios(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=150&page=2&sparkline=false`);
      const response: any = [...response_1.data, ...response_2.data];
      setCoinsList(response);
    }
    getCoinsData();
  }, []);

  const tablePropsObj = {
    coinsList: coinsList,
    searchedCoins: searchedCoins,
    page: page
  }

  const navPropsObj = {
    coinsList: coinsList,
    setSearcedCoins: setSearcedCoins
  }

  const pagePropsObj = {
    coinsList: coinsList,
    page: page,
    pageHandler: pageHandler
  }

  return (
    <StyledApp className="App">
      <Nav {...navPropsObj} />
      {/* <CoinChart /> */}
      <Table {...tablePropsObj} />
      <PaginationBar {...pagePropsObj} />
    </StyledApp>
  );
}


const StyledApp = styled.div`
    padding: 2rem 0;
    font-size: 14px;
    @media only screen and (max-width: 320px) {
        padding: 0;
    }
`;


export default App;
