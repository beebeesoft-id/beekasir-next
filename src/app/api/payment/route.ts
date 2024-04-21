import { AUTH, DB } from "@/service/firebase";
import { DocumentData, collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from 'firebase/auth'
import { headers } from "next/dist/client/components/headers";
import { NextResponse } from "next/server";
import moment from "moment";

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
        const refBill = doc(DB, "Billing/" + body.order_id);
        await updateDoc(refBill, body);
        const bill = (await getDoc(refBill)).data();
        console.log(bill);
        if (bill) {
          let exp = moment().add(1, 'M');
          console.log(exp);
          
          const refCompany = doc(DB, "Company/" + bill.companyId);
          await updateDoc(refCompany, { 'level' : bill.level, 'expired': exp});
          return NextResponse.json({ 'data': 'Payment Success ', 'status': '200', 'statusDesc' : 'Settlement Order '  + body.order_id});
        }
        
        
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