// @flow
import * as React from 'react';
import { Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom'

function TopNavigation(): React.Node {
  const [isOpen, setIsOpen] = React.useState(false)
  const toggle = () => setIsOpen(!isOpen)

  return (
    <div style={{ marginBottom: "1rem" }}>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">Go Dock</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <Link to={`/images`} style={{ textDecoration: 'none' }}>Images</Link>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  )
}

export default TopNavigation
