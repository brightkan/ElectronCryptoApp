const electron = require('electron')
const path = require('path')
const BrowserWindow = electron.remote.BrowserWindow
const ipc = electron.ipcRenderer
const axios = require('axios')

var price = document.getElementById('price')
const notifyBtn = document.getElementById('notifyBtn')
var targetPrice = document.getElementById('targetPrice')
var targetPriceVal
// Declare the notification

const notification = {
    title: "BRIGHT CRYPTO ALERT",
    body: 'BTC just beat your target price!',
    icon: path.join(__dirname, 'assets/images/btc.png')

}

// Query the BTC api for the price of the a bitcoin in USD
var cryptos
function getBTC(){
    axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD')
          .then(res => {
            cryptos = res.data.BTC.USD
            price.innerHTML = '$ '+cryptos.toLocaleString('en')
          })
    

    if(targetPrice.innerHTML != '' && targetPriceVal < cryptos){
        const myNotification = new window.Notification(notification.title, notification)
    }


}

// call getBTC() initially
getBTC()

//Pull data from the api every 1 second

setInterval(getBTC, 10000)



notifyBtn.addEventListener('click',(event)=>{
    const modalPath = path.join('file://',__dirname,'add.html')
    let win = new BrowserWindow({frame:false, transparent:true, alwaysOnTop:true, width:400, height:200})
    win.on('close', ()=>{ win = null})
    win.loadURL(modalPath)
    win.show()
})

ipc.on('targetPriceVal', (event, data)=>{
    targetPriceVal = Number(data)
    targetPrice.innerHTML = '$'+ targetPriceVal.toLocaleString('en') +'<hr> This is my target price'
})