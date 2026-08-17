// pcm 20172018a Blackjack oop

let game = null;

function debug(an_object) {
  document.getElementById("debug").innerHTML = JSON.stringify(an_object);
}

// Esta função lida com o clique inicial do utilizador
function startGameForReal() {
  // 1. Toca o som imediatamente (isto diz ao navegador que o áudio é legítimo)
  playCardSound();
  
  // 2. Esconde o ecrã de boas-vindas com uma transição suave
  const welcome = document.getElementById("welcome_screen");
  welcome.classList.add("opacity-0", "pointer-events-none");
  
  // 3. Inicia o jogo e distribui as cartas já com som ativo
  setTimeout(function() {
    new_game();
  }, 200);
}

function buttons_initialization() {
  document.getElementById("card").disabled = false;
  document.getElementById("stand").disabled = false;
  document.getElementById("new_game").disabled = true;
}

function finalize_buttons() {
  document.getElementById("card").disabled = true;
  document.getElementById("stand").disabled = true;
  document.getElementById("new_game").disabled = false;
}

//FUNÇÕES QUE DEVEM SER IMPLEMENTADOS PELOS ALUNOS
function new_game() {
  game = new BlackJack();

  reset_cards();
  
  playCardSound();
  setTimeout(playCardSound, 150); // Segunda carta 150ms depois
  setTimeout(playCardSound, 300);
  game.dealer_move();
  game.dealer_move();
  game.player_move();
  let dealer_show = game.get_dealer_cards().slice();
  card_dealer_display(dealer_show[0], "");
  card_dealer_display(dealer_show[1], "X");

  let player_show = game.get_player_cards().slice();
  
  card_player_display(player_show[0]);

  document.getElementById("player_won").style.visibility = "hidden";
  document.getElementById("player_won").style.display = "none";
  document.getElementById("dealer_won").style.visibility = "hidden";
  document.getElementById("dealer_won").style.display = "none";

  document.getElementById("player_won_string").style.visibility = "hidden";
  document.getElementById("player_won_string").style.display = "none";
  document.getElementById("dealer_won_string").style.visibility = "hidden";
  document.getElementById("dealer_won_string").style.display = "none";

  document.getElementById("player_points").innerHTML = game.get_cards_value(player_show)
  document.getElementById("dealer_points").innerHTML = dealer_show[0][0]

  buttons_initialization();
}

function update_dealer(state) {
  document.getElementById("dealer").childNodes[1].className = "card shadow";
  let cards = game.get_dealer_cards();
  document.getElementById("dealer_points").innerHTML = game.get_cards_value(cards)
  if (state.gameEnded) {
    if (cards.length !== 2) {
      card_dealer_display(cards[cards.length - 1]);
    }
    if (state.dealerWon || state.playerBusted) {
      document.getElementById("dealer_won").style.visibility = "visible";
      document.getElementById("dealer_won").style.display = "inline";

      document.getElementById("dealer_won_string").style.visibility = "visible";
      document.getElementById("dealer_won_string").style.display = "inline";
    }
    
    finalize_buttons();
  }
}

function update_player(state) {
  let cards = game.get_player_cards();
  document.getElementById("player_points").innerHTML = game.get_cards_value(cards)
  console.log("Player: " + game.get_cards_value(cards))
  if (state.gameEnded) {
    if ((!state.dealerWon) && (!state.playerBusted)) {
      document.getElementById("player_won_string").style.visibility = "visible";
      document.getElementById("player_won_string").style.display = "inline";

      document.getElementById("player_won").style.visibility = "visible";
      document.getElementById("player_won").style.display = "inline";
    }

    if(state.dealerWon) {
      document.getElementById("player_won").style.display = "none";
      document.getElementById("player_won").style.visibility = "hidden";
    }

    finalize_buttons();
  }
  
  card_player_display(cards[cards.length - 1]);
}

function dealer_new_card() {
  game.dealer_move();
  update_dealer(game.get_game_state());
  return game.get_game_state();
}

function player_new_card() {
  playCardSound();
  game.player_move();
  
  update_player(game.get_game_state());
  if(game.get_cards_value(game.get_player_cards()) >= 21){
    dealer_finish();
  }

  return game.get_game_state();
}

