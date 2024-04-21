import { AUTH, DB } from "@/service/firebase";
import { DocumentData, collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from 'firebase/auth'
import { headers } from "next/dist/client/components/headers";
import { NextResponse } from "next/server";

export async function POST(req : Request, response : Response, head : Headers) {
    try {
        console.log("request post");
        
      const body = await req.json();
      
      const headersList = headers();
      
      console.log(body);
      console.log(headersList);
    //   const apiKey  = headersList.get('apikey');
      
    //   if ((!apiKey) || (apiKey != process.env.APIKEY)) {
    //     return NextResponse.json({ 'data': null, 'status': '402', 'statusDesc' : 'Forbbiden'});
    //   }
      
      if (body.transaction_status == 'settlement') {
        const ref = doc(DB, "Billing/" + body.order_id);
        const bill = (await getDoc(ref)).data();
        console.log(bill);
        await updateDoc(ref, body);
        return NextResponse.json({ 'data': 'Payment Success ', 'status': '200', 'statusDesc' : 'Settlement Order '  + body.order_id});
      }

    

    

    //   if (!user) {
    //     return NextResponse.json({ 'data': null, 'status': '204', 'statusDesc' : 'no-content'});
    //   }

    //   const signIn = await signInWithEmailAndPassword(AUTH, body.username, body.password).then((value) => {
    //     console.log(value);
        
    //     return value;
    //   }).catch((reason) => {
    //     return reason;
        
    //   });
    //   if (!signIn.user) {

    //     return NextResponse.json({ 'data': null, 'status': '204', 'statusDesc' : signIn.code});
    //   }
        
      return NextResponse.json({ 'data': body, 'status': '200', 'statusDesc' : headersList});
    } catch (error) {
      console.log(error);
      
      return NextResponse.json({ 'data': null, 'status': '500', 'statusDesc' : 'Internal Server Error'});
    }
  
  
}