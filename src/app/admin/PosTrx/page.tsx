"use client"

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
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import { DB, getSessionUser, refItems, refProduct, submitTransaction } from "@/service/firebase";
import { useEffect, useRef, useState } from "react";
import { DocumentData, collection, doc, getDocs, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { Item, Product, Trx, User } from "@/service/model";
import { Button, CardContent, Input, List, ListItem, Paper } from "@mui/material";
import Link from "next/link";
import { AlertSweet, ToastSweet, formatCcy, localGet, localSave, makeId } from "@/service/helper";
import MOMENT from 'moment';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ComSkeleton from "@/component/skeleton";
import ComEmpty from "@/component/comEmpty";
var findIndex = require('lodash/findIndex');
var sumBy = require('lodash/sumBy');

export default function PosTrx() {
    const [productList, setProductList] = useState<Product[]>([]);
    const [productMaster, setProductMaster] = useState<Product[]>([]);
    const [itemSelect, setItemSelect] = useState<Item>();
    const txtSearch = useRef<any>(null);
    const [user, setUser] = useState<User | null>(null);
    const [trx, setTrx] = useState<Trx>();
    const [items, setItems] = useState<Item[]>([]);
    const [searchInput, setSearchInput] = useState('');
    const [mode, setMode] = useState('');
    const [qty, setQty] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const ref = refProduct();
        checkTrx();
        getSession();
        getProduct(ref);
        txtSearch.current?.focus();
      return () => {
        
      }
    }, []);

    const checkTrx = () => {
        //jika di akses dari main menu
        const existTrx = localGet('@trx');
                
        if (!existTrx) {
            //jika tidak ada cart buat ulang no nota
            console.log("Initial Trx");
            initTrx();
        } else {
            console.log("lanjut trx");
            setTrx(existTrx);
            const existItems = localGet('@items');
            if (existItems) {
                setItems(existItems);    
            }
        }
    }

    const initTrx = async() => {
        const user = localGet('@user');
        const trxId = MOMENT().format('YYMMDD') + makeId(5);
        const trxInit = {
            'trxId' : trxId,
            'kasir' : user.fullName,
            'kasirId' : user.username,
            'createdDate' : MOMENT().format('YYYY-MM-DD HH:mm:ss'),
            'status' : 'NEW',
            'trxQty' : 0,
            'trxTotal' : 0,
            'branchId' : user.branchId,
            'note' : '',
        }
        //setNote("");
        console.log(trxInit);
        setTrx(trxInit);
        localSave('@trx', trxInit);
    }

    const getSession = () => {
        const tmpUser = getSessionUser();
        setUser(tmpUser);
    }

    const getProduct = async(link : string) => {
        const ref = collection(DB, link);
        let data: Product[] = [];
        
        setLoading(true);
        return getDocs(ref).then((resp) => {
            
            resp.forEach((d) => {
            const df : any = d.data();
            df.price = Number(df.price);
            df.cost = Number(df.cost);
            df.stockCrash = Number(df.stockCrash);
            df.stockMin = Number(df.stockMin);
            data.push(df);
            })
            //console.log(data);
            setProductList(data);
            setProductMaster(data);
            setLoading(false);
        }).catch((reason) => {
            console.log(reason);
            setLoading(false);
        })
    }

    const searching = async() => {
        console.log("trigger search");
        
        if (searchInput == '') {
             setProductList(productMaster);
            return;
        }
        try {
            if (productMaster.length != 0) {
                let resultSearch1 = productMaster.filter(data => data.productName.toLowerCase().includes(searchInput.toLowerCase()));
                let resultSearch2 = productMaster.filter(data => data.productId.includes(searchInput));
                
                let resultSearch3 = resultSearch1.concat(resultSearch2);
                
                setProductList(resultSearch3);
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    const saveItem = async (newItem : Item) => {
        try {
            
            var indexItem = findIndex(items, { id : newItem.id});
            
            if (indexItem < 0) {
                items.push(newItem);
            } else {
                items.splice(indexItem, 1, newItem);
            }
            //setTrx(trx);
            calculateItem();
            // if (searchText) {
            //     updateSearch('');
            //     refSearch.current?.focus();
            // }
        } catch (error) {
            console.log(error);
            AlertSweet('error','Product', 'ERR.IPF.39 ' + error);
        }
    }

    const calculateItem = async () => {
        try {
            let trxUpdate = localGet('@trx');
            
            // let dataVal = await FIRESTORE().collection(ref).where('trxId','==',itemUpdate.trxId).get();
            // let data = dataVal.docs.map((val) => { return val.data() });
            let data = items;
            trxUpdate.createdDate = MOMENT().format("YYYY-MM-DD HH:mm:ss");
            trxUpdate.trxQty = sumBy(data, 'qty');
            trxUpdate.trxTotal = sumBy(data, 'total');
            trxUpdate.trxCost = sumBy(data,'totalCost');
            localSave('@items', data);
            setTrx(trxUpdate);
            localSave('@trx', trxUpdate);
            
        } catch (error) { 
            console.log(error);
            
            // Alert.alert('POS.211', error);
        }
        
    }

    const delItem = async(d : Item | undefined) => {
        try {
            
            // const user = getLocal('@user');
            // const ref = await refItems();
            
            // FIRESTORE().collection(ref).doc(data.id).delete().then(Oke => {
            //     //notif('Item dihapus ' + data.productName);
                
            // }).catch(err => {
            //     Alert.alert('ERR.TRX.288', err.message);
            // });
            var indexItem = findIndex(items, { id : d?.id});
            
            items.splice(indexItem, 1);
            await removeItemDb(d?.id);
            //actionItem.current?.hide();
            setItemSelect(undefined);
            setMode('');
            ToastSweet('success','Item dihapus ' + d?.productName);
            calculateItem();
        } catch (error) {
            console.log(error);
            
            //Alert.alert('ERR.TRX.291', error);
        }
    }

    const removeItemDb = async(id : string | undefined) => {

        try {
            const ref = refItems();
            console.log('hapus');
            console.log(ref);
            
            const refDoc = doc(DB, ref + '/' + id);
            deleteDoc(refDoc).catch((reason) => {
                console.log(reason);
                
            }).catch((err) => {
                console.log(err);
                
            }).finally(() => {
                console.log("selesai");
                
            })
            console.log("EOITDB");
            
    
        } catch (error) {
            console.log(error);
            //Alert.alert('ERR.SP.197', error);
            
        }
    }

    const ViewProduct = ({data} : { data : Product}) => {
        const addToCart = async() => {
            //setProduct(data);
            let newItem : Item = {
                id:'',
                productId:'',
                productName:'',
                cost:0,
                price:0,
                priceOrigin:0,
                qty:0,
                subTotal:0,
                totalCost:0,
                disc:0,
                persen:0,
                typeDisc:0,
                total:0,
                trxId: '',
                branchId: '',
                createdDate:'',
            }
            const id = trx?.trxId + data.productId;
            const existItem = items.filter(x => x.id == id);
            
            setTrx(trx);
            newItem.productId = data.productId;
            newItem.id = id;

            newItem.productName = data.productName;
            newItem.cost = data.cost;
            newItem.price = data.price;
            newItem.priceOrigin = data.price;
            newItem.qty = 1;
            if (existItem.length != 0) {
                newItem.qty = newItem.qty + existItem[0].qty;
            }
            
            newItem.subTotal = newItem.price * newItem.qty;
            newItem.totalCost = newItem.cost * newItem.qty;
            newItem.total = newItem.subTotal - newItem.disc;
            newItem.trxId = (trx) ? trx.trxId : '';
            newItem.branchId = (trx) ? trx.branchId : '';
            saveItem(newItem);

            ToastSweet('success','Tambah ' + data.productName)
        }

        return (
            <a href="#" onClick={addToCart}>
            <MenuItem>
                <ListItemIcon>
                    <FontAwesomeIcon icon={'plus-circle'} color={'green'}/>
                </ListItemIcon>
                <ListItemText>
                { data.productId } <br />
                { data.productName }
                </ListItemText>
                <Typography variant="body2" color="text.secondary" textAlign={"right"}>
                { formatCcy(data.price) }
                </Typography>
            </MenuItem>
            <Divider/>
            </a>
        )
    }

    const ViewItem = ({data} : { data : Item}) => {

        const selectItem = () => {
            console.log('Select Item');
            
            setMode('PRODUCT');
            setItemSelect(data);
            setQty(data.qty);
        }

        return (
            <a href="#" onClick={selectItem}>
            <MenuItem>
                <ListItemIcon>
                    <FontAwesomeIcon icon={'pencil-alt'} />
                </ListItemIcon>
                <ListItemText>
                { data.productName } <br />
                X { data.qty }
                </ListItemText>
                <Typography variant="body2" color="text.secondary" textAlign={"right"}>
                { formatCcy(data.price) } <br />
                { formatCcy(data.total) }
                </Typography>
            </MenuItem>
            
            </a>
        )
    }

    const changeQty = (val : any) => {
        //console.log(val);
        setQty(val);
        if (itemSelect) {
            itemSelect.qty = val;
            itemSelect.subTotal = itemSelect.price * val;
            itemSelect.total = itemSelect.subTotal - itemSelect.disc;    
        }
        
        //console.log(item);
        
    }

    const EditItem = () => {

        const closeEdit = () => {
            setMode('');
            setItemSelect(undefined);
        }

        return (
            <div>
            <Card style={{padding:5}}>
            <Grid container>
                <Grid item xs={12} md={6} xl={6}>
                { itemSelect?.productName }
                </Grid>
                <Grid item xs={12} md={6} xl={6} style={{textAlign:'right'}}>
                    <a href="#" onClick={closeEdit}>
                        <Button variant="outlined">
                            <FontAwesomeIcon icon={'close'}/>
                        </Button>
                    </a>
                </Grid>
            </Grid>
            <Divider/>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6} xl={6}> 
                    <br/>
                    <Grid container>
                        <Grid item xs={12} md={6} xl={6}>Harga </Grid>
                        <Grid item xs={12} md={6} xl={6} textAlign={'right'}>{ formatCcy(itemSelect?.price) } </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} md={6} xl={6}>Total </Grid>
                        <Grid item xs={12} md={6} xl={6} textAlign={'right'}>{ (itemSelect?.price) ? formatCcy(itemSelect?.price * qty) : 0 } </Grid>
                    </Grid>
                    
                    <br/>
                    <br/>
                </Grid>
                <Grid item xs={12} md={6} xl={6}> 
                    <TextField 
                        label="Qty" 
                        value={qty}
                        onChange={(x) => { changeQty(x.currentTarget.value )}}
                        variant="outlined" 
                        fullWidth 
                        type="number" 
                        placeholder="0.00" />
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6} xl={6}>
                <Button 
                    onClick={() => {
                        if (itemSelect) {
                            ToastSweet('success','Diupdate ' + itemSelect.productName)
                            saveItem(itemSelect);
                            setMode('');
                            setItemSelect(undefined);
                        }
                    }}
                    variant="contained" 
                    color="success" 
                    fullWidth> <FontAwesomeIcon icon={'save'}/> Simpan </Button>
                </Grid>
                <Grid item xs={12} md={6} xl={6} style={{textAlign:'right'}}>
                <Button 
                variant="outlined" 
                onClick={ () => { delItem(itemSelect)}}
                color="error" fullWidth> <FontAwesomeIcon icon={'trash-alt'}/> Hapus </Button>
                </Grid>
            </Grid>
            </Card>
            
            </div>
        )
    }

    const savePesan = async() => {
        if (items.length == 0) {
            AlertSweet('info','Info','Tidak ada Item untuk disimpan');
        } else {
            await submitTransaction();
            setMode('');
            AlertSweet('success','Tersimpan','Pesanan transaksi disimpan.');
            initTrx();
            setItems([]); 
        }
    }
    
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12} md={3} xl={3}>
                    <fieldset className="border border-solid border-gray-300 p-3">
                        <legend className="text-sm">No Nota : { trx?.trxId }</legend>
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
                    value={searchInput}
                    onChange={(e) => { setSearchInput(e.currentTarget.value )}}
                    onKeyUp={(e) => { searching() }}
                    ref={txtSearch}
                    placeholder="Nama Produk / Barcode Produk"
                    variant="outlined" />
                </Grid>
                <Grid item xs={12} md={3} xl={3}>
                    <fieldset className="border border-solid border-gray-300 p-3">
                        <legend className="text-sm">Items ( { items.length } ) ------ Qty ( { formatCcy(trx?.trxQty) } ) </legend>
                        <Typography variant="h4" textAlign={'right'} component="h4">
                            Rp{ formatCcy(trx?.trxTotal) }
                        </Typography>
                    </fieldset>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={12} md={3} xl={3}>

                    <Card>
                    

                        <MenuList>
                            <MenuItem onClick={savePesan}>
                            <ListItemIcon>
                                <SaveIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Simpan</ListItemText>
                            <Typography variant="body2" color="text.secondary">
                                ⌘S
                            </Typography>
                            </MenuItem>
                            <MenuItem>
                            <ListItemIcon>
                                <PrintIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Cetak</ListItemText>
                            <Typography variant="body2" color="text.secondary">
                                ⌘P
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
                    { (loading) && <ComSkeleton /> }
                    { (mode == '') && <div>
                    <Grid container>
                        <Grid item xs={12} md={6} xl={6}>

                        </Grid>
                        <Grid item xs={12} md={6} xl={6} textAlign={"right"}>
                            <i>Menampilkan { productList.length } dari total { productMaster.length }</i>
                        </Grid>
                    </Grid>
                    <Card style={{maxHeight:'75vh', overflow:'scroll'}}>
                    {
                        productList.map((val, i) => {
                            return <ViewProduct key={i} data={val} />
                        })
                    }
                    </Card>
                    </div>
                    }
                    { (mode == 'PRODUCT') && <div>
                        <EditItem/>
                    </div> }
                    
                </Grid>
                <Grid item xs={12} md={3} xl={3}>
                    <Card style={{maxHeight:'75vh', overflow:'scroll'}}>
                    {
                        items.map((val, i) => {
                            return <ViewItem key={i} data={val} />
                        })
                    }
                    </Card>
                    {
                        (items.length == 0) && <ComEmpty/>
                    }
                </Grid>
            </Grid>
        </>
    )
}