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
      
      if (!body.companyId || !body.branchId) {
        return NextResponse.json({ 'data': null, 'error': 'Parameter Required.' });
      }
      const link1 = 'Company/' + body.companyId;

      const link2 = 'Company/' + body.companyId + '/Branch/' + body.branchId;
      
      const ref = doc(DB, link1);
      const ref2 = doc(DB, link2);

      const company = (await getDoc(ref)).data();
      //console.log(company);

      const branch = (await getDoc(ref2)).data();
      //console.log(branch);

      const data = { ...company, ...branch }
      return NextResponse.json({ 'data': data });
    } catch (error) {
      console.log(error);
      
      return NextResponse.json({ 'data': null, 'error': 'Internal Error' });
    }
  
  
}