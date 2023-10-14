"use client";

import { AppBar, Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Typography } from "@mui/material"
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

import React, { useState } from "react";
import { deepPurple } from "@mui/material/colors";
import { useRouter } from "next/navigation";
import { ConfirmSweet } from "@/service/helper";

export default function AdminLayout({
    children,
  }: {
    children: React.ReactNode
  }) {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const router = useRouter();

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

    const onLogout = () => {
      ConfirmSweet('warning', 'Konfirmasi Logout', 'Apakah anda akan logout?', () => {
        console.log('ya');
        router.push('/login');  
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
              title="Kiki Kiswanto"
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
                Nama Toko
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
        {children}
        </>
    )
  }
