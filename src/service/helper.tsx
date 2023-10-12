import Swal from 'sweetalert2'

export function formatCcy(amount:any) {
    if (amount == '') {
        amount = 0;
    } else if(isNaN(amount)){
        amount = 0;
    } else {
        amount = parseInt(amount);
    }
    
    return String(amount.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'))
}

export function AlertSweet(status:string | any, title:string, desc:string) {
    Swal.fire({
        title: title,
        text: desc,
        icon: status,
        confirmButtonText: 'OK',
      });
}

export function ConfirmSweet(status:string | any, title:string, desc:string, fn : Function) {
    Swal.fire({
        title: title,
        text: desc,
        icon: status,
        confirmButtonText: 'Ya',
        cancelButtonText: 'Tidak',
        showCancelButton: true,
      }).then((response) => {
        if (response.isConfirmed) {
            fn();
        }
      });
}