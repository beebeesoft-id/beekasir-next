"use client"

import { localGet, setAccess } from "@/service/helper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardActions, CardContent, CardHeader, Icon, Stack } from "@mui/material";
import { useEffect, useState } from "react";

export default function AdminPage() {
    const [menus, setMenus] = useState<any[]>([]);
    useEffect(() => {
        autoload();
      
        return () => {
          
        }
      }, []);

    const autoload = async() => {
        const localUser = localGet('@user');
        const getMenus = setAccess(localUser);
        console.log(getMenus);
        setMenus(getMenus);
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
                        <Card key={i}>
                            <CardContent>
                                <FontAwesomeIcon icon={m.icon} size="lg"/>
                            </CardContent>
                            <CardActions>{ m.label}</CardActions>
                        </Card>
                    )
                })
            }
            
       </Stack>
    </div>
}