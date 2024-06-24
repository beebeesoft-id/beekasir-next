"use client"
import { DB, refProduct, refTrx } from "@/service/firebase";
import { Trx } from "@/service/model";
import { Button, Card, CardContent, Grid } from "@mui/material";
import { DocumentData, collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import { ConfirmSweet, localRemove, localSave } from "@/service/helper";
import { useRouter } from "next/navigation";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function PosTrx() {
    const [listTrx, setListTrx] = useState<Trx[]>([]);
    const router = useRouter();
    const [lastUpdated, setLastUpdated] = useState('HH:ii:ss');

    const columns : GridColDef[] = [
        {
            field: 'id' , 
            headerName: 'No', 
            filterable: false,
            renderCell:(index) => index.api.getAllRowIds().indexOf(index.row.trxId) + 1
        },
        { field: 'trxId', headerName : 'No Nota', width:120},
        { field: 'createdDate', headerName : 'Waktu', width:200},
        { field: 'trxTotal', headerName : 'Total', type:"number"},
        { field: 'trxQty', headerName : 'Qty', type:"number"},
        { field: 'method', headerName : 'Pembayaran'},
        { field: 'status', headerName : 'Status'},
        { field: 'kasir', headerName : 'Kasir', width:150},
        { field: 'memberName', headerName : 'Member'},
        { field: 'note', headerName : 'Catatan'},
    ]

    useEffect(() => {
      getList();
    
      return () => {
        
      }
    }, [])
    
    function getList() {
        
        const ref = collection(DB, refTrx());
        getDocs(query(ref, orderBy('createdDate','desc'))).then((response) => {
            let data : any = response.docs.map((d) => {
                return d.data();
            });
            setListTrx(data);
            console.log(data);
            setLastUpdated(moment().format('HH:mm:ss'));

        })
    }

    const selectTrx = (data : Trx) => {
        ConfirmSweet('info','Transaksi dipilih', 'Apakah akan melihat detail transaksi ? ' + data.trxId, () => {
            localSave('@trx', data);
            localRemove('@items');
            router.push('/admin/PosTrx');
        })
    }
    return (
        <>
        <br />
        <Grid container spacing={2}>
            
            <Grid item sm={12} md={12} xl={12}>
                <Card>
                    <CardContent>
                    <Grid container>
                        <Grid item sm={6} md={6} xl={6}>
                            Total Data : { listTrx.length }
                        </Grid>
                        <Grid item sm={6} md={6} xl={6} className="text-right">
                            <i>Last Update : { lastUpdated }</i> <Button type="button" variant="outlined" onClick={getList}> <FontAwesomeIcon icon={'rotate'}/> Refresh </Button>
                        </Grid>
                    </Grid>
                        <DataGrid
                        rows={listTrx}
                        columns={columns}
                        getRowId={(d) => d.trxId}
                        onRowClick={(p) => { selectTrx(p.row);
                        }}
                        initialState={{
                            pagination: {
                                paginationModel:{
                                    pageSize:10,
                                }
                            }
                        }}
                        />
                    </CardContent>
                </Card>
                
            </Grid>
        </Grid>
        </>
    )
}