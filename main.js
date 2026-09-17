const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

let backendProcess;

function iniciarBackend() {
  backendProcess = spawn("node", [path.join(__dirname, "backend/dist/index.js")], {
    stdio: "inherit",
    cwd: path.join(__dirname, "backend"),
  });
}

function criarJanela() {
  const janela = new BrowserWindow({
    width: 1280,
    height: 800,
  });

  setTimeout(() => {
    janela.loadURL("http://localhost:3001");
  }, 1000);
}

app.whenReady().then(() => {
  iniciarBackend();
  criarJanela();
});

app.on("window-all-closed", () => {
  if (backendProcess) backendProcess.kill();
  app.quit();
});