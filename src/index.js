const electron = require('electron')
const path = require('path')
const BrowserWindow = electron.remote.BrowserWindow
const axios = require('axios')

const notifyBtn = document.getElementById('notifyBtn')

notifyBtn.addEventListener('click', function (event) {
    const modalPath = path.join('file://', __dirname, 'display.html')
    let win = new BrowserWindow({
        frame: false,
        alwaysOnTop: true,
        width: 400,
        height: 200
    })
    win.on('close', function () { win = null})
    win.loadURL(modalPath)
    win.show()
})

var price = document.querySelector('h1')
var targetPrice = document.getElementById('targetPrice')

function getBTC() {
    axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD')
    .then(res => {
        const cryptos = res.data.BTC.USD
        price.innerHTML = '$'+cryptos.toLocaleString('en')
    })
}

// get information from TCP/IP Socket
var net = require('net')
var textChunk = '';
var server = net.createServer( function (socket) {
    socket.write('Echo server\r\n');
    socket.on('data', function (data) {
        console.log(data)
        console.log(typeof data)
        textChunk = data.toString('utf8');
        console.log(textChunk);
        socket.write(textChunk)
        price.innerHTML = '$'+textChunk
    })
})

server.listen(8000, '192.168.0.178')
console.log('Server started')

getBTC();
setInterval ( getBTC, 30000);