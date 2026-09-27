const STORAGE_KEY = "ramboCoachV2";

const seed = {
  players: [
    {id: cryptoId(), name:"R4MBO", role:"IGL / Capitão", matches:20, kills:56, damage:28400, headshots:19},
    {id: cryptoId(), name:"NEXUS", role:"Rush / Entry", matches:20, kills:52, damage:26200, headshots:20},
    {id: cryptoId(), name:"K7", role:"Suporte", matches:20, kills:38, damage:23600, headshots:11},
    {id: cryptoId(), name:"DARK", role:"Fragger", matches:20, kills:49, damage:25200, headshots:18},
    {id: cryptoId(), name:"ZERO", role:"Flex", matches:20, kills:39, damage:21800, headshots:12}
  ],
  matches: [],
  analyses: [
    {id:cryptoId(), type:"PONTO DE ATENÇÃO", title:"Rotação atrasada", text:"Equipe perdeu tempo na transição para a terceira zona em partidas recentes.", action:"Definir rota antes do fechamento."},
    {id:cryptoId(), type:"PONTO FORTE", title:"Troca de abate", text:"Boa resposta coletiva quando um jogador é derrubado.", action:"Manter comunicação curta e foco no jogador isolado."}
  ],
  trainings: []
};

let data = loadData();

