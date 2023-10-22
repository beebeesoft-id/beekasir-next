"use client"
import ContentPaste from "@mui/icons-material/ContentPaste";
import Cloud from '@mui/icons-material/Cloud';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentCut from '@mui/icons-material/ContentCut';
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { DB, getSessionUser, refProduct } from "@/service/firebase";
import { useEffect, useRef, useState } from "react";
import { DocumentData, collection, getDocs } from "firebase/firestore";
import { Product, User } from "@/service/model";
import { CardContent, List, ListItem, Paper } from "@mui/material";
import Link from "next/link";
import { ToastSweet } from "@/service/helper";

export default function PosTrx() {
    const [productList, setProductList] = useState<Product[]>([]);
    const txtSearch = useRef<any>(null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
      const ref = refProduct();
      getSession();
      getProduct(ref);
        txtSearch.current?.focus();
      return () => {
        
      }
    }, []);

    const getSession = () => {
        const tmpUser = getSessionUser();
        setUser(tmpUser);
    }

    const getProduct = async(link : string) => {
        const ref = collection(DB, link);
        let data: Product[] = [];
        
        
        return getDocs(ref).then((resp) => {
            
            resp.forEach((d) => {
            const df : any = d.data();
            df.price = Number(df.price);
            df.cost = Number(df.cost);
            df.stockCrash = Number(df.stockCrash);
            df.stockMin = Number(df.stockMin);
            data.push(df);
            })
            console.log(data);
            setProductList(data);
            
        }).catch((reason) => {
            console.log(reason);
            
        })
    }

    const ViewProduct = ({data} : { data : Product}) => {
        const addToCart = () => {
            console.log("click add to cart");
            
            ToastSweet('info','Ditambahkan ke cart ' + data.productName)
        }
        return (
            <a href="#" onClick={addToCart}>
            <Paper style={{padding:5}} square>
            <Grid container>
                <Grid item xs={12} md={4} xl={4}>
                { data.productId }
                </Grid>
                <Grid item xs={12} md={4} xl={4}>
                { data.productName }
                </Grid>
                <Grid item xs={12} md={4} xl={4} style={{textAlign:'right'}}>
                { data.price }
                </Grid>
            </Grid>
            </Paper>
            
            </a>
        )
    }
    
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12} md={3} xl={3}>
                    <fieldset className="border border-solid border-gray-300 p-3">
                        <legend className="text-sm">No Nota : XXXXXXXX</legend>
                        <Grid container>
                            <Grid item xs={6} md={6} xl={6}>Kasir</Grid>
                            <Grid item xs={6} md={6} xl={6} textAlign={"right"}>{ user?.fullName }</Grid>
                        </Grid>

                    </fieldset>
                </Grid>
                <Grid item xs={12} md={6} xl={6} style={{marginTop:10}}>
                    <TextField id="outlined-basic" 
                    fullWidth
                    label="Pencarian"
                    ref={txtSearch}
                    placeholder="Nama Produk / Barcode Produk"
                    variant="outlined" />
                </Grid>
                <Grid item xs={12} md={3} xl={3}>
                    <fieldset className="border border-solid border-gray-300 p-3">
                        <legend className="text-sm">TOTAL</legend>
                        <Typography variant="h4" textAlign={'right'} component="h4">
                            Rp100.000.000,-
                        </Typography>
                    </fieldset>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={12} md={3} xl={3}>
                    <Card>
                        <MenuList>
                            <MenuItem>
                            <ListItemIcon>
                                <ContentCopy fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Copy</ListItemText>
                            <Typography variant="body2" color="text.secondary">
                                ⌘C
                            </Typography>
                            </MenuItem>
                            <MenuItem>
                            <ListItemIcon>
                                <ContentPaste fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Paste</ListItemText>
                            <Typography variant="body2" color="text.secondary">
                                ⌘V
                            </Typography>
                            </MenuItem>
                            <Divider />
                            <MenuItem style={{backgroundColor:'#90EE90'}}>
                            <ListItemIcon>
                                <AddShoppingCartIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Bayar</ListItemText>
                            <Typography variant="body2" color="text.secondary">
                                Alt + P
                            </Typography>
                            </MenuItem>

                            <MenuItem style={{backgroundColor:'#FF5733', color:'#ffffff'}}>
                            <ListItemIcon>
                                <DeleteForeverIcon fontSize="small" style={{color:'#ffffff'}}/>
                            </ListItemIcon>
                            <ListItemText>Batal</ListItemText>
                            <Typography variant="body2" color="#ffffff">
                                Alt + C
                            </Typography>
                            </MenuItem>
                        </MenuList>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6} xl={6}>
                    <List>
                    {
                        productList.map((val, i) => {
                            return <ViewProduct key={i} data={val} />
                        })
                    }
                    </List>
                </Grid>
                <Grid item xs={12} md={3} xl={3}>
                    List
                </Grid>
            </Grid>
        </>
    )
}