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
      
      const list = collection(DB, "Company/");

      const filter = query(list, where('level','!=',0));

      const data = (await getDocs(filter)).docs;
        
      const today = moment().format('YYYY-MM-DD');
      console.log('Found ' + data.length);
      let countExp = 0;
      const dayReminder = -4;
      
      for (const val of data)  {
        try {
          let row = val.data();

          let dayDiff = 0;
          
          if (row.exp) {
            dayDiff = moment().diff(row.exp, 'day');
            console.log(row.companyName + ' ' + dayDiff);

            if (dayDiff == dayReminder) {
              console.log('Send reminder to ' + row.createdBy);
              let subject = "Reminder Beekasir: Perpanjangan " + row.exp;
              let body = `Hi ${row.companyName} <br/><br/>Saatnya perpanjangan, akun Beekasir anda akan expired nih di ${row.exp}, lakukan perpanjangan pada aplikasi beekasir pojok kanan atas di halaman home ya. <br/>Email ini dikirim otomatis no reply ya kak<br/>Kirim email ke beebeesoft.id@gmail.com jika ada kendala. <br/><br/>Salam<br/>Beekasir System`;
              await sendEmail(row, subject, body);
              
            } else if (dayDiff > 0) {
                countExp = countExp+1;
                console.log('Send Info Downgrade to ' + row.createdBy);

                const refCompany = doc(DB, "Company/" + row.id);
                console.log(refCompany);
                console.log('ref');
                
                let update = await updateDoc(refCompany, { 'level' : 0, 'exp' : null });
                console.log('update');
                
                console.log(update);
                let subject = "Downgrade Akun Beekasir: Expired " + row.exp;
                let body = `Hi ${row.companyName} <br/><br/>Mohon maaf kami belum menerima pembayaran perpanjangan sampai waktu expired nih di ${row.exp}, Untuk sementara akun akan di downgrade ke member FREE, silahkan lakukan perpanjangan pada aplikasi beekasir pojok kanan atas di halaman home ya. <br/>Email ini dikirim otomatis no reply ya kak<br/>Kirim email ke beebeesoft.id@gmail.com jika ada kendala. <br/><br/>Salam<br/>Beekasir System`;
                await sendEmail(row, subject, body);
                console.log('berhasil kirim email');
                
            } 
          }

          
        } catch (error) {
          console.log(error);
          
        }
        
      }
      console.log("Finish Scanning");
      
      return NextResponse.json({ 'data': countExp + ' of ' + data.length, 'status': '200', 'statusDesc' : 'Success'});
    } catch (error) {
        console.log("Error di autodowngrade");
        
        console.log('error ' + error);
        
      console.log(error);
      
      
      return NextResponse.json({ 'data': "AutoDownGrade", 'status': '500', 'statusDesc' : error});
    }
  
  
}

const sendEmail = async(data : any, subject: string, body: string) => {
  try {
    console.log('Sending mail');
    
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
        console.log('sending done');
        
      console.log(response);
      
  } catch (error) {
    console.log('sending error');
      console.log(error)
  }
}