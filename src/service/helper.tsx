

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