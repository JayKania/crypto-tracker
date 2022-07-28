import React, { memo, useEffect, useState } from 'react'
import Table from './Table'

interface watchlistProps {
    userFavs: string[]
}

const Watchlist = ({ userFavs }: watchlistProps) => {

    return (
        <>
            <div>Watchlist</div>

        </>
    )
}

export default memo(Watchlist)