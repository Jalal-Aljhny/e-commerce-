import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Logo from "./Logo";
import { useContext, useState } from "react";
import { MainContext } from "../services/context/MainContext";
import { NavLink, useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";
import { Popover } from "@mui/material";
import CartPage from "../pages/cart/Cart";
const pages = ["Products", "Categories", "Contact us"];
const settings = ["Profile", "Dashboard", "Logout"];
import SearchIcon from "@mui/icons-material/Search";

function Header() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { isAuth, logout, items, categories, handleMode } =
    useContext(MainContext);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  //
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  //

  return (
    <AppBar
      position="static"
      sx={{
        mt: 0,
        mx: 0,
        bgcolor: "#fff",
        boxShadow: "none",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ display: "flex", alignItems: "center" }}>
          <Logo />

          <Box
            sx={{
              flexGrow: 0,
              marginLeft: "auto",
              display: { xs: "flex", md: "none" },
              color: "#000",
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" }, color: "#000" }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography
                    sx={{ textAlign: "center" }}
                    onClick={() => {
                      if (page.toLocaleLowerCase() == "categories") {
                        navigate(`/categories?name=${categories[0].name}`);
                      } else {
                        navigate(`/${page.toLocaleLowerCase().split(" ")[0]}`);
                      }
                    }}
                  >
                    {page}
                  </Typography>
                </MenuItem>
              ))}
              {!isAuth ? (
                <MenuItem onClick={handleCloseNavMenu}>
                  <Typography
                    sx={{
                      marginInline: "auto",
                      color: "#2d82d6",
                      transitionDuration: "300ms",
                      fontWeight: "bold",
                      "&:hover": {
                        textDecorationLine: "underline",
                      },
                    }}
                    onClick={() => {
                      navigate("/register");
                    }}
                  >
                    register
                  </Typography>
                </MenuItem>
              ) : null}
              {!isAuth ? (
                <MenuItem onClick={handleCloseNavMenu}>
                  <Typography
                    sx={{
                      marginInline: "auto",
                      color: "#2d82d6",
                      transitionDuration: "300ms",
                      fontWeight: "bold",
                      "&:hover": {
                        textDecorationLine: "underline",
                      },
                    }}
                    onClick={() => {
                      navigate("/login");
                    }}
                  >
                    login
                  </Typography>
                </MenuItem>
              ) : null}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => {
                  if (page.toLocaleLowerCase() == "categories") {
                    navigate(`/categories?name=${categories[0].name}`);
                  } else {
                    navigate(`/${page.toLocaleLowerCase().split(" ")[0]}`);
                  }
                  handleCloseNavMenu();
                }}
                sx={{
                  my: 2,
                  color: "#000",
                  padding: "0.5rem",
                  borderRadius: "1rem",
                  display: "block",
                  marginInline: "1rem",
                  transitionDuration: "300ms",
                  "&:hover": {
                    boxShadow: "2px 1px 10px #3335",
                  },
                  boxShadow: window.location.href.endsWith(
                    `/${page.toLocaleLowerCase().split(" ")[0]}`
                  )
                    ? "2px 5px 5px #3335"
                    : "",
                }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            {isAuth ? (
              <>
                <Badge
                  badgeContent={items.length}
                  sx={{
                    color: "#bdbdbd",
                    cursor: "pointer",
                    marginRight: "0.5rem",
                    transitionDuration: "300ms",
                    "&:active": {
                      scale: 0.9,
                    },
                    "&:hover": {
                      scale: 1.2,
                    },
                  }}
                  color="success"
                >
                  <IconButton
                    onClick={() => {
                      navigate("/products");
                      handleMode("search");
                    }}
                  >
                    <SearchIcon />
                  </IconButton>
                </Badge>
                <Badge
                  badgeContent={items.length}
                  sx={{
                    color: "#bdbdbd",
                    cursor: "pointer",
                    marginRight: "0.5rem",
                    transitionDuration: "300ms",
                    "&:active": {
                      scale: 0.9,
                    },
                    "&:hover": {
                      scale: 1.2,
                    },
                  }}
                  color="success"
                >
                  <IconButton
                    // onClick={() => {
                    //   navigate("/cart");
                    // }}
                    onClick={handleClick}
                    aria-describedby={id}
                  >
                    <ShoppingCartIcon />
                  </IconButton>
                </Badge>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="user" src="/static/images/avatar/2.jpg" />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <Typography
                // style={{
                //   display: "flex",
                //   gap: "1rem",
                // }}
                sx={{ display: { xs: "none", md: "flex" }, gap: "1rem" }}
              >
                <Badge
                  badgeContent={items.length}
                  sx={{
                    color: "#bdbdbd",
                    cursor: "pointer",
                    marginRight: "0.5rem",
                    transitionDuration: "300ms",
                    "&:active": {
                      scale: 0.9,
                    },
                    "&:hover": {
                      scale: 1.2,
                    },
                  }}
                  color="success"
                >
                  <IconButton
                    onClick={() => {
                      navigate("/products");
                      handleMode("search");
                    }}
                  >
                    <SearchIcon />
                  </IconButton>
                </Badge>
                <NavLink
                  to={"/register"}
                  className={({ isActive }) => {
                    return isActive ? `nav_link_active` : `nav_link`;
                  }}
                >
                  Register
                </NavLink>
                <NavLink
                  to={"/login"}
                  className={({ isActive }) => {
                    return isActive ? `nav_link_active` : `nav_link`;
                  }}
                >
                  Log in
                </NavLink>
              </Typography>
            )}
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) =>
                setting.toLocaleLowerCase() == "logout" ? (
                  <MenuItem
                    key={setting}
                    onClick={async () => {
                      await logout();
                      handleCloseUserMenu();
                    }}
                  >
                    <Typography
                      sx={{
                        textAlign: "center",
                        color: "red",
                        fontWeight: "bold",
                      }}
                    >
                      {setting}
                    </Typography>
                  </MenuItem>
                ) : setting.toLocaleLowerCase() == "dashboard" ? (
                  <MenuItem
                    key={setting}
                    onClick={() => {
                      handleCloseUserMenu();
                      navigate("/dashboard");
                    }}
                  >
                    {/* <div>
                      <Accordion
                        sx={{
                          boxShadow: "none !important",
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ArrowDropDownIcon />}
                          aria-controls="panel2-content"
                          id="panel2-header"
                          sx={{
                            border: "none",
                            padding: "0",
                          }}
                        >
                          <Typography component="span">{setting}</Typography>
                        </AccordionSummary>
                        <AccordionDetails
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                          }}
                        >
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            sx={{ borderRadius: "1rem" }}
                          >
                            Update name
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            sx={{ borderRadius: "1rem" }}
                          >
                            Delete profile
                          </Button>
                        </AccordionDetails>
                      </Accordion>
                    </div> */}

                    <Typography sx={{ textAlign: "center" }}>
                      {setting}
                    </Typography>
                  </MenuItem>
                ) : (
                  <MenuItem
                    key={setting}
                    onClick={() => {
                      handleCloseUserMenu();
                      navigate(`/${setting.toLocaleLowerCase()}`);
                    }}
                  >
                    <Typography sx={{ textAlign: "center" }}>
                      {setting}
                    </Typography>
                  </MenuItem>
                )
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{
          transform: "translate(-15px)",
        }}
      >
        <CartPage onClose={handleClose} checkout={true} />
      </Popover>
    </AppBar>
  );
}
export default Header;
