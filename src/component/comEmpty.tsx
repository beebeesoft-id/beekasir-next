import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardContent, Skeleton } from "@mui/material";

export default function ComEmpty({}) {
    return (
      <>
        <Card>
            <CardContent style={{textAlign:'center'}}>
                <FontAwesomeIcon icon={'coffee'} /> Data Akan Muncul disini.
            </CardContent>
        </Card>
      </>
    )
  }
  