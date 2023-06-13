"use client"
import { useEffect, useState } from "react"


export default function Products() {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false)
 
  useEffect(() => {
    setLoading(true)
    getData();
  }, [])
 
  async function getData() {
    const api = await fetch('/api/products', {
        method: 'POST',
        headers :  {
            'Content-Type': 'application/json',
            'ApiKey': '20240101',
        },
        body: JSON.stringify({
            "companyId" : "230606VFMN",
            "branchId" : "0001"
        })});
    setLoading(false);
    const res = await api.json();
    const data = await res.data;
    console.log(data);
    setData(data);
    
  }

  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No profile data</p>
 
  return (
    <div>
      {
        data.map((v: any, i: number) => (
            <div key={i}>{ v.productName } - { v.price }</div>
        ))
      }
    </div>
  )
}