import { AUTH, DB } from "@/service/firebase";
import { DocumentData, collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from 'firebase/auth'
import { headers } from "next/dist/client/components/headers";
import { NextResponse } from "next/server";
import moment from "moment";

export async function POST(req : Request, response : Response, head : Headers) {
    try {
        console.log("request Trx");
        
      const body = await req.json();
      
      const headersList = headers();
      
      console.log(body);
      console.log(headersList);
      const apiKey  = headersList.get('user-agent');
      console.log(apiKey);
      
      if (apiKey == 'Veritrans') {
        console.log("Verified");
        
      }
      
      if (body.transaction_status == 'settlement') {
        const refBill = doc(DB, "Billing/" + body.order_id);
        await updateDoc(refBill, body);
        const bill = (await getDoc(refBill)).data();
        console.log(bill);
        if (bill) {
          let exp = moment().add(1, 'M').format("YYYY-MM-DD");
          
          const refCompany = doc(DB, "Company/" + bill.companyId);
          const company = (await getDoc(refCompany)).data();
          console.log(company);
          
          if (company) {
            if (company.exp) {
              exp = moment(company.exp).add(1, 'M').format("YYYY-MM-DD");
            }
          }
          console.log(exp);
          await updateDoc(refCompany, { 'level' : bill.level, 'exp' : exp});
          console.log(body.order_id + " - " + body.transaction_status + " Level Updated");
          return NextResponse.json({ 'data': 'Payment Success ', 'status': '200', 'statusDesc' : 'Settlement Order '  + body.order_id});
        }
        
        console.log(body.order_id + " - " + body.transaction_status);
        
        return NextResponse.json({ 'data': 'Payment Status Receipt ', 'status': '200', 'statusDesc' : 'Order '  + body.order_id + ' Status ' + body.transaction_status});
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