function dealer_finish() {
  playCardSound();
  game.setDealerTurn(true);
  let state = game.get_game_state();
  update_dealer(state);

  while (state.gameEnded === false) {
    dealer_new_card(state);

    state = game.get_game_state();
  }
  if (state.gameEnded && (game.get_cards_value(game.get_dealer_cards()) > 21)) {
    document.getElementById("player_won_string").style.visibility = "visible";
    document.getElementById("player_won_string").style.display = "inline";

    document.getElementById("player_won").style.visibility = "visible";
    document.getElementById("player_won").style.display = "inline";
  }
  console.log("Dealer: " + game.get_cards_value(game.get_dealer_cards()))
}

function card_player_display(card) {
  let c = document.createElement("div");
  c.setAttribute("class", "card shadow");
  if (card[1] === '&hearts;' || card[1] === '&diams;') {
    for (let i = 0; i < 5; i++) {
      let d = document.createElement("span");
      switch(i) {
        case 0:
          d.setAttribute("class", "rank red");
          d.innerHTML = setCorrectCard(card[0]);
          break;
        
        case 1:
          d.setAttribute("class", "suit red");
          d.innerHTML = card[1];
          break;
        
        case 2:
          d.setAttribute("class", "center red");
          d.innerHTML = card[1];
          break;
        
        case 3:
          d.setAttribute("class", "suit red rank-right");
          d.innerHTML = card[1];
          break;
        
        case 4:
          d.setAttribute("class", "rank red rank-right");
          d.innerHTML = setCorrectCard(card[0]);
          break;
      }
      c.appendChild(d);
    }
  }
  else {
    for (let i = 0; i < 5; i++) {
      let d = document.createElement("span");
      switch(i) {
        case 0:
          d.setAttribute("class", "rank black");
          d.innerHTML = setCorrectCard(card[0]);
          break;
        
        case 1:
          d.setAttribute("class", "suit black");
          d.innerHTML = card[1];
          break;
        
        case 2:
          d.setAttribute("class", "center black");
          d.innerHTML = card[1];
          break;
        
        case 3:
          d.setAttribute("class", "suit black rank-right");
          d.innerHTML = card[1];
          break;
        
        case 4:
          d.setAttribute("class", "rank black rank-right");
          d.innerHTML = setCorrectCard(card[0]);
          break;
      }
      c.appendChild(d);
    }
  }
  document.getElementById("player").appendChild(c);
}

function card_dealer_display(card, string) {
  let c = document.createElement("div");
  if (string === 'X') {
    c.setAttribute("class", "card shadow back");
  }
  else {
      c.setAttribute("class", "card shadow");
  }
  if (card[1] === '&hearts;' || card[1] === '&diams;') {
    for (let i = 0; i < 5; i++) {
      let d = document.createElement("span");
      switch(i) {
        case 0:
          d.setAttribute("class", "rank red");
          d.innerHTML = setCorrectCard(card[0]);
          break;
        
        case 1:
          d.setAttribute("class", "suit red");
          d.innerHTML = card[1];
          break;
        
        case 2:
          d.setAttribute("class", "center red");
          d.innerHTML = card[1];
          break;
        
        case 3:
          d.setAttribute("class", "suit red rank-right");
          d.innerHTML = card[1];
          break;
        
        case 4:
          d.setAttribute("class", "rank red rank-right");
          d.innerHTML = setCorrectCard(card[0]);
          break;
      }
      c.appendChild(d);
    }
  }
  else {
    for (let i = 0; i < 5; i++) {
      let d = document.createElement("span");
      switch(i) {
        case 0:
          d.setAttribute("class", "rank black");
          d.innerHTML = setCorrectCard(card[0]);
          break;
        
        case 1:
          d.setAttribute("class", "suit black");
          d.innerHTML = card[1];
          break;
        
        case 2:
          d.setAttribute("class", "center black");
          d.innerHTML = card[1];
          break;
        
        case 3:
          d.setAttribute("class", "suit black rank-right");
          d.innerHTML = card[1];
          break;
        
        case 4:
          d.setAttribute("class", "rank black rank-right");
          d.innerHTML = setCorrectCard(card[0]);
          break;
      }
      c.appendChild(d);
    }
  }
  document.getElementById("dealer").appendChild(c);
}

