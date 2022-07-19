import { memo, useId } from "react";
import styled from "styled-components";

interface pageProps {
    coinsList: coin[],
    searchedCoins: coin[],
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

const PaginationBar = ({ coinsList, searchedCoins, page, pageHandler }: pageProps) => {

    const noOfPages: number = searchedCoins.length === 0 ? Math.ceil(coinsList.length / 30) : Math.ceil(searchedCoins.length / 30);

    let listMarkup: any[] = [];

    console.log("hello");


    for (let i = 1; i <= noOfPages; i++) {
        listMarkup.push(<StyledPageNumber className={`page-number-${i} ${page === i ? "active" : ""}`} key={i} onClick={() => { pageHandler(i) }} >{i}</StyledPageNumber>);
    }

    return (
        <StyledPaginationBarContainer className="pagination-container">
            <StyledPageNumbersContainer>
                <div className={`prev-page-container ${page === 1 ? "disable" : ""}`} onClick={() => { pageHandler(page !== 1 ? page - 1 : page) }}>
                    <div className={`prev-page ${page === 1 ? "disable" : ""}`}  ></div>
                </div>
                {listMarkup}
                <div className={`next-page-container ${page === noOfPages ? "disable" : ""}`} onClick={() => { pageHandler(page !== noOfPages ? page + 1 : page) }}>
                    <div className={`next-page ${page === noOfPages ? "disable" : ""}`}  ></div>
                </div>
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
  .prev-page-container {
    padding: 0.8rem;
    border-radius: 50%;
    transition: background-color 200ms ease;
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
    }
    :hover {
        cursor: pointer;
        background-color: rgb(25, 32, 84);
        &.disable {
            cursor: default;
            background-color: transparent;
        }
    }
  }
  .next-page-container {
    padding: 0.8rem;
    border-radius: 50%;
    transition: background-color 200ms ease;
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
    }
    :hover {
        cursor: pointer;
        background-color: rgb(25, 32, 84);
        &.disable {
            cursor: default;
            background-color: transparent;
        }
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

export default memo(PaginationBar);
