"use client"
import { formatCcy } from "@/service/helper";
import { Grid } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Nota({
    params,
    searchParams,
  }: {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
  }){
    const param = useSearchParams();
    const router = useRouter();
    const [trx, setTrx] = useState<any>(null);
    const [company, setCompany] = useState<any>(null);
    const [items, setItems] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    async function getData() {
        
        // let companyId : string | string[] | null = "";
        // if (searchParams.q) {
            
        //     companyId = searchParams.q;
        // } else if(param.get('q')){
        //     companyId = param.get('q');
        // } else {
        //     router.replace('/404');
        // }
        // console.log(searchParams);
        // console.log(param.get('c'));
        const c : string | null = param.get('c');
        const b : string | null = param.get('b');
        const t : string | null = param.get('t');
        
        await getCompany(c, b);
        await getNota(c, t);
        await getNotaItems(c, t);
        
        window.print();
    }

    async function getNota(c : string | null, t : string | null) {
        const api = await fetch('/api/nota', {
            method: 'POST',
            headers :  {
                'Content-Type': 'application/json',
                'ApiKey': '20240101',
            },
            body: JSON.stringify({
                "companyId" : c,
                "trxId" : t
            })});

        const res = await api.json();
        const data = await res.data;
        
        setTrx(data);
    }

    async function getCompany(c : string | null, b : string | null) {
        const api = await fetch('/api/company', {
            method: 'POST',
            headers :  {
                'Content-Type': 'application/json',
                'ApiKey': '20240101',
            },
            body: JSON.stringify({
                "companyId" : c,
                "branchId" : b
            })});

        const res = await api.json();
        const data = await res.data;
        
        setCompany(data);
    }

    async function getNotaItems(c : string | null, t : string | null) {
        console.log("Get Nota");
        
        const api = await fetch('/api/notaitems', {
            method: 'POST',
            headers :  {
                'Content-Type': 'application/json',
                'ApiKey': '20240101',
            },
            body: JSON.stringify({
                "companyId" : c,
                "trxId" : t
            })});

        const res = await api.json();
        const data = await res.data;
        console.log(data);
        if (data) {
            setItems(data);    
        }
        
    }
    return (
        <div className="sm:pt-5 lg:pt-10 p-5">
            <Grid container spacing={2}>
                <Grid item sm={6} xs={12}>
                    { (company?.companyName) ? company?.companyName : 'loading company name...' } <br />
                    { (company?.branchAddress) ? company?.branchAddress : 'loading company address...' } <br />
                    { (company?.companyPhone) ? company?.companyPhone : 'loading company phone...' } <br />
                </Grid>
                <Grid className="sm:text-right" item sm={6} xs={12}>
                    Pembeli <br />
                    
                    <Grid container spacing={2}>
                        <Grid item sm={6} xs={6}>
                            Nama : <br />
                            Alamat : 
                        </Grid>
                        <Grid className="sm:text-right" item sm={6} xs={6}>
                            { (trx?.memberName) ? trx?.memberName : '____________________' } <br />
                            { (trx?.memberAddress) ? trx?.memberAddress : '____________________' }
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <hr />
            <br />
            <center className="bold">
                Bukti Transaksi <br />
                Nomor : { (trx?.trxId) ? trx?.trxId : 'Loading Transaction...' } <br />
                Waktu Transaksi : { (trx?.createdDate) ? trx?.createdDate : 'YYYY-MM-DD HH:ii:ss' }

            </center>
            <br />
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                <th align="center">List Item</th>
                </tr>
            </thead>
            
                { items.map((data : any,i) => {
                    return (
                        <tbody key={i}>
                        <tr >
                        <td>{ i+1 } | {data.productName}</td>
                        </tr>
                        <tr >
                        <td className="text-right">{data.qty} x Rp{ formatCcy(data.price) }</td>
                        </tr>
                        </tbody>
                    )
                })}
                
            
            </table>
            <Grid container spacing={2}>
                <Grid item sm={6} xs={12}>
                    <span className="box">{trx?.status}</span>
                    <div>{trx?.note}</div>
                </Grid>
                <Grid className="sm:text-right" item sm={6} xs={12}>
                    
                    <Grid container spacing={2}>
                        <Grid item sm={6} xs={6}>
                            Total Item <br />
                            Total Tagihan<br />
                            { (trx?.method) ? trx?.method : 'CASH' } <br />
                            Kembalian
                        </Grid>
                        <Grid className="sm:text-right" item sm={6} xs={6}>
                            { (trx?.trxQty) ? formatCcy(trx?.trxQty) : '0' } <br />
                            Rp{ (trx?.trxTotal) ? formatCcy(trx?.trxTotal) : '0' } <br />
                            Rp{ (trx?.amount) ? formatCcy(trx?.amount) : '0' } <br />
                            Rp{ (trx?.kembalian) ? formatCcy(trx?.kembalian) : '0' }

                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <br />
            <hr />
            Bukti Transaksi ini dicetak otomatis dari aplikasi beekasir
        </div>
    )
}