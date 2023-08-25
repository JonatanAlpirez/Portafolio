let f=[0,1];
let total= 0;
let entero = 10;

for(let i=0 ; total<=entero ; i++){
    total = parseInt(f[i]) + parseInt(f[i+1]);
    if (total<=entero){
        f.push(total);
    }
    
}
console.log(f);