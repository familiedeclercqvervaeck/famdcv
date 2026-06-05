const shares=document.getElementById('shares');
shares.addEventListener('input',()=>{
document.getElementById('amount').innerText='€'+(shares.value*25);
});
document.getElementById('giftBtn').addEventListener('click',()=>{
const name=document.getElementById('donorName').value;
const tree=document.getElementById('treeSelect').value;
const amount=shares.value*25;
document.getElementById('voucher').style.display='block';
document.getElementById('voucherContent').innerHTML=`<h2>Voor Frederik, Evi, Sem & Jasper</h2><p>Geschonken door: ${name}</p><p>${shares.value} aandeel(en) voor ${tree}</p><p>Bedrag €${amount}</p>`;
});