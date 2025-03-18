import { AUTH, DB } from "@/service/firebase";
import { DocumentData, collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { headers } from "next/dist/client/components/headers";
import { NextResponse } from "next/server";
import moment from "moment";

export async function POST(req : Request, response : Response, head : Headers) {
    try {
      console.log("Payment Receipt");
        
      const body = await req.json();
      console.log(body);
      
      const headersList = headers();
      const apiKey  = headersList.get('user-agent');
      
      // if (apiKey != 'Veritrans') {
      //   return NextResponse.json({ 'data': 'Access Forbbiden', 'status': '401', 'statusDesc' : 'Alert access unidentified'});
      // }
      const refBill = doc(DB, "Billing/" + body.order_id);
      await updateDoc(refBill, body);
      const bill = (await getDoc(refBill)).data();
      console.log(bill);

      if (body.transaction_status == 'settlement') {
        
        if (bill) {
          let exp = moment().add(bill.qty, 'M').format("YYYY-MM-DD");
          
          const refCompany = doc(DB, "Company/" + bill.companyId);
          const company = (await getDoc(refCompany)).data();
          //console.log(company);
          
          
          if (company?.exp) {
            let diff = moment().diff(company.exp, 'day');
            console.log(diff);
            
            if (diff < 0) {
              exp = moment(company.exp).add(bill.qty, 'M').format("YYYY-MM-DD");
            }
              
          }
          
          //console.log(exp);
          await updateDoc(refCompany, { 'level' : bill.level, 'exp' : exp});
          console.log(body.order_id + " - " + body.transaction_status + " Level Updated " + bill.level + " Until " + exp);
          return NextResponse.json({ 'data': 'Settlement and Upgrade Success ', 'status': '200', 'statusDesc' : 'Settlement Order '  + body.order_id});
        }
        
        console.log(body.order_id + " - " + body.transaction_status);
        
        return NextResponse.json({ 'data': 'Settlement but Failed Upgrade', 'status': '200', 'statusDesc' : 'Order '  + body.order_id});
      }
      
      console.log(body.order_id + " - " + body.transaction_status);
      return NextResponse.json({ 'data': body, 'status': '200', 'statusDesc' : headersList});
    } catch (error) {
      console.log(error);
      
      return NextResponse.json({ 'data': "Internal Server Error", 'status': '500', 'statusDesc' : 'Please contact administrator'});
    }
  
  
}