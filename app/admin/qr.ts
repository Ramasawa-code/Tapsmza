export const SITE = 'https://tapsmza.site'

export type QrColor = 'black' | 'white'

export function pad(n:number){ return String(n).padStart(4,'0') }
export function normalize(v:string){ let s=v.toLowerCase().replace('algo','').trim(); if(/^\d+$/.test(s)) return pad(parseInt(s)); return s }

// Builds the print-ready file from the hidden 1000px QR rendered as #qr-hidden-<code>.
// Rejects when that QR isn't in the DOM or the image can't be rasterised.
export function downloadQR(cod: string, format:'png'|'svg', qrColor: QrColor){
  return new Promise<void>((resolve, reject)=>{
    const norm = normalize(cod)
    const el = document.getElementById(`qr-hidden-${norm}`)?.querySelector('svg');
    if(!el) return reject(new Error('qr not found'));
    const svgData = new XMLSerializer().serializeToString(el);
    const filename = `tapsmza-${norm}-${qrColor}`
    const textFill = qrColor === 'black'? 'black' : 'white';
    if(format==='svg'){
      const finalSvg = `<svg width="1100" height="1250" viewBox="0 0 1100 1250" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="1100" height="1100" rx="80" ry="80" fill="white"/><g transform="translate(50,50)">${svgData.replace(/<svg[^>]*>/,'').replace('</svg>','')}</g><text x="550" y="1190" text-anchor="middle" font-family="monospace" font-size="70" font-weight="bold" fill="${textFill}">${norm}</text></svg>`
      const blob = new Blob([finalSvg],{type:'image/svg+xml;charset=utf-8'});
      const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`${filename}.svg`; a.click();
      resolve()
    } else {
      const canvas=document.createElement('canvas');
      const img=new Image();
      const blob=new Blob([svgData],{type:'image/svg+xml;charset=utf-8'});
      const objUrl=URL.createObjectURL(blob);
      img.onerror=()=>{ URL.revokeObjectURL(objUrl); reject(new Error('qr render failed')) }
      img.onload=()=>{
        canvas.width=1100; canvas.height=1250;
        const ctx=canvas.getContext('2d')!;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle='#fff';
        const r=80;
        ctx.beginPath();
        ctx.moveTo(r,0); ctx.lineTo(1100-r,0); ctx.quadraticCurveTo(1100,0,1100,r);
        ctx.lineTo(1100,1100-r); ctx.quadraticCurveTo(1100,1100,1100-r,1100);
        ctx.lineTo(r,1100); ctx.quadraticCurveTo(0,1100,0,1100-r);
        ctx.lineTo(0,r); ctx.quadraticCurveTo(0,0,r,0); ctx.closePath(); ctx.fill();
        ctx.drawImage(img,50,50,1000,1000);
        ctx.fillStyle=textFill;
        ctx.font='bold 70px monospace';
        ctx.textAlign='center';
        ctx.fillText(norm, 550, 1190);
        const a=document.createElement('a');
        a.download=`${filename}.png`;
        a.href=canvas.toDataURL('image/png');
        a.click();
        URL.revokeObjectURL(objUrl)
        resolve()
      };
      img.src=objUrl;
    }
  })
}
