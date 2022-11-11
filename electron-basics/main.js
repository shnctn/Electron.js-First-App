const electron = require("electron");
const url = require("url");
const path = require("path");


const {app, BrowserWindow, Menu, ipcMain}=electron;
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS']='true'
let mainWindow;

app.on('ready',() =>{
   mainWindow=new  BrowserWindow({ 
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
    }
    });

   mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "main.html"),
            protocol:"file",
            slashes:true
        })
    );
    const mainMenu=Menu.buildFromTemplate(mainMenuTemplate)
    Menu.setApplicationMenu(mainMenu);

    ipcMain.on("key", (err,data) => {
        console.log(data);
    })
    ipcMain.on("key:inputValue", (err,data) => {
        console.log(data);
    })
    ipcMain.on("key:newWindow",()=>{
        createWindow();
    })

    mainWindow.on("close",()=>{
        app.quit();
    })
});

const mainMenuTemplate=[
    {
        label:"Dosya",
        submenu:[
            {
                label:"Yeni TODO ekle",
                accelerator:process.platform=="darwin"?"Command+Y":"Ctrl+Y"
            },
            {
                label:"Tümünü sil",
                accelerator:process.platform=="darwin"?"Command+D":"Ctrl+D"

            },          
            {
                label:"Çıkış",
                accelerator:process.platform=="darwin"? "Command+Q":"Ctrl+Q",
                role:"quit"
            }
        ]
    }
    
]

if(process.env.NODE_ENV !== "production"){
    mainMenuTemplate.push(
        {
            label:"Dev Tools",
            submenu:[
                {
                    label:"Geliştrici Penceresini Aç", 
                    accelerator:process.platform=="darwin"?"f12":"f12",
                    click(item,focusedWindow){
                        focusedWindow.toggleDevTools();
                    }
                },
                {
                    label:"Yenile",
                    role:"reload"
    
                }              
            ]
        }
       
    )
}
if(process.platform=="darwin"){ //sistem mac ise  menü seçeneklerinde ayrı dosya alanı gösteriri

    mainMenuTemplate.unsift({
        label:app.getName(),
        role:"TODO"
    })
}

function createWindow(){
    addWindow=new BrowserWindow({
        width:482,
        height:200,
        title:"Yeni Bir Pencere"
    });
    addWindow.loadURL(url.format({
      pathname:path.join(__dirname,"modal.html"),
      protocol:"file",
      slashes:true
    }));

    addWindow.on("close",()=>{
        addWindow=null;
    })
    
}