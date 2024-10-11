"use client"
import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const router = useRouter();
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const [company, setCompany] = useState<any>(null);
  const { SVG } = useQRCode();

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    setLoading(true)
    getData();
  }, []);

  async function getData() {
    const c: string | null = param.get('c');
    const b: string | null = param.get('b');

    getCompany(c, b);

    const api = await fetch('/api/products', {
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
    setLoading(false);
    const res = await api.json();
    const data = await res.data;

    setData(data);
    if (data.length == 0) {
      console.log("data length 0");

      router.replace('/404');
    }
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
  if (!data) return <p>No data</p>

  if (data.length != 0) return (
    <div className="lg:p-20 md:p-10 sm:p-5">

      <Grid item sm={6} xs={12} textAlign={'center'}>
        {(company) ? company?.companyName : 'loading company name...'} <br />
      </Grid>
      <div className="text-xl text-center">Daftar Harga</div>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .map((row, i) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  )
}