import { useEffect, useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Badge,
  Form,
  DropdownButton,
  Dropdown,
  Button,
  InputGroup,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { getCategories } from "../redux/actions/categoryActions";
import { logout } from "../redux/actions/userAction";
import socketIOClient from "socket.io-client";
import {
  removeChatRoom,
  setChatRooms,
  setMessageReceived,
  setSocket,
} from "../redux/actions/chatActions";

function HeaderComponent() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.userRegisterLogin);
  const itemsCount = useSelector((state) => state.cart.itemsCount);
  const { categories } = useSelector((state) => state.getCategories);
  const { messageReceived } = useSelector((state) => state.adminChat);

  const [searchCategoryToggle, setSearchCategoryToggle] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]); // we can also use empty array but sometime react gives error needs dependency array that's why passing dispatch in dependency array

  const submitHandler = (e) => {
    if (e.keyCode && e.keyCode !== 13) return;
    e.preventDefault();
    if (searchQuery.trim()) {
      if (searchCategoryToggle === "All") {
        navigate(`/product-list/search/${searchQuery}`);
      } else {
        navigate(
          `/product-list/category/${searchCategoryToggle.replace(
            /\//g,
            ","
          )}/search/${searchQuery}`
        );
      }
    } else if (searchCategoryToggle !== "All") {
      navigate(
        `/product-list/category/${searchCategoryToggle.replace(/\//g, ",")}`
      );
    } else {
      navigate("/product-list");
    }
  };

  useEffect(() => {
    if (userInfo.isAdmin) {
      var audio = new Audio("/audio/notification.mp3")
      const socket = socketIOClient();
      socket.emit("admin connected with server", "Admin" + Math.floor(Math.random()*10000000000))
      socket.on("server sends message from client to admin", ({user, message }) => {
        dispatch(setSocket(socket));
        // console.log(message)
        // let chatRooms ={adsfasdSocketID: [{"client": "sdfas"},{"client": "sdfas"},{"admin": "sdfas"}]}
        dispatch(setChatRooms(user, message));
        dispatch(setMessageReceived(true));
        audio.play()
      });
      socket.on("disconnected", ({reason, socketId}) => {
        // console.log(socketId,reason)
        dispatch(removeChatRoom(socketId))
      })
      return () => socket.disconnect() // when leave the page socket will disconnect
    }
  }, [dispatch, userInfo.isAdmin]);

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <LinkContainer to={"/"}>
          <Navbar.Brand href="/">Sk Store.in</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <InputGroup>
              <DropdownButton
                id="dropdown-basic-button"
                title={searchCategoryToggle}
              >
                <Dropdown.Item onClick={() => setSearchCategoryToggle("All")}>
                  All
                </Dropdown.Item>
                {categories.map((category, idx) => (
                  <Dropdown.Item
                    key={idx}
                    onClick={() => setSearchCategoryToggle(category.name)}
                  >
                    {category.name}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
              <Form.Control
                type="text"
                placeholder="Search Amazon.in"
                onKeyUp={submitHandler}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="warning" onClick={submitHandler}>
                <i className="bi bi-search"></i>
              </Button>
            </InputGroup>
          </Nav>

          <Nav>
            {userInfo.isAdmin ? (
              <LinkContainer to={"/admin/orders"}>
                <Nav.Link>
                  Admin
                  {messageReceived && (
                    <span className="position-absolute top-1 start-10 translate-middle p-2 bg-danger border-light rounded-circle"></span>
                  )}
                </Nav.Link>
              </LinkContainer>
            ) : userInfo.name && !userInfo.isAdmin ? (
              <NavDropdown
                title={`${userInfo.name} ${userInfo.lastName}`}
                id="collasible-nav-dropdown"
              >
                <NavDropdown.Item
                  eventKey={"/user/my-orders"}
                  as={Link}
                  to="/user/my-orders"
                >
                  My orders
                </NavDropdown.Item>
                <NavDropdown.Item eventKey={"/user"} as={Link} to="/user">
                  My profile
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => dispatch(logout())}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                {" "}
                <LinkContainer to={"/login"}>
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to={"/register"}>
                  <Nav.Link>Register</Nav.Link>
                </LinkContainer>
              </>
            )}

            <LinkContainer to={"/cart"}>
              <Nav.Link>
                <Badge pill bg="danger">
                  {itemsCount === 0 ? "" : itemsCount}
                </Badge>
                <i className="bi bi-cart3"></i>
                <span className="ms-1">CART</span>
              </Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default HeaderComponent;
