let mazo = [];
let jogador = [];
let dealer = [];
let playerHand = [];
let gameOver = false;

// Função para criar o mazo de cartas
function criarMazo() {
  const naipes = ['♥', '♦', '♣', '♠'];
  const valores = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  return valores.flatMap(valor => naipes.map(naipe => ({ valor, naipe })));
}

// Função para calcular a pontuação
function calcularPontuacao(mao) {
  let total = 0;
  let ases = 0;

  mao.forEach(carta => {
    if (['J', 'Q', 'K'].includes(carta.valor)) {
      total += 10;
    } else if (carta.valor === 'A') {
      total += 11;
      ases += 1;
    } else {
      total += parseInt(carta.valor);
    }
  });

  while (total > 21 && ases) {
    total -= 10;
    ases--;
  }
  return total;
}

// Função para iniciar o jogo
function iniciarJogo() {
  mazo = criarMazo();
  shuffle(mazo);

  jogador = [mazo.pop(), mazo.pop()];
  dealer = [mazo.pop()];

  playerHand = []; // Limpa a mão do jogador no início de cada rodada
  gameOver = false;

  document.getElementById('player-cards').innerHTML = jogador.map(carta => `${carta.valor}${carta.naipe}`).join(', ');
  document.getElementById('player-score').innerText = `Pontuação: ${calcularPontuacao(jogador)}`;

  document.getElementById('dealer-cards').innerHTML = `${dealer[0].valor}${dealer[0].naipe}, ?`;
  document.getElementById('dealer-score').innerText = '';

  document.getElementById('hit-button').disabled = false;
  document.getElementById('stand-button').disabled = false;
  document.getElementById('message').innerText = '';
}

// Função para embaralhar o mazo
function shuffle(array) {
  // ... (código original)
}

// Função para o jogador "HIT"
function hit() {
  if (!gameOver) {
    playerHand.push(mazo.pop());
    const playerValue = calcularPontuacao(playerHand);
    if (playerValue > 21) {
      gameOver = true;
      document.getElementById("message").innerText = "Você estourou! Dealer venceu.";
    }
    updateDisplay();
  }
}

// Função para o jogador "STAND"
function stand() {
  // ... (código original para o dealer revelar suas cartas e determinar o vencedor)
}

// Função para atualizar a interface
function updateDisplay() {
  document.getElementById('player-cards').innerHTML = playerHand.map(carta => `${carta.valor}${carta.naipe}`).join(', ');
  document.getElementById('player-score').innerText = `Pontuação: ${calcularPontuacao(playerHand)}`;

  if (gameOver) {
    document.getElementById('hit-button').disabled = true;
    document.getElementById('stand-button').disabled = true;
  } else {
    // Habilitar ou desabilitar outros botões conforme necessário
  }
}

// Eventos dos botões
document.getElementById('start-button').addEventListener('click', iniciarJogo);
document.getElementById('hit-button').addEventListener('click', hit);
document.getElementById('stand-button').addEventListener('click', stand);