function cryptoId(){ return (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`); }
function loadData(){
  try{
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : structuredCloneSafe(seed);
  }catch(e){ return structuredCloneSafe(seed); }
}
function structuredCloneSafe(obj){ return JSON.parse(JSON.stringify(obj)); }
function saveData(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
function esc(v=""){ return String(v).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function n(v){ return Math.max(0, Number(v)||0); }
function calcPlayer(p){
  const matches=n(p.matches), kills=n(p.kills), damage=n(p.damage), hs=n(p.headshots);
  const kd=matches ? kills/matches : 0;
  const dmg=matches ? damage/matches : 0;
  const hsPct=kills ? (hs/kills)*100 : 0;
  const rating=Math.min(10, Math.max(0, kd*2.1 + Math.min(dmg/350,3.2) + Math.min(hsPct/25,1.6)));
  return {kd,dmg,hsPct,rating};
}
function format1(v){ return Number(v||0).toLocaleString("pt-BR",{minimumFractionDigits:1,maximumFractionDigits:1}); }
function format2(v){ return Number(v||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}); }
function intFmt(v){ return Math.round(Number(v||0)).toLocaleString("pt-BR"); }

function showPage(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active-page"));
  document.getElementById(id)?.classList.add("active-page");
  document.querySelectorAll(".nav").forEach(x=>x.classList.toggle("active",x.dataset.page===id));
  const names={dashboard:"Dashboard",players:"Jogadores",matches:"Partidas",analysis:"Análises",training:"Treinos"};
  document.getElementById("pageTitle").textContent=names[id]||"RAMBO COACH";
  window.scrollTo(0,0);
}
document.querySelectorAll(".nav").forEach(x=>x.addEventListener("click",()=>showPage(x.dataset.page)));

function render(){
  renderPlayers(); renderMatches(); renderAnalyses(); renderTrainings(); renderDashboard();
}
function renderPlayers(){
  const cards=data.players.map(p=>{
    const s=calcPlayer(p);
    return `<div class="player-card">
      <div class="player-top"><div class="player-avatar">${esc(p.name.slice(0,2).toUpperCase())}</div><div><b>${esc(p.name)}</b><div class="role">${esc(p.role)}</div></div><div class="rating">${format1(s.rating)}<small>RATING</small></div></div>
      <div class="player-metrics"><div class="pm"><small>K/D</small><b>${format2(s.kd)}</b></div><div class="pm"><small>DANO MÉDIO</small><b>${intFmt(s.dmg)}</b></div><div class="pm"><small>HS</small><b>${format1(s.hsPct)}%</b></div></div>
      <div class="card-actions"><button class="small-btn" onclick="editPlayer('${p.id}')">✏ Editar</button><button class="danger-btn" onclick="deletePlayer('${p.id}')">🗑 Excluir</button></div>
    </div>`;
  }).join("");
  document.getElementById("playersGrid").innerHTML=cards||`<div class="empty">Nenhum jogador cadastrado.</div>`;
  document.getElementById("playerRows").innerHTML=data.players.slice(0,4).map(p=>{const s=calcPlayer(p);return `<div class="player-row"><div class="mini-avatar">${esc(p.name.slice(0,2))}</div><div><b>${esc(p.name)}</b><small>${esc(p.role)}</small></div><div class="metric"><strong>${format2(s.kd)}</strong><small>K/D</small></div><div class="metric"><strong>${intFmt(s.dmg)}</strong><small>DANO</small></div></div>`}).join("")||`<div class="empty">Cadastre jogadores para ver o desempenho.</div>`;
}
function renderMatches(){
  document.getElementById("matchesTable").innerHTML=data.matches.map(m=>`<tr><td>${esc(formatDate(m.date))}</td><td>${esc(m.map)}</td><td><b>${m.placement}º</b></td><td>${m.kills}</td><td>${intFmt(m.damage)}</td><td><button class="danger-btn" onclick="deleteMatch('${m.id}')">Excluir</button></td></tr>`).join("")||`<tr><td colspan="6" class="empty">Nenhuma partida registrada.</td></tr>`;
}
function renderAnalyses(){
  const cls=t=>t==="PONTO FORTE"?"green":t==="OBSERVAÇÃO"?"yellow":"red";
  document.getElementById("analysisGrid").innerHTML=data.analyses.map(a=>`<div class="panel"><span class="label ${cls(a.type)}">${esc(a.type)}</span><h3>${esc(a.title)}</h3><p>${esc(a.text)}</p><div class="coach-note">🎯 <b>Próximo passo:</b> ${esc(a.action||"A definir")}</div><div class="analysis-card-actions"><button class="danger-btn" onclick="deleteAnalysis('${a.id}')">Excluir</button></div></div>`).join("")||`<div class="empty">Nenhuma análise cadastrada.</div>`;
}
function renderTrainings(){
  const sorted=[...data.trainings].sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
  const html=sorted.map((t,i)=>`<div class="training-entry"><small>${esc(formatDate(t.date))} • ${esc(t.time)} • ${t.duration} min</small><b>${esc(t.title)}</b><p>${esc(t.goal||"Sem objetivo descrito.")}</p><button class="danger-btn" onclick="deleteTraining('${t.id}')">Excluir</button></div>`).join("");
  document.getElementById("trainingBoard").innerHTML=html||`<div class="empty">Nenhum treino agendado.</div>`;
  document.getElementById("trainingList").innerHTML=sorted.slice(0,3).map((t,i)=>`<div class="training"><i>${String(i+1).padStart(2,"0")}</i><div><b>${esc(t.title)}</b><span>${esc(formatDate(t.date))} • ${esc(t.time)}</span></div><em>Agendado</em></div>`).join("")||`<div class="empty">Nenhum treino agendado.</div>`;
  const mins=sorted.reduce((a,t)=>a+n(t.duration),0);
  document.getElementById("trainingSummary").innerHTML=`<div class="summary-number">${sorted.length}</div><div class="muted">treino(s) agendado(s)</div><div class="summary-number">${mins}</div><div class="muted">minutos planejados</div>`;
}
function renderDashboard(){
  const ms=data.matches;
  const count=ms.length;
  const kills=ms.reduce((a,m)=>a+n(m.kills),0);
  const dmg=ms.reduce((a,m)=>a+n(m.damage),0);
  const booyahs=ms.filter(m=>n(m.placement)===1).length;
  const pos=count?ms.reduce((a,m)=>a+n(m.placement),0)/count:0;
  document.getElementById("dashKills").textContent=count?format1(kills/count):"0,0";
  document.getElementById("dashDmg").textContent=count?intFmt(dmg/count):"0";
  document.getElementById("dashBooyahs").textContent=booyahs;
  document.getElementById("dashMatches").textContent=`${count} partida${count===1?"":"s"}`;
  document.getElementById("dashPlacement").textContent=count?format1(pos):"—";
  document.getElementById("dashKillsSub").textContent=count?`${kills} kills no total`:"sem partidas";
  document.getElementById("dashDmgSub").textContent=count?`${intFmt(dmg)} de dano total`:"sem partidas";
}

function openModal(id){ document.getElementById(id).classList.add("open"); }
function closeModal(id){ document.getElementById(id).classList.remove("open"); }
document.querySelectorAll(".modal-backdrop").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.remove("open")}));
function today(){ return new Date().toISOString().slice(0,10); }
function formatDate(s){ if(!s)return ""; const [y,m,d]=s.split("-"); return `${d}/${m}/${y}`; }
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.style.display="block";clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.style.display="none",2200)}

function openPlayerModal(){
  document.getElementById("playerForm").reset();
  document.getElementById("playerId").value="";
  document.getElementById("playerModalTitle").textContent="Adicionar jogador";
  updatePlayerPreview(); openModal("playerModal");
}
function editPlayer(id){
  const p=data.players.find(x=>x.id===id); if(!p)return;
  playerId.value=p.id; playerName.value=p.name; playerRole.value=p.role; playerMatches.value=p.matches; playerKills.value=p.kills; playerDamage.value=p.damage; playerHeadshots.value=p.headshots;
  playerModalTitle.textContent="Editar jogador"; updatePlayerPreview(); openModal("playerModal");
}
function updatePlayerPreview(){
  const p={matches:playerMatches.value,kills:playerKills.value,damage:playerDamage.value,headshots:playerHeadshots.value};
  const s=calcPlayer(p); previewKD.textContent=format2(s.kd); previewDmg.textContent=intFmt(s.dmg); previewHS.textContent=`${format1(s.hsPct)}%`; previewRating.textContent=format1(s.rating);
}
["playerMatches","playerKills","playerDamage","playerHeadshots"].forEach(id=>document.getElementById(id).addEventListener("input",updatePlayerPreview));
playerForm.addEventListener("submit",e=>{
  e.preventDefault();
  const id=playerId.value;
  const p={id:id||cryptoId(),name:playerName.value.trim().toUpperCase(),role:playerRole.value,matches:n(playerMatches.value),kills:n(playerKills.value),damage:n(playerDamage.value),headshots:n(playerHeadshots.value)};
  if(!p.name)return;
  const ix=data.players.findIndex(x=>x.id===id);
  if(ix>=0)data.players[ix]=p; else data.players.push(p);
  saveData(); render(); closeModal("playerModal"); toast(ix>=0?"Jogador atualizado.":"Jogador adicionado.");
});
function deletePlayer(id){const p=data.players.find(x=>x.id===id);if(p&&confirm(`Excluir ${p.name}?`)){data.players=data.players.filter(x=>x.id!==id);saveData();render();toast("Jogador excluído.");}}

function openMatchModal(){matchForm.reset();matchDate.value=today();openModal("matchModal")}
matchForm.addEventListener("submit",e=>{e.preventDefault();data.matches.unshift({id:cryptoId(),date:matchDate.value,map:matchMap.value,placement:n(matchPlacement.value),kills:n(matchKills.value),damage:n(matchDamage.value)});saveData();render();closeModal("matchModal");toast("Partida registrada.");});
function deleteMatch(id){if(confirm("Excluir esta partida?")){data.matches=data.matches.filter(x=>x.id!==id);saveData();render();toast("Partida excluída.");}}

function openAnalysisModal(){analysisForm.reset();openModal("analysisModal")}
analysisForm.addEventListener("submit",e=>{e.preventDefault();data.analyses.unshift({id:cryptoId(),type:analysisType.value,title:analysisTitle.value.trim(),text:analysisText.value.trim(),action:analysisAction.value.trim()});saveData();render();closeModal("analysisModal");toast("Análise salva.");});
function deleteAnalysis(id){if(confirm("Excluir esta análise?")){data.analyses=data.analyses.filter(x=>x.id!==id);saveData();render();toast("Análise excluída.");}}

function openTrainingModal(){trainingForm.reset();trainingDate.value=today();trainingTime.value="21:00";trainingDuration.value=60;openModal("trainingModal")}
trainingForm.addEventListener("submit",e=>{e.preventDefault();data.trainings.push({id:cryptoId(),date:trainingDate.value,time:trainingTime.value,title:trainingTitle.value.trim(),duration:n(trainingDuration.value),goal:trainingGoal.value.trim()});saveData();render();closeModal("trainingModal");toast("Treino agendado.");});
function deleteTraining(id){if(confirm("Excluir este treino?")){data.trainings=data.trainings.filter(x=>x.id!==id);saveData();render();toast("Treino excluído.");}}

render();
