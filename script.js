// ===============================
// RAMBO COACH - JOGADORES
// ===============================

const jogadoresPadrao = [
  {
    name: "RAMBO",
    role: "IGL / Capitão",
    rating: "9.4",
    kills: "2.82",
    dmg: "1.420",
    hs: "34%"
  },
  {
    name: "NEXUS",
    role: "Rush / Entry",
    rating: "9.1",
    kills: "2.61",
    dmg: "1.310",
    hs: "38%"
  },
  {
    name: "K7",
    role: "Suporte",
    rating: "8.7",
    kills: "1.88",
    dmg: "1.180",
    hs: "29%"
  },
  {
    name: "DARK",
    role: "Fragger",
    rating: "8.9",
    kills: "2.45",
    dmg: "1.260",
    hs: "36%"
  },
  {
    name: "ZERO",
    role: "Flex",
    rating: "8.5",
    kills: "1.94",
    dmg: "1.090",
    hs: "31%"
  }
];

// Tenta carregar jogadores que já foram salvos
let players;

try {
  const salvos = localStorage.getItem("ramboCoachPlayers");

  players = salvos
    ? JSON.parse(salvos)
    : jogadoresPadrao;
} catch (erro) {
  players = jogadoresPadrao;
}


// ===============================
// PARTIDAS
// ===============================

const matches = [
  ["26/09/2026", "Bermuda", "1º", "12", "1.682"],
  ["26/09/2026", "Alpine", "3º", "10", "1.405"],
  ["25/09/2026", "NexTerra", "2º", "11", "1.520"],
  ["25/09/2026", "Bermuda", "5º", "7", "1.018"],
  ["24/09/2026", "Alpine", "1º", "14", "1.721"],
  ["24/09/2026", "Bermuda", "4º", "8", "1.104"]
];


// ===============================
// SALVAR JOGADORES
// ===============================

function salvarJogadores() {
  localStorage.setItem(
    "ramboCoachPlayers",
    JSON.stringify(players)
  );
}


// ===============================
// RENDERIZAR
// ===============================

function render() {

  const playerRows = document.getElementById("playerRows");

  if (playerRows) {
    playerRows.innerHTML = players
      .slice(0, 4)
      .map(
        p => `
        <div class="player-row">

          <div class="mini-avatar">
            ${p.name.slice(0, 2)}
          </div>

          <div>
            <b>${p.name}</b>
            <small>${p.role}</small>
          </div>

          <div class="metric">
            <strong>${p.kills}</strong>
            <small>K/D</small>
          </div>

          <div class="metric">
            <strong>${p.dmg}</strong>
            <small>DANO</small>
          </div>

        </div>
      `
      )
      .join("");
  }


  const playersGrid = document.getElementById("playersGrid");

  if (playersGrid) {
    playersGrid.innerHTML = players
      .map(
        p => `
        <div class="player-card">

          <div class="player-top">

            <div class="player-avatar">
              ${p.name.slice(0, 2)}
            </div>

            <div>
              <b>${p.name}</b>
              <div class="role">${p.role}</div>
            </div>

            <div class="rating">
              ${p.rating}
              <small>AVALIAÇÃO</small>
            </div>

          </div>

          <div class="player-metrics">

            <div class="pm">
              <small>K/D</small>
              <b>${p.kills}</b>
            </div>

            <div class="pm">
              <small>DANO</small>
              <b>${p.dmg}</b>
            </div>

            <div class="pm">
              <small>HS</small>
              <b>${p.hs}</b>
            </div>

          </div>

        </div>
      `
      )
      .join("");
  }


  const matchesTable = document.getElementById("matchesTable");

  if (matchesTable) {
    matchesTable.innerHTML = matches
      .map(
        m => `
        <tr>
          <td>${m[0]}</td>
          <td>${m[1]}</td>
          <td><b>${m[2]}</b></td>
          <td>${m[3]}</td>
          <td>${m[4]}</td>
          <td>
            <span class="pill">Analisada</span>
          </td>
        </tr>
      `
      )
      .join("");
  }
}


// ===============================
// TROCAR DE PÁGINA
// ===============================

function showPage(id) {

  document
    .querySelectorAll(".page")
    .forEach(p => p.classList.remove("active-page"));

  const pagina = document.getElementById(id);

  if (pagina) {
    pagina.classList.add("active-page");
  }

  document
    .querySelectorAll(".nav")
    .forEach(n =>
      n.classList.toggle(
        "active",
        n.dataset.page === id
      )
    );
}


document
  .querySelectorAll(".nav")
  .forEach(n =>
    n.addEventListener(
      "click",
      () => showPage(n.dataset.page)
    )
  );


// ===============================
// AVISO
// ===============================

function toast(msg) {

  const t = document.getElementById("toast");

  if (!t) {
    alert(msg);
    return;
  }

  t.textContent = msg;
  t.style.display = "block";

  setTimeout(() => {
    t.style.display = "none";
  }, 2200);
}


// ===============================
// ADICIONAR JOGADOR
// ===============================


function addPlayer() {
  const modal = document.getElementById("playerModal");

  if (!modal) {
    alert("Modal de jogador não encontrado.");
    return;
  }

  modal.classList.add("open");

  setTimeout(() => {
    document.getElementById("playerName")?.focus();
  }, 100);
}

function fecharPlayerModal() {
  const modal = document.getElementById("playerModal");
  if (modal) modal.classList.remove("open");
}

function salvarNovoJogador() {
  const nome = document.getElementById("playerName").value.trim();
  const funcao = document.getElementById("playerRole").value;

  const kills =
    document.getElementById("playerKills").value.trim() || "0.00";

  const dmg =
    document.getElementById("playerDmg").value.trim() || "0";

  let hs =
    document.getElementById("playerHs").value.trim() || "0";

  const rating =
    document.getElementById("playerRating").value.trim() || "0.0";

  if (!nome) {
    alert("Digite o nick do jogador.");
    document.getElementById("playerName").focus();
    return;
  }

  if (!hs.includes("%")) {
    hs += "%";
  }

  const novoJogador = {
    name: nome.toUpperCase(),
    role: funcao,
    rating: rating,
    kills: kills,
    dmg: dmg,
    hs: hs
  };

  players.push(novoJogador);

  // salva no navegador
  salvarJogadores();

  // atualiza os cards
  render();

  // limpa o formulário
  document.getElementById("playerName").value = "";
  document.getElementById("playerKills").value = "";
  document.getElementById("playerDmg").value = "";
  document.getElementById("playerHs").value = "";
  document.getElementById("playerRating").value = "";

  // fecha a janela
  fecharPlayerModal();

  toast("Jogador adicionado e salvo!");
}
  // ATUALIZA A TELA
  render();

  toast("Jogador adicionado e salvo!");
}


// ===============================
// OUTROS BOTÕES
// ===============================

function addMatch() {
  toast(
    "Tela de registro de partida — pronta para conectar ao banco de dados."
  );
}


function newAnalysis() {
  toast(
    "Nova análise — módulo de VOD pode ser conectado aqui."
  );
}


function addTraining() {
  toast(
    "Novo treino — formulário será conectado na próxima etapa."
  );
}


// ===============================
// INICIAR
// ===============================

render();
