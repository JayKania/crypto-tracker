import { useState } from "react";
import styled from "styled-components";

interface pageProps {
    coinsList: coin[];
    page: number,
    pageHandler: any
}

interface coin {
    id: number;
    market_cap_rank: number;
    image: string;
    name: string;
    symbol: string;
    current_price: number;
    price_change_percentage_24h: number;
    market_cap: number;
    total_volume: number;
    circulating_supply: number;
}

const PaginationBar = ({ coinsList, page, pageHandler }: pageProps) => {

    const noOfPages: number = coinsList.length / 30;

    let listMarkup: any[] = [];

    for (let i = 1; i <= noOfPages; i++) {
        listMarkup.push(<StyledPageNumber className={`page-number-${i} ${page === i ? "active" : ""}`} onClick={() => { pageHandler(i) }} >{i}</StyledPageNumber>);
    }

    return (
        <StyledPaginationBarContainer className="pagination-container">
            <StyledPageNumbersContainer>
                <div className={`prev-page ${page === 1 ? "disable" : ""}`} onClick={() => { pageHandler(page !== 1 ? page - 1 : page) }} ></div>
                {listMarkup}
                <div className={`next-page ${page === noOfPages ? "disable" : ""}`} onClick={() => { pageHandler(page !== noOfPages ? page + 1 : page) }} ></div>
            </StyledPageNumbersContainer>
        </StyledPaginationBarContainer>
    );
};

const StyledPaginationBarContainer = styled.div`
  display: flex;
  color: #cdcdcd;
  justify-content: center;
  margin: 2rem 0;
`;

const StyledPageNumbersContainer = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  justify-content: center;
  .prev-page {
    border: solid #cdcdcd;
    border-width: 0 2px 2px 0;
    padding: 2px;
    transform: rotate(135deg);
    &.disable {
        border-color: #4f4f4f;
        :hover {
            cursor: default;
        }
    }
    :hover {
        cursor: pointer;
    }
  }
  .next-page {
    border: solid #cdcdcd;
    border-width: 0 2px 2px 0;
    padding: 2px;
    transform: rotate(-45deg);
    &.disable {
        border-color: #4f4f4f;
        :hover {
            cursor: default;
        }
    }
    :hover {
        cursor: pointer;
    }
  }
`;

const StyledPageNumber = styled.div`
        border-radius: 50%;
        padding: 0.5rem 0.8rem;
        transition: background-color 200ms ease;
        &.page-number-10 {
            padding: 0.5rem 0.6rem;
        }
        &.active {
            background-color: rgb(25, 32, 84);
        }
        :hover {
            cursor: pointer;
            background-color: rgb(25, 32, 84);

        }
`;

export default PaginationBar;
