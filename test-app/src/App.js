import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './App.css';

import ImportDistance from './components/distance/ImportDistance';
import CreateDistance from './components/distance/CreateDistance';
import ListDistances from './components/distance/ListDistances';
import Home from './components/Home';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container>
            <Navbar.Brand href="/">Teste DataFrete</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
                {/* Nav Distances */}
                <NavDropdown title="Distances" id="nav-Distances">
                  <NavDropdown.Item href="/distances">List</NavDropdown.Item>
                  <NavDropdown.Item href="/distances/create">
                    New Distance
                  </NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href="/distances/import">Import CSV</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Routes>
          <Route index element={<Home />} />
          {/* Route Distances */}
          <Route path="/distances" element={<ListDistances />} />
          <Route path="/distances/create" element={<CreateDistance />} />
          <Route path="/distances/import" element={<ImportDistance />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
