"use client"
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import { useEffect, useState } from "react"
import Loading from "./loading";
import { redirect, useRouter, useSearchParams } from 'next/navigation'
interface Column {
    id: 'productName' | 'code' | 'price' | 'size' | 'density';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
  }
  
  const columns: readonly Column[] = [
    { id: 'productName', label: 'Name', minWidth: 100 },
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

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
 
  useEffect(() => {
    setLoading(true)
    getData();
  }, [])
 
    async function getData() {
        console.log("query param");
        console.log(searchParams);
        console.log(param);
        
        let companyId : string | string[] | null = "";
        if (searchParams.q) {
            
            companyId = searchParams.q;
        } else if(param.get('q')){
            companyId = param.get('q');
        } else {
            router.replace('/404');
        }
        
        const api = await fetch('/api/products', {
            method: 'POST',
            headers :  {
                'Content-Type': 'application/json',
                'ApiKey': '20240101',
            },
            body: JSON.stringify({
                "companyId" : companyId,
                "branchId" : "0001"
            })});
        setLoading(false);
        const res = await api.json();
        const data = await res.data;
        
        setData(data);
        if (data.length == 0) {
            console.log("data length 0");
            
            router.replace('/404');
        }    
    }

  if (isLoading) return <Loading/>
  if (!data) return <p>No data</p>
 
  if(data.length != 0) return (
    <div className="lg:p-20 md:p-10 sm:p-5">
        <div className="text-xl text-center m-10">Daftar Harga</div>
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