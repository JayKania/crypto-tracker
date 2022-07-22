import React from 'react'
import styled from 'styled-components'

const NavTableWrapper = (children: any) => {
    console.log(children.children[0]);
    const markup = children.children.map((child: any) => {
        return child;
    })
    return (
        <StyledNavTableWrapper>{markup}</StyledNavTableWrapper>
    )
}

const StyledNavTableWrapper = styled.div`
    @media only screen and (max-width: 540px) {
        background-color: rgb(25, 32, 84);
    }
`

export default NavTableWrapper