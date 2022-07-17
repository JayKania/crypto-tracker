import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Nav from './components/Nav';
import Table from "./components/Table";

const App = () => {

  const currency = "usd";
  const [coinsList, setCoinsList] = useState([]);
  const [searchedCoins, setSearcedCoins] = useState([]);

  useEffect(() => {
    const getCoinsData = async () => {
      const response = await axios(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`);
      setCoinsList(response.data);
    }
    getCoinsData();
  }, []);

  const tablePropsObj = {
    coinsList: coinsList,
    searchedCoins: searchedCoins
  }

  const navPropsObj = {
    coinsList: coinsList,
    setSearcedCoins: setSearcedCoins
  }

  return (
    <StyledApp className="App">
      <Nav {...navPropsObj} />
      <Table {...tablePropsObj} />
    </StyledApp>
  );
}


const StyledApp = styled.div`
    /* background-image: linear-gradient(to bottom right, #1F276F, #0C144A); */
    /* height: 100vh; */
    padding: 2rem 0;
    font-size: 14px;
`;


export default App;
