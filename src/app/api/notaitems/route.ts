import { DB } from "@/service/firebase";
import { DocumentData, collection, getDocs, doc, getDoc, where, query } from "firebase/firestore";
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
      const link = 'Company/' + body.companyId + '/Items';
      
      
      const ref = collection(DB, link);

      return getDocs(query(ref, where('trxId','==',body.trxId))).then((value) => {
        let data: DocumentData[] = [];
        data = value.docs.map((g) => { return g.data() });
        
        if (data) {
          return NextResponse.json({ 'data': data });
        } else {
          return NextResponse.json({ 'data': [] });
        }
      }).catch((err) => {
        console.log(err);
        return NextResponse.json({ 'data': [] });
      });
    } catch (error) {
      console.log(error);
      
      return NextResponse.json({ 'data': [], 'error': 'Internal Error' });
    }
  
  
}