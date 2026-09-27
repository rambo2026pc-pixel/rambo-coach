const players=[
{name:"R4MBO",role:"IGL / Capitão",rating:"9.4",kills:"2.82",dmg:"1.420",hs:"34%"},
{name:"NEXUS",role:"Rush / Entry",rating:"9.1",kills:"2.61",dmg:"1.310",hs:"38%"},
{name:"K7",role:"Suporte",rating:"8.7",kills:"1.88",dmg:"1.180",hs:"29%"},
{name:"DARK",role:"Fragger",rating:"8.9",kills:"2.45",dmg:"1.260",hs:"36%"},
{name:"ZERO",role:"Flex",rating:"8.5",kills:"1.94",dmg:"1.090",hs:"31%"}];
const matches=[
["26/09/2026","Bermuda","1º","12","1.682"],["26/09/2026","Alpine","3º","10","1.405"],["25/09/2026","NexTerra","2º","11","1.520"],["25/09/2026","Bermuda","5º","7","1.018"],["24/09/2026","Alpine","1º","14","1.721"],["24/09/2026","Bermuda","4º","8","1.104"]];
function render(){
document.getElementById("playerRows").innerHTML=players.slice(0,4).map(p=>`<div class="player-row"><div class="mini-avatar">${p.name.slice(0,2)}</div><div><b>${p.name}</b><small>${p.role}</small></div><div class="metric"><strong>${p.kills}</strong><small>K/D</small></div><div class="metric"><strong>${p.dmg}</strong><small>DANO</small></div></div>`).join("");
document.getElementById("playersGrid").innerHTML=players.map(p=>`<div class="player-card"><div class="player-top"><div class="player-avatar">${p.name.slice(0,2)}</div><div><b>${p.name}</b><div class="role">${p.role}</div></div><div class="rating">${p.rating}<small>RATING</small></div></div><div class="player-metrics"><div class="pm"><small>K/D</small><b>${p.kills}</b></div><div class="pm"><small>DANO</small><b>${p.dmg}</b></div><div class="pm"><small>HS</small><b>${p.hs}</b></div></div></div>`).join("");
document.getElementById("matchesTable").innerHTML=matches.map(m=>`<tr><td>${m[0]}</td><td>${m[1]}</td><td><b>${m[2]}</b></td><td>${m[3]}</td><td>${m[4]}</td><td><span class="pill">Analisada</span></td></tr>`).join("");
}
function showPage(id){document.querySelectorAll(".page").forEach(p=>p.classList.remove("active-page"));document.getElementById(id).classList.add("active-page");document.querySelectorAll(".nav").forEach(n=>n.classList.toggle("active",n.dataset.page===id));const names={dashboard:"Dashboard",players:"Jogadores",matches:"Partidas",analysis:"Análises",training:"Treinos"};document.getElementById("pageTitle").textContent=names[id];window.scrollTo(0,0)}
document.querySelectorAll(".nav").forEach(n=>n.addEventListener("click",()=>showPage(n.dataset.page)));
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.style.display="block";setTimeout(()=>t.style.display="none",2200)}
function addPlayer(){const name=prompt("Nick do novo jogador:");if(name){players.push({name:name.toUpperCase(),role:"A definir",rating:"0.0",kills:"0.00",dmg:"0",hs:"0%"});render();toast("Jogador adicionado ao elenco.")}}
function addMatch(){toast("Tela de registro de partida — pronta para conectar ao banco de dados.")}
function newAnalysis(){toast("Nova análise — módulo de VOD pode ser conectado aqui.")}
function addTraining(){toast("Novo treino — formulário será conectado na próxima etapa.")}
render();