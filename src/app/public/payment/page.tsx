"use client"
import { faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Pricing() {
    const [orderId, setOrderId] = useState<any>('');
    const [transactionStatus, setTransactionStatus] = useState<any>('');
    const param = useSearchParams();

    useEffect(() => {
      getData();
    
      return () => {
        
      }
    }, [])

    async function getData() {

        const o : string | null = param.get('order_id');
        const t : string | null = param.get('transaction_status');
        
        setOrderId(o);
        setTransactionStatus(t);
        
    }
    

    return (
        <div className="bg-white py-24">
            <div className="mx-auto max-w-7xl px-6">
            <Card sx={{ minWidth: 275, textAlign:'center' }}>
                <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    BeeKasir
                    </Typography>
                    <Typography variant="h5" component="div">
                    
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Pembayaran Member Berlangganan
                    </Typography>
                    
                    <Badge badgeContent={ transactionStatus } color="success">
                        <FontAwesomeIcon icon={faFileInvoiceDollar} color={'black'} size={'10x'}/>
                    </Badge>
                    <br /> <br />
                    <Typography variant="body2">
                    Order ID : { orderId }
                    <br />
                    {((transactionStatus == 'settlement') || transactionStatus == 'capture') ? 'Status Member Telah Aktif Silahkan cek Pada aplikasi' : 'Status Pembayaran akan dikirim ke email'}
                    <br />
                    </Typography>
                </CardContent>
                {/* <CardActions>
                    <Button size="small">Learn More</Button>
                </CardActions> */}
            </Card>
            </div>
        </div>

    )
}