import { DB } from "@/service/firebase";
import { collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import { headers } from "next/dist/client/components/headers";
import { NextResponse } from "next/server";
import moment from "moment";
import axios from "axios";

//export const dynamic = "force-dynamic" //clodflare solution

export async function POST(req : Request, response : Response, head : Headers) {
    try {
      console.log("Scanning Auto Downgrade");
      
      //const headersList = headers();
      //const apiKey  = headersList.get('Authorization');
      
      // if ((!apiKey) || (apiKey != `Bearer ${process.env.APIKEY}`)) {
      //   console.log(headersList);
        
      //   console.log("ApiKey blocked " + apiKey);
      //   return NextResponse.json({ 'data': 401, 'error': 'Not Authenticated.' }, { status : 401});
      // }
      
      const list = collection(DB, "Company/");

      const filter = query(list, where('level','!=',0));

      const data = (await getDocs(filter)).docs;
        
      const today = moment().format('YYYY-MM-DD');
      console.log('Found ' + data.length);
      let countExp = 0;
      const dayReminder = -4;
      
      data.forEach(async(val) => {
        try {
          let row = val.data();

          let selisih = 0;
          
          if (row.exp) {
            selisih = moment().diff(row.exp, 'day');
            console.log(row.companyName + ' ' + selisih);

            if (selisih > 0) {
                countExp = countExp+1;
                console.log('Kirim Info Downgrade ke ' + row.createdBy);
                const refCompany = doc(DB, "Company/" + row.id);
                let update = await updateDoc(refCompany, { 'level' : 0, 'exp' : null });
                console.log(update);
                let subject = "Downgrade Akun Beekasir: Expired " + row.exp;
                let body = `Hi ${row.companyName} <br/><br/>Mohon maaf kami belum menerima pembayaran perpanjangan sampai waktu expired nih di ${row.exp}, Untuk sementara akun akan di downgrade ke member FREE, silahkan lakukan perpanjangan pada aplikasi beekasir pojok kanan atas di halaman home ya. <br/>Email ini dikirim otomatis no reply ya kak<br/>Kirim email ke beebeesoft.id@gmail.com jika ada kendala. <br/><br/>Salam<br/>Beekasir System`;
                sendEmail(row, subject, body);
            } else if (selisih == dayReminder) {
              console.log('Kirim reminder ke ' + row.createdBy);
              let subject = "Reminder Beekasir: Perpanjangan " + row.exp;
              let body = `Hi ${row.companyName} <br/><br/>Saatnya perpanjangan, akun Beekasir anda akan expired nih di ${row.exp}, lakukan perpanjangan pada aplikasi beekasir pojok kanan atas di halaman home ya. <br/>Email ini dikirim otomatis no reply ya kak<br/>Kirim email ke beebeesoft.id@gmail.com jika ada kendala. <br/><br/>Salam<br/>Beekasir System`;
              sendEmail(row, subject, body);
              
            }
          }

          
        } catch (error) {
          console.log(error);
          
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

const sendEmail = async(data : any, subject: string, body: string) => {
  try {
    
    const response = await axios.post('https://api.mailersend.com/v1/email', JSON.stringify({
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
                  "subject": subject,
                  "text": body,
                  "html": body
          }), { 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mlsn.920845eec581dad1c94108f4890cd3ff1b424e9a9b9e00f363b179cbe85a9d59',
          'X-Requested-With' : 'XMLHttpRequest'
        }});
      console.log(response);
      
  } catch (error) {
      
      console.log(error)
  }
}