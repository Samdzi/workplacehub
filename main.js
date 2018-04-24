const {app, BrowserWindow, Menu} = require('electron')
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let server

function createWindow() {
    // Create browser window
    win = new BrowserWindow({width: 800, height: 600})

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'src/index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools
    win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
}

function setServer() {
    var net = require('net');
    var textChunk =  '';

    var server = net.createServer( function (socket) {
        socket.write('Echo server\r\n')
        socket.on('data', function (data) {
            console.log(data)
            console.log(typeof data)
            textChunk = data.toString('utf8')
            console.log(textChunk)
            socket.write(textChunk)
            win.webContents.send('ping', textChunk)
        })
    })
    server.listen(8000, '192.168.0.178')
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    createWindow()
    setServer()
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})