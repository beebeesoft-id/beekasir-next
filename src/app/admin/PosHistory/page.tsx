"use client"
import { DB, refProduct, refTrx } from "@/service/firebase";
import { Trx } from "@/service/model";
import { Card, CardContent, Grid } from "@mui/material";
import { DocumentData, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import { ConfirmSweet, localRemove, localSave } from "@/service/helper";
import { useRouter } from "next/navigation";

export default function PosTrx() {
    const [listTrx, setListTrx] = useState<Trx[]>([]);
    const router = useRouter();

    const columns : GridColDef[] = [
        { field: 'trxId', headerName : 'No Nota', width:120},
        { field: 'createdDate', headerName : 'Waktu', width:200},
        { field: 'trxCost', headerName : 'Modal', type:"number"},
        { field: 'trxTotal', headerName : 'Pendapatan', type:"number"},
        { field: 'trxQty', headerName : 'Qty', type:"number"},
        { field: 'method', headerName : 'Pembayaran'},
        { field: 'status', headerName : 'Status'},
        { field: 'kasir', headerName : 'Kasir', width:150},
        { field: 'memberName', headerName : 'Member'},
    ]

    useEffect(() => {
      getList();
    
      return () => {
        
      }
    }, [])
    
    function getList() {
        
        const ref = collection(DB, refTrx());
        getDocs(ref).then((response) => {
            let data : any = response.docs.map((d) => {
                return d.data();
            });
            setListTrx(data);
            console.log(data);
            

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
        <Grid container spacing={2}>
            {/* <Grid item sm={12} md={3} xl={3}>
                <Card>
                    <CardContent>
                        Pencarian
                    </CardContent>
                </Card>
            </Grid> */}
            <Grid item sm={12} md={12} xl={12}>
                <Card>
                    <CardContent>
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