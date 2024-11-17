"use client";

import { AppBar, Avatar, Box, Breadcrumbs, Button, Card, CardActions, CardContent, CardHeader, Container, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Typography } from "@mui/material"
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
import { usePathname, useRouter } from "next/navigation";
import { ConfirmSweet, ToastSweet, localGet, setAccess } from "@/service/helper";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { AUTH } from "@/service/firebase";
import { fa9, fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import Pkg from '../../../package.json';
import { GridExpandMoreIcon } from "@mui/x-data-grid";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
interface DataMenu {
  id:string;
  label:string;
  icon:any;
  route:string;
  level:number;
}
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
    const [menus, setMenus] = useState<DataMenu[]>([]);
    const pathname = usePathname();

    useEffect(() => {
      autoload();
    
      return () => {
        
      }
    }, []);
    
    const autoload = async() => {
      try {
        const localUser = await localGet('@user');
        //console.log(localUser);
        setUser(localUser);

        const localCompany = await localGet('@company');
        //console.log(localCompany);
        setCompany(localCompany);

        const localBranch = await localGet('@branch');
        //console.log(localBranch);
        setBranch(localBranch);

        const getMenus = setAccess(localUser);
        console.log(getMenus);
        setMenus(getMenus);
      } catch (error) {
        console.log(error);
        
      }
      

      onAuthStateChanged(AUTH, (user) => {
        
        if (user) {
          console.log("logged in");
          
        } else {
          console.log("logout");
          apiLogout();
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
        localStorage.clear();
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
            {/* <CardActions>
              <Button size="small">Profile</Button>
              <Button size="small">Upgrade</Button>
            </CardActions> */}
          </Card>
          
          {/* <List>
            <ListItem key={'dashboard'} disablePadding>
                <ListItemButton onClick={ () => { go('dashboard') }}>
                  <ListItemIcon>
                    <IconConvert name={'dashboard'}/>
                  </ListItemIcon>
                  <ListItemText primary={'dashboard'} />
                </ListItemButton>
            </ListItem>
            
          </List> */}
          <Divider />
          <List>
            { menus.map((m, i) => (
              <ListItem key={i} disablePadding>
                <ListItemButton onClick={ () => { go(m.route) }}>
                  <ListItemIcon>
                    <FontAwesomeIcon icon={m.icon}/>
                  </ListItemIcon>
                  <ListItemText primary={m.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <div style={{bottom:0, position:"absolute", paddingLeft:10}}>Version { Pkg.version }</div>
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
                { company?.companyName }
              </Typography>
              <Button
                    id="basic-button"
                    color="inherit"
                    onClick={handleClick}
                >
                  { user?.fullName }
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
                    {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>My account</MenuItem> */}
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
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            color="inherit"
            href="/admin"
          >
            <FontAwesomeIcon icon={'home'}/> Home
          </Link>
          <Link
            color="inherit"
            href="#"
          >
            <FontAwesomeIcon icon={'bars'}/> { pathname }
          </Link>
          
        </Breadcrumbs>
        {children}
        </div>
        </>
    )
  }
