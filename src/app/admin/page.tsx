"use client"

import { localGet, setAccess } from "@/service/helper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardActions, CardContent, CardHeader, Icon, Stack } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminPage() {
    const [menus, setMenus] = useState<any[]>([]);
    useEffect(() => {
        autoload();
      
        return () => {
          
        }
      }, []);

    const autoload = async() => {
        try {
            const localUser = localGet('@user');
            const getMenus = setAccess(localUser);
            console.log(getMenus);
            setMenus(getMenus);    
        } catch (error) {
            console.log("No Role");
            
        }
        
    }

    const goTo = (url : string) => {
        console.log(url);
        
    }

    return <div>
        <br/>
        <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        useFlexGap flexWrap="wrap"
        >
            {
                menus.map((m, i) => {
                    return (
                        <Link key={i} href={'/admin/' + m.route}>
                        <Card style={{backgroundColor:'#1976d2', color:'#fff'}} key={i}>
                            <CardContent>
                                <FontAwesomeIcon icon={m.icon} size="8x"/>
                            </CardContent>
                            <CardActions>{ m.label}</CardActions>
                        </Card>
                        </Link>
                    )
                })
            }
            
       </Stack>
    </div>
}