function setCorrectCard(valorCard) {
  if (valorCard > 1 && valorCard < 11) {
    return valorCard;
  }
  else {
    switch(valorCard) {
      case 1:
        return "A";
      
      case 11:
        return "J";

      case 12:
        return "Q";

      case 13: 
        return "K";
    }
  }
}

function reset_cards(){
  let player = document.getElementById("player")
  let dealer = document.getElementById("dealer")
  if(player.hasChildNodes()){
      while(player.hasChildNodes())
          player.removeChild(player.lastChild)
  
      while(dealer.hasChildNodes())
          dealer.removeChild(dealer.lastChild)
  }
}

// O som real da carta convertido diretamente em números decimais.
// Sem strings, sem letras, sem atob(). Zero hipóteses de dar erro de caracteres.
const CARD_SOUND_BYTES = new Uint8Array([
  82,73,70,70,100,7,0,0,87,65,86,69,102,109,116,32,16,0,0,0,1,0,1,0,64,31,0,0,
  64,31,0,0,1,0,8,0,100,97,116,97,64,7,0,0,127,127,127,127,135,145,150,142,
  127,112,105,110,127,144,155,148,127,106,96,104,127,148,160,152,127,102,90,
  98,127,152,165,155,127,98,84,92,127,155,168,158,127,95,79,88,127,158,171,
  160,127,92,75,84,127,160,173,162,127,90,72,81,127,161,174,163,127,89,70,
  79,127,162,175,164,127,88,69,78,127,162,175,164,127,88,69,78,127,161,174,
  163,127,89,71,80,127,159,171,161,127,91,74,83,127,156,167,158,127,94,79,
  87,127,153,162,154,127,98,85,93,127,149,156,150,127,103,92,99,127,144,150,
  145,127,109,100,106,127,139,143,140,127,115,108,113,127,134,137,135,127,
  120,115,119,127,130,131,130,127,124,122,124,127,127,127,127,127,127,127,
  127,127,128,129,129,128,127,126,125,126,127,128,130,129,127,125,123,124,
  127,129,132,130,127,124,121,123,127,130,134,131,127,122,119,121,127,132,
  136,133,127,121,116,119,127,133,138,134,127,119,114,117,127,135,139,135,
  127,118,113,116,127,136,141,136,127,117,111,114,127,137,142,137,127,116,
  110,113,127,137,142,137,127,116,110,113,127,137,142,137,127,116,110,113,
  127,137,141,136,127,117,111,114,127,136,140,135,127,118,113,116,127,134,
  138,134,127,120,115,118,127,133,136,132,127,121,117,120,127,131,134,131,
  127,123,119,122,127,130,132,129,127,124,122,124,127,128,129,128,127,126,
  125,126,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,
  127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,
  127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127
]);

let audioContext = null;
let audioBuffer = null;

function playCardSound() {
  try {
    if (!audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioContextClass();
    }

    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    // Se já foi descodificado antes, toca logo
    if (audioBuffer) {
      runAudioSource();
      return;
    }

    // Criamos o Buffer diretamente da memória através do Array numérico seguro
    // Criamos uma cópia (.slice().buffer) para o decodeAudioData poder consumir em segurança
    const arrayBuffer = CARD_SOUND_BYTES.slice().buffer;

    audioContext.decodeAudioData(arrayBuffer, (buffer) => {
      audioBuffer = buffer;
      runAudioSource();
    }, (err) => {
      console.log("Erro na descodificação do áudio:", err);
    });

  } catch (e) {
    console.log("Erro no sistema de áudio:", e);
  }
}

function runAudioSource() {
  if (!audioBuffer || !audioContext) return;

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;

  const gainNode = audioContext.createGain();
  gainNode.gain.setValueAtTime(0.35, audioContext.currentTime); // Volume confortável de 35%

  source.connect(gainNode);
  gainNode.connect(audioContext.destination);

  source.start(0);
}