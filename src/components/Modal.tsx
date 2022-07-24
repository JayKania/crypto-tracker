import { createPortal } from "react-dom"
import styled from "styled-components"

type Props = {
    children: any,
    openModal: boolean,
    closeModal: any,
}

const Modal = ({ children, openModal, closeModal }: Props) => {

    if (!openModal) {
        return null;
    }

    const closeModalHandler = (event: any) => {
        if (event.target.id === "modal") {
            closeModal();
        }
    }

    return createPortal(
        <StyledModalContainer id="modal" onClick={closeModalHandler}>
            <StyledModalcontent id="modal-content">{children}</StyledModalcontent>
        </StyledModalContainer >, document.getElementById("root") as HTMLElement
    )
}


const StyledModalContainer = styled.div`
    z-index: 1000;
    position: fixed;
    top: 0;
    left:0;
    right: 0;
    bottom: 0;
    background-color: rgb(0,0,0,0.7);
`

const StyledModalcontent = styled.div`
    z-index: 1000;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    @media only screen and (max-width: 540px) {
        width: 100%;
    }
`

export default Modal