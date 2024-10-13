"use client"
import { Card, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import { useEffect, useState } from "react"
import Loading from "./loading";
import { redirect, useRouter, useSearchParams } from 'next/navigation'
import { useQRCode } from "next-qrcode";
interface Column {
  id: 'productName' | 'category' | 'code' | 'price' | 'size' | 'density';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'productName', label: 'Name', minWidth: 100 },
  { id: 'category', label: 'Kategori', minWidth: 100 },
  {
    id: 'price',
    label: 'Price',
    minWidth: 100,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
];

interface Data {
  name: string;
  code: string;
  population: number;
  size: number;
  density: number;
}

function createData(
  name: string,
  code: string,
  population: number,
  size: number,
): Data {
  const density = population / size;
  return { name, code, population, size, density };
}

export default function Products({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false)
  const param = useSearchParams();
  const router = useRouter();

  const [company, setCompany] = useState<any>(null);
  const { SVG } = useQRCode();

  useEffect(() => {
    setLoading(true)
    getData();
  }, []);

  async function getData() {
    const c: string | null = param.get('c');
    const b: string | null = param.get('b');

    getCompany(c, b);

    setLoading(false);


    // setData(data);
    // if (data.length == 0) {
    //   console.log("data length 0");

    //   router.replace('/404');
    // }
  }

  async function getCompany(c: string | null, b: string | null) {
    const api = await fetch('/api/company', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ApiKey': '20240101',
      },
      body: JSON.stringify({
        "companyId": c,
        "branchId": b
      })
    });

    const res = await api.json();
    const data = await res.data;

    setCompany(data);
  }

  if (isLoading) return <Loading />
  if (!company) return <p>No data</p>

  if (company) return (
    <div className="lg:p-20 md:p-10 sm:p-5">
      <Card style={{ padding: 10 }}>
        <Grid container spacing={2}>

          <Grid item sm={6} xs={6}>
            Nama Toko
          </Grid>
          <Grid item sm={6} xs={6} textAlign={'right'}>
            {(company) ? company?.companyName : 'loading company name...'} <br />
          </Grid>

        </Grid>
        <Grid container spacing={2}>

          <Grid item sm={6} xs={6}>
            Cabang
          </Grid>
          <Grid item sm={6} xs={6} textAlign={'right'}>
            {(company) ? company?.branchName : 'loading branch name...'} <br />
          </Grid>

        </Grid>

        <Grid container spacing={2}>

          <Grid item sm={6} xs={6}>
            Alamat
          </Grid>
          <Grid item sm={6} xs={6} textAlign={'right'}>
            {(company) ? company?.branchAddress : 'loading branch name...'} <br />
          </Grid>

        </Grid>
      </Card>
      <Grid container spacing={2}>

        <Grid item sm={12} xs={12} textAlign={'center'} marginTop={10} marginBottom={10}>
        <SVG
        text={'https://www.beekasir.com/QRProduct?c='+ company.companyId +'&b=' + company.id}
        options={{
          margin: 2,
          width: 250,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        }}
      />
        </Grid>

      </Grid>
      <Card style={{ padding: 10 }}>
        <Grid container spacing={2}>

          <Grid item sm={12} xs={12} textAlign={'center'}>
            Silahkan Scan QR Code Menggunakan Kamera Untuk Otomatis Redirect ke Buku Menu Digital
          </Grid>

        </Grid>
      </Card>
    </div>
  )
}