"use client";

import { AppBar, Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, Container, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Typography } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu'
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Logout from '@mui/icons-material/Logout';
import { 
  ProductionQuantityLimits,
  AccountCircle,
  MoreVert,
  Dashboard,
} from '@mui/icons-material';

import React, { useEffect, useState } from "react";
import { deepPurple } from "@mui/material/colors";
import { useRouter } from "next/navigation";
import { ConfirmSweet, ToastSweet, localGet } from "@/service/helper";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { AUTH } from "@/service/firebase";
import { fa9, fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(fas, fab, fa9);
export default function AdminLayout({
    children,
  }: {
    children: React.ReactNode
  }) {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const router = useRouter();
    const [user, setUser] = useState<any>({});
    const [company, setCompany] = useState<any>({});
    const [branch, setBranch] = useState<any>({});

    useEffect(() => {
      autoload();
    
      return () => {
        
      }
    }, []);
    
    const autoload = async() => {
    //   console.log("autoload");
    //   console.log(AUTH.currentUser);
    //   const api = await fetch('/api/whoami', {
    //     method: 'GET',
    //     headers :  {
    //         'Content-Type': 'application/json',
    //         'ApiKey': '20240101',
    //     }
    //   });

    // const res = await api.json();
    // console.log(res);
      const localUser = await localGet('@user');
      console.log(localUser);
      setUser(localUser);

      const localCompany = await localGet('@company');
      console.log(localCompany);
      setCompany(localCompany);

      const localBranch = await localGet('@branch');
      console.log(localBranch);
      setBranch(localBranch);

      onAuthStateChanged(AUTH, (user) => {
        
        if (user) {
          console.log("logged in");
          
        } else {
          console.log("logout");
          router.push('/login');  
        }
        
      }, (reason) => {
        console.log(reason);
        
      })
    }

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const go = (link : string) => {
      if (link == 'dashboard') {
        router.push('/admin');  
      } else {
        router.push('/admin/' + link);
      }
      
    };

    async function apiLogout() {
      try {
        signOut(AUTH);
        ToastSweet('success', 'Anda sudah logout.');
        router.push('/login');
      } catch (error) {
        router.push('/login');
      }
    }

    const onLogout = () => {
      handleClose();
      ConfirmSweet('warning', 'Konfirmasi Logout', 'Apakah anda akan logout?', () => {
        apiLogout();
      })
      
            
    };

    const [state, setState] = useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
    
    const toggleDrawer =
        (anchor: any, open: boolean) =>
        (event: React.KeyboardEvent | React.MouseEvent) => {
          if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
              (event as React.KeyboardEvent).key === 'Shift')
          ) {
            return;
          }
    
          setState({ ...state, [anchor]: open });
    };

    const IconConvert = ({name} : { name: string}) => {
      
      if (name == 'dashboard') {
        return (
          <Dashboard/>
        )
      } else if (name == 'penjualan') {
        return (
          <ProductionQuantityLimits/>
        )
      } else {
        return(
          <MailIcon />
        )
      }
    }
    
    const list = (anchor: any) => (
        <Box
          sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
          role="presentation"
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
        >
          <Card sx={{ minWidth: 275 }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: deepPurple[500] }} aria-label="recipe">
                  FR
                </Avatar>
              }
              title={ user?.fullName }
              subheader="Owner"
            />
            <CardActions>
              <Button size="small">Profile</Button>
              <Button size="small">Upgrade</Button>
            </CardActions>
          </Card>
          
          <List>
            {['dashboard', 'penjualan'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton onClick={ () => { go(text) }}>
                  <ListItemIcon>
                    <IconConvert name={text}/>
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          {/* <List>
            {['All mail', 'Trash', 'Spam'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List> */}
        </Box>
    );
    

    return (
        <>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                onClick={toggleDrawer('left', true)}
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <MenuIcon/>
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                { company.companyName }
              </Typography>
              <Button
                    id="basic-button"
                    color="inherit"
                    onClick={handleClick}
                >
                    <AccountCircle/>
                </Button>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                    'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>My account</MenuItem>
                    <Divider />
                    <MenuItem onClick={onLogout}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>
            </Toolbar>
          </AppBar>
        </Box>
        {(['left'] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
        ))}
        <div style={{padding:15}}>
        {children}
        </div>
        </>
    )
  }
