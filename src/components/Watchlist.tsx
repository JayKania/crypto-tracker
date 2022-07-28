import React, { memo, useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Table from './Table'
import rocket_img from "../assets/rocket.png"

interface watchlistProps {
    userFavs: string[]
}

const Watchlist = ({ userFavs }: watchlistProps) => {

    let navigate = useNavigate();

    if (userFavs.length === 0) {
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
    }
    return (
        <>
            <div>Watchlist</div>
        </>
    )
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
        box-shadow: 1px 1px 3px 3px rgb(0, 4, 111, 0.5);
        :hover {
            cursor: pointer;
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

export default memo(Watchlist)