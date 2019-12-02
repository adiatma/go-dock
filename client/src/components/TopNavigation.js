// @flow
import * as React from 'react'
import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  Container,
  NavLink
} from 'reactstrap'

function TopNavigation(): React.Node {
  const [isOpen, setIsOpen] = React.useState(false)
  const toggle = () => setIsOpen(!isOpen)

  return (
    <div style={{marginBottom: '1rem'}}>
      <Container>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">Go Dock</NavbarBrand>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink
                  href={`https://github.com/adiatma/go-dock`}
                >
                  Github
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </Container>
    </div>
  )
}

export default TopNavigation
