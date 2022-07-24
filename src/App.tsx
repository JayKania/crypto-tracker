import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import CoinChart from "./components/CoinChart";
import Nav from './components/Nav';
import PaginationBar from "./components/PaginationBar";
import Table from "./components/Table";
import { Routes, Route } from "react-router-dom";
import NavTableWrapper from "./components/NavTableWrapper";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Modal from "./components/Modal";

const App = () => {

  const currency = "usd";
  const [coinsList, setCoinsList] = useState([]);
  const [searchedCoins, setSearcedCoins] = useState([]);
  const [page, setPage] = useState<number>(1);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openSignUpModal, setOpenSignUpModal] = useState(false);

  const pageHandler = useCallback((pageNo: number) => {
    setPage(pageNo);
  }, [page])

  const loginModalHandler = (event: any) => {
    if (event) {
      event.preventDefault();
    };
    setOpenLoginModal(!openLoginModal);
  }

  const signupModalHandler = (event: any) => {
    if (event) {
      event.preventDefault();
    };
    setOpenSignUpModal(!openSignUpModal);
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
    setSearcedCoins: setSearcedCoins,
    page: page,
    pageHandler: pageHandler,
    loginModalHandler: loginModalHandler,
    signupModalHandler: signupModalHandler,
  }

  const pagePropsObj = {
    coinsList: coinsList,
    searchedCoins: searchedCoins,
    page: page,
    pageHandler: pageHandler
  }

  return (
    <StyledApp className="App">
      <Routes>
        <Route path="/" element={
          coinsList.length === 0 ? <StyledSpinner className="spinner" /> :
            <>
              <NavTableWrapper>
                <Nav {...navPropsObj} />
                <Table {...tablePropsObj} />
              </NavTableWrapper>
              <PaginationBar {...pagePropsObj} />
            </>}
        />
        <Route path="coins" element={<CoinChart />}>
          <Route path=":coinID" element={<CoinChart />} />
        </Route>
      </Routes>
      <Modal openModal={openLoginModal} closeModal={loginModalHandler}>
        <Login />
      </Modal>
      <Modal openModal={openSignUpModal} closeModal={signupModalHandler} >
        <SignUp />
      </Modal>
    </StyledApp>
  );
}


const StyledApp = styled.div`
    padding: 2rem 0;
    font-size: 14px;
    @media only screen and (max-width: 540px) {
        padding: 0;
    }
`;

const StyledSpinner = styled.div`
    border: 5px solid transparent;
    border-top: 5px solid rgb(12, 123, 238);
    border-bottom: 5px solid rgb(12, 123, 238);
    border-radius: 50%;
    width:10px;
    padding: 1rem;
    animation: spin infinite linear 1s;
    position: absolute;
    left: 0;
    right: 0;
    top: calc(50% - 2rem);
    margin: 0 auto;

    @keyframes spin {
      from{
          transform: rotate(0deg);   
      }
      to {
          transform: rotate(360deg);
      }
    }
`

export default App;
