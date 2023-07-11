import { DB } from "@/service/firebase";
import { DocumentData, collection, getDocs, doc, getDoc } from "firebase/firestore";
import { headers } from "next/dist/client/components/headers";
import { NextResponse } from "next/server";

export async function POST(req : Request, response : Response, head : Headers) {
    try {
      const body = await req.json();
      
      const headersList = headers();
      
      const apiKey  = headersList.get('apikey');
      
      if ((!apiKey) || (apiKey != process.env.APIKEY)) {
        return NextResponse.json({ 'data': null, 'error': 'Not Authenticated.' });
      }
      
      if (!body.companyId || !body.trxId) {
        return NextResponse.json({ 'data': null, 'error': 'Parameter Required.' });
      }
      const link = 'Company/' + body.companyId + '/Transactions/' + body.trxId;
      
      const ref = doc(DB, link);

      return getDoc(ref).then((value) => {
        
        if (value.data()) {
          console.log("return data");
          
          return NextResponse.json({ 'data': value.data() });
        } else {
          console.log("no data");
          
          return NextResponse.json({ 'data': null });
        }
        
      }).catch((err) => {
        console.log(err);
        return NextResponse.json({ 'data': null });
      });
    } catch (error) {
      console.log(error);
      
      NextResponse.json({ 'data': null, 'error': 'Internal Error' });
    }
  
  
}