import { AUTH } from "@/service/firebase";
import { headers } from "next/dist/client/components/headers";
import { NextResponse } from "next/server";

export async function GET(req : Request, response : Response, head : Headers) {
    try {
      
      const headersList = headers();
      
      const apiKey  = headersList.get('apikey');
      
      if ((!apiKey) || (apiKey != process.env.APIKEY)) {
        return NextResponse.json({ 'data': null, 'status': '402', 'statusDesc' : 'Forbbiden'});
      }
      
      return await AUTH.signOut().then((ok) => {
        return NextResponse.json({ 'data': true, 'status': '200', 'statusDesc' : 'Logged Out'});
      }).catch((reason) => {
        return NextResponse.json({ 'data': true, 'status': '200', 'statusDesc' : 'Tidak ada session login'});
      });
      
    } catch (error) {
      console.log(error);
      
      return NextResponse.json({ 'data': null, 'status': '500', 'statusDesc' : 'Internal Server Error'});
    }
  
  
}