import { Backdrop, CircularProgress } from "@mui/material";
import Link from "next/link";

export default function Loading() {
    return (
      <>
        <Backdrop
            sx={{ color: '#fff', zIndex: 9999 }}
            open={true}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
      </>
    )
  }
  