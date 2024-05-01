import { DB } from "@/service/firebase";
import { collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import { headers } from "next/dist/client/components/headers";
import { NextResponse } from "next/server";
import moment from "moment";

export async function GET(req : Request, response : Response, head : Headers) {
    try {
      console.log("Scanning Auto Downgrade");
      
      const headersList = headers();
      const apiKey  = headersList.get('api-key');
      
      if (apiKey != 'FEDDFF345345') {
        return NextResponse.json({ 'data': 'Access Forbbiden', 'status': '401', 'statusDesc' : 'Alert access unidentified'});
      }
      
      const list = collection(DB, "Company/");

      const filter = query(list, where('level','!=',0));

      const data = (await getDocs(filter)).docs;
        
      const today = moment().format('YYYY-MM-DD');
      console.log('Found ' + data.length);
      
      data.forEach(async(val) => {
        let row = val.data();
        let expired = false;
        if (today > row.exp) {
            expired = true;
            const refCompany = doc(DB, "Company/" + row.id);
            await updateDoc(refCompany, { 'level' : 0 });
            console.log(row.id + ' - ' + row.companyName + ' - Expired');
        }
        
      });
      console.log("Finish Scanning");
      
      return NextResponse.json({ 'data': data.length, 'status': '200', 'statusDesc' : 'Member Berhasil di scaning'});
    } catch (error) {
        console.log("Error di autodowngrade");
        
        console.log('error ' + error);
        
      console.log(error);
      
      
      return NextResponse.json({ 'data': "Internal Server Error", 'status': '500', 'statusDesc' : 'Please contact administrator'});
    }
  
  
}