import { DB } from "@/service/firebase";
import { collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import { headers } from "next/dist/client/components/headers";
import { NextResponse } from "next/server";
import moment from "moment";

export const dynamic = "force-dynamic" //clodflare solution

export async function GET(req : Request, response : Response, head : Headers) {
    try {
      console.log("Scanning Auto Downgrade");
      
      const headersList = headers();
      const apiKey  = headersList.get('Authorization');
      
      if ((!apiKey) || (apiKey != `Bearer ${process.env.APIKEY}`)) {
        console.log(headersList);
        
        console.log("ApiKey blocked " + apiKey);
        return NextResponse.json({ 'data': 401, 'error': 'Not Authenticated.' }, { status : 401});
      }
      
      const list = collection(DB, "Company/");

      const filter = query(list, where('level','!=',0));

      const data = (await getDocs(filter)).docs;
        
      const today = moment().format('YYYY-MM-DD');
      console.log('Found ' + data.length);
      let countExp = 0;
      data.forEach(async(val) => {
        let row = val.data();
        let expired = false;
        remider(row);
        if (today > row.exp) {
            expired = true;
            countExp = countExp+1;
            const refCompany = doc(DB, "Company/" + row.id);
            await updateDoc(refCompany, { 'level' : 0 });
            console.log(row.id + ' - ' + row.companyName + ' - Expired');
        }
        
      });
      console.log("Finish Scanning");
      
      return NextResponse.json({ 'data': countExp + ' of ' + data.length, 'status': '200', 'statusDesc' : 'Member Berhasil di scanning'});
    } catch (error) {
        console.log("Error di autodowngrade");
        
        console.log('error ' + error);
        
      console.log(error);
      
      
      return NextResponse.json({ 'data': "AutoDownGrade", 'status': '500', 'statusDesc' : error});
    }
  
  
}

async function remider(data : any) {
  let selisih = 0;
  const dayReminder = 5;
  if (data.exp) {
    selisih = moment().diff(data.exp, 'day');
  }
  if (selisih == dayReminder) {
    sendEmail(data);
    console.log('Kirim reminder ke ' + data.createdBy);
  }
  
  
}

const sendEmail = async(data : any) => {
  try {
      const response = await fetch('https://api.mailersend.com/v1/email',
      {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mlsn.920845eec581dad1c94108f4890cd3ff1b424e9a9b9e00f363b179cbe85a9d59',
            'X-Requested-With' : 'XMLHttpRequest'
          },
          body: JSON.stringify({
              "from": {
                  "email": 'admin@beebeesoft.com',
                  "name": 'Beekasir System'
              },
              "to": [
                  {
                      "email": data.createdBy,
                      "name": data.companyName
                  }
              ],
              "cc": [
                {
                    "email": 'beebeesoft.id@gmail.com',
                    "name": 'BeeBeeSoft'
                }
              ],
                  "subject": "Reminder Beekasir: Perpanjangan " + data.exp,
                  "text":"Hi Saatnya perpanjangan, akun beekasir anda akan expired nih, lakukan perpanjangan pada aplikasi beekasir pojok kanan atas di halaman home ya.",
                  "html": `Hi ${data.companyName} <br/><br/>Saatnya perpanjangan, akun Beekasir anda akan expired nih di ${data.exp}, lakukan perpanjangan pada aplikasi beekasir pojok kanan atas di halaman home ya. <br/>Email ini dikirim otomatis no reply ya kak<br/>Kirim email ke beebeesoft.id@gmail.com jika ada kendala. <br/><br/>Salam<br/>Beekasir System`
          }),
      });
      console.log(response);
      
  } catch (error) {
      //console.error(error);
      
      console.log(error)
  }
}