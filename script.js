// === Owner Data ===
if (!localStorage.getItem('ownerTokens')) localStorage.setItem('ownerTokens', JSON.stringify([]));
if (!localStorage.getItem('accessLogs')) localStorage.setItem('accessLogs', JSON.stringify([]));

function addToken(){
  let token = document.getElementById('newToken').value.trim();
  if(!token) return alert('Isi token!');
  let tokens = JSON.parse(localStorage.getItem('ownerTokens'));
  tokens.push(token);
  localStorage.setItem('ownerTokens', JSON.stringify(tokens));
  alert('Token dibuat: ' + token);
  renderLinks();
}

function renderLinks(){
  let ul = document.getElementById('linkList');
  if(!ul) return;
  ul.innerHTML = '';
  let tokens = JSON.parse(localStorage.getItem('ownerTokens'));
  tokens.forEach(t => {
    let li = document.createElement('li');
    li.textContent = `${window.location.origin}/member.html?token=${t}`;
    ul.appendChild(li);
  });
}

function renderLogs(){
  let logs = JSON.parse(localStorage.getItem('accessLogs'));
  let table = document.getElementById('logTable');
  if(!table) return;
  logs.forEach(log=>{
    let tr = document.createElement('tr');
    tr.innerHTML = `<td>${log.token}</td><td>${log.device}</td><td>${log.ram}</td><td>${log.cpu}</td><td>${log.browser}</td><td>${log.os}</td><td>${log.battery}%</td><td>${log.charging}</td><td>${log.time}</td>`;
    table.appendChild(tr);
  });
}

// === Member Actions ===
function submitToken(){
  let token = document.getElementById('token').value.trim();
  let tokens = JSON.parse(localStorage.getItem('ownerTokens'));
  if(!tokens.includes(token)) return alert('Token salah!');
  
  // Capture device info
  let device = navigator.userAgent;
  let ram = (navigator.deviceMemory || 'N/A');
  let cpu = navigator.hardwareConcurrency || 'N/A';
  let browser = navigator.userAgentData?.brands.map(b=>b.brand).join(', ') || navigator.userAgent;
  let os = navigator.platform;
  
  navigator.getBattery().then(battery=>{
    let log = {
      token,
      device,
      ram,
      cpu,
      browser,
      os,
      battery: Math.round(battery.level*100),
      charging: battery.charging,
      time: new Date().toLocaleString()
    };
    let logs = JSON.parse(localStorage.getItem('accessLogs'));
    logs.push(log);
    localStorage.setItem('accessLogs', JSON.stringify(logs));
    alert('Akses berhasil! Info device telah dikirim ke Owner.');
  });
}

// Render dashboard jika owner
renderLinks();
renderLogs();
