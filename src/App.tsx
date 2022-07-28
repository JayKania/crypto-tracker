import axios from "axios";
import { signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import CoinChart from "./components/CoinChart";
import Error from "./components/Error";
import Login from "./components/Login";
import MobileMenu from "./components/MobileMenu";
import Modal from "./components/Modal";
import Nav from './components/Nav';
import NavTableWrapper from "./components/NavTableWrapper";
import PaginationBar from "./components/PaginationBar";
import RequireAuth from "./components/RequireAuth";
import SignUp from "./components/SignUp";
import Table from "./components/Table";
import Watchlist from "./components/Watchlist";
import { auth, db } from "./firebaseConfig";

const App = () => {

  const currency = "usd";
  const [coinsList, setCoinsList] = useState([]);
  const [searchedCoins, setSearcedCoins] = useState([]);
  const [page, setPage] = useState<number>(1);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openSignUpModal, setOpenSignUpModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userFavs, setUserFavs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);

  const pageHandler = useCallback((pageNo: number) => {
    setPage(pageNo);
  }, [page])

  const loginModalHandler = () => {
    if (openSignUpModal) setOpenSignUpModal(false);
    setOpenLoginModal(!openLoginModal);
  }

  const signupModalHandler = () => {
    if (openLoginModal) setOpenLoginModal(false);
    setOpenSignUpModal(!openSignUpModal);
  }

  const handleFavs = (favs: string[]) => {
    setUserFavs([...favs]);
  }

  const handleLogout = () => {
    signOut(auth);
    handleFavs([]);
  }

  const handleMobileMenu = () => {
    setOpenMobileMenu(!openMobileMenu);
  }

  useEffect(() => {
    auth.onAuthStateChanged(userData => {
      console.log(userData);
      setUser(userData);
      setLoading(false);
      getUserFavs();
    })


    const getCoinsData = async () => {
      const response_1 = await axios(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=150&page=1&sparkline=false`);
      const response_2 = await axios(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=150&page=2&sparkline=false`);
      const response: any = [...response_1.data, ...response_2.data];
      setCoinsList(response);
    }
    getCoinsData();

    const getUserFavs = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        const docData = docSnap.data();
        if (docData) {
          handleFavs([...docData.favourites]);
        }
      }
    }

    getUserFavs();
  }, [loading]);

  const tablePropsObj = {
    coinsList: coinsList,
    searchedCoins: searchedCoins,
    page: page,
    user: user,
    userFavs: userFavs,
    handleFavs: handleFavs,
  }

  const navPropsObj = {
    coinsList: coinsList,
    setSearcedCoins: setSearcedCoins,
    page: page,
    pageHandler: pageHandler,
    loginModalHandler: loginModalHandler,
    signupModalHandler: signupModalHandler,
    user: user,
    handleLogout: handleLogout,
    handleMobileMenu: handleMobileMenu,
  }

  const pagePropsObj = {
    coinsList: coinsList,
    searchedCoins: searchedCoins,
    page: page,
    pageHandler: pageHandler,
    // user: user
  }

  const coinChartPropsObj = {
    userFavs: userFavs,
    handleFavs: handleFavs,
    user: user,
  }

  const loginPropsObj = {
    loginModalHandler: loginModalHandler,
    signupModalHandler: signupModalHandler,
  }

  const signupPropsObj = {
    loginModalHandler: loginModalHandler,
    signupModalHandler: signupModalHandler,
  }

  const watchlistPropsObj = {
    userFavs: userFavs
  }

  const mobileMenuPropsObj = {
    openMobileMenu: openMobileMenu,
    handleMobileMenu: handleMobileMenu,
    loginModalHandler: loginModalHandler,
    signupModalHandler: signupModalHandler,
    user: user,
    handleLogout: handleLogout,
  }

  if (loading) {
    return <StyledSpinner className="spinner" />
  }

  return (
    <StyledApp className="App">
      <Routes>
        <Route path="/" element={
          <>
            <NavTableWrapper>
              <Nav {...navPropsObj} />
              <Table {...tablePropsObj} />
            </NavTableWrapper>
            <PaginationBar {...pagePropsObj} />
          </>}>
        </Route>
        <Route path="coins" element={<Navigate to="/" replace />} />
        <Route path="coins/:coinID" element={<CoinChart {...coinChartPropsObj} />} />
        <Route path="watchlist" element={
          <RequireAuth user={user}>
            <Watchlist {...watchlistPropsObj} />
          </RequireAuth>} />
        <Route path="*" element={<Error />} />
      </Routes>
      <Modal openModal={openLoginModal} closeModal={loginModalHandler}>
        <Login {...loginPropsObj} />
      </Modal>
      <Modal openModal={openSignUpModal} closeModal={signupModalHandler} >
        <SignUp {...signupPropsObj} />
      </Modal>
      <MobileMenu {...mobileMenuPropsObj} />
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
    padding: 1rem;
    animation: spin infinite linear 1s;
    position: fixed;
    top: 45%;
    left: 47%;
    transform: translate(-50%, -50%);

    @keyframes spin {
      from{
          transform: rotateZ(0deg);   
      }
      to {
          transform: rotateZ(360deg);
      }
    }
`

export default App;
