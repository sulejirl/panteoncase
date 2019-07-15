module.exports = {
  randomUserName: (length) => {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },
  randomAge: () => {
    return Math.floor(Math.random() * (50 - 9)) + 9;
  },
  randomCoin : () => {
    return Math.floor(Math.random() * 1000);
  },
  distributeCoin : (totalCoin)=>{
    let coins = totalCoin;
    coins = Math.round(coins*(2/100));
    let distributeList = [];
    distributeList.push(Math.round(coins*(20/100)));
    distributeList.push(Math.round(coins*(15/100)));
    distributeList.push(Math.round(coins*(10/100)));
    coins = coins - Math.round(coins*(20/100)) - Math.round(coins*(15/100)) - Math.round(coins*(10/100))
    for(let i = 97; i>0;i--){
      distributeList.push(coins*(i/4764));
    }
    console.log(distributeList);
    console.log(coins);
    return distributeList;
  }
}