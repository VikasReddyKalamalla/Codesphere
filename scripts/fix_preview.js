const fs = require('fs');
const path = require('path');

const diskPath = path.join(__dirname, '../server/uploads/workspaces/6a74ee764f94a13b31b3662f');
if (fs.existsSync(diskPath)) {
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Codesphere Live Workspace</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="styles.css">
</head>
<body class="bg-slate-950 text-slate-100 flex items-center justify-center min-h-screen p-6 font-sans">
  <div id="preview-card" class="max-w-sm w-full bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl text-center space-y-5 backdrop-blur-xl transition-all duration-300">
    <div id="avatar-badge" class="w-12 h-12 bg-emerald-500/20 text-[#04AA6D] border border-emerald-500/30 rounded-xl flex items-center justify-center mx-auto shadow-inner font-mono font-bold text-lg">
      CS
    </div>
    
    <div>
      <h1 class="text-xl font-extrabold tracking-tight text-white font-mono">Codex Playground</h1>
      <p class="text-slate-400 text-xs mt-1.5 leading-relaxed">Real-time collaborative sandbox environment with instant hot-reloading.</p>
    </div>

    <div class="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
      <span class="text-[10px] font-mono text-slate-400 uppercase font-semibold">Compiler Status</span>
      <span id="time-message" class="text-emerald-400 font-mono text-[11px] font-bold">Initializing...</span>
    </div>

    <button onclick="changeColor()" class="w-full py-2.5 bg-[#04AA6D] hover:bg-emerald-600 active:scale-95 transition-all rounded-xl text-xs font-mono font-bold text-white shadow-lg shadow-emerald-500/20 cursor-pointer">
      Test Interactive Accent
    </button>
  </div>
  <script src="main.js"></script>
</body>
</html>`;

  const stylesCss = `/* High-Contrast Modern Theme Reset */
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  padding: 0;
  background-color: #0b0f19 !important;
  color: #f8fafc !important;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
h1, h2, h3, h4, h5, h6 {
  color: #ffffff !important;
}
p, span, label {
  color: #94a3b8;
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: .7; transform: scale(1.05); }
}`;

  const mainJs = `console.log("Welcome to CodeSphere Collaborative Sandbox Execution!");

const timeEl = document.getElementById("time-message");
if (timeEl) {
  timeEl.innerText = "Loaded successfully at " + new Date().toLocaleTimeString();
}

function changeColor() {
  const card = document.getElementById("preview-card");
  const badge = document.getElementById("avatar-badge");
  const timeEl = document.getElementById("time-message");
  
  const accents = [
    { border: "#04AA6D", bg: "rgba(4, 170, 109, 0.2)", text: "#04AA6D" },
    { border: "#3b82f6", bg: "rgba(59, 130, 246, 0.2)", text: "#60a5fa" },
    { border: "#8b5cf6", bg: "rgba(139, 92, 246, 0.2)", text: "#c084fc" },
    { border: "#ec4899", bg: "rgba(236, 72, 153, 0.2)", text: "#f472b6" },
    { border: "#f59e0b", bg: "rgba(245, 158, 11, 0.2)", text: "#fbbf24" }
  ];
  
  const selected = accents[Math.floor(Math.random() * accents.length)];

  if (card) {
    card.style.borderColor = selected.border;
    card.style.boxShadow = \`0 10px 30px -5px \${selected.border}40\`;
  }
  if (badge) {
    badge.style.borderColor = selected.border;
    badge.style.backgroundColor = selected.bg;
    badge.style.color = selected.text;
  }
  if (timeEl) {
    timeEl.style.color = selected.text;
    timeEl.innerText = "Accent updated at " + new Date().toLocaleTimeString();
  }
}`;

  fs.writeFileSync(path.join(diskPath, 'index.html'), indexHtml, 'utf8');
  fs.writeFileSync(path.join(diskPath, 'styles.css'), stylesCss, 'utf8');
  fs.writeFileSync(path.join(diskPath, 'main.js'), mainJs, 'utf8');
  console.log('Successfully updated disk workspace files for 6a74ee764f94a13b31b3662f!');
}
