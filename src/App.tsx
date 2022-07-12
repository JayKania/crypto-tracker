import styled from "styled-components";
import Nav from './components/Nav';

const App = () => {
  return (
    <StyledApp className="App">
      <Nav />
    </StyledApp>
  );
}


const StyledApp = styled.div`
    background-image: linear-gradient(to bottom right, #1F276F, #0C144A);
    /* height: 100vh; */
`;


export default App;
