import { DB } from "@/service/firebase";
import { DocumentData, collection, getDocs } from "firebase/firestore";
import { headers } from "next/dist/client/components/headers";
import { NextResponse } from "next/server";

export async function POST(req : Request, response : Response, head : Headers) {
    try {
      const body = await req.json();
      const headersList = headers();
      const apiKey  = headersList.get('apikey');
      
      if ((!apiKey) || (apiKey != process.env.APIKEY)) {
        return NextResponse.json({ 'data': [], 'error': 'Not Authenticated.' });
      }
      
      if (!body.companyId || !body.branchId) {
        return NextResponse.json({ 'data': [], 'error': 'Parameter Required.' });
      }
      
      const ref = collection(DB, 'Company/' + body.companyId + '/Branch/' + body.branchId + '/Products');
      let data: DocumentData[] = [];
      return getDocs(ref).then((getDoc) => {
        
        getDoc.forEach((d) => {
          data.push(d.data());
        })
        
        
        return NextResponse.json({ 'size' : data.length, 'data': data });
      }).catch((reason) => {
        return NextResponse.json({ 'data': [] });
      })
    } catch (error) {
      console.log(error);
      
      NextResponse.json({ 'data': [], 'error': 'Internal Error' });
    }
  
  
}