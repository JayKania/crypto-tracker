import styled from "styled-components"

interface mobileMenuProps {
    openMobileMenu: any,
    handleMobileMenu: any,
}

const MobileMenu = ({ openMobileMenu, handleMobileMenu }: mobileMenuProps) => {
    return (
        <>
            <StyledMobileMenuOverlay className={`${!openMobileMenu ? "hidden" : ""}`} onClick={handleMobileMenu} />
            <StyledMobileMenuContent className={`${!openMobileMenu ? "hidden" : ""}`}>
            </StyledMobileMenuContent>
        </>
    )
}

const StyledMobileMenuOverlay = styled.div`
    background-color: rgb(0,0,0,0.7);
    position: fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    &.hidden {
        display: none;
    }
`
const StyledMobileMenuContent = styled.div`
    color: white;
    width: 70%;
    position: fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    background-color: rgb(13, 20, 74);
    height: 100%;
    transition: transform 250ms ease;
    &.hidden {
        transform: translateX(-100%);
    }
`

export default MobileMenu