let mazo = [];
let jogador = [];
let dealer = [];
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
    dealer = [mazo.pop()]; // Apenas uma carta visível do dealer
    gameOver = false;

    document.getElementById('player-cards').innerHTML = jogador.map(carta => `${carta.valor}${carta.naipe}`).join(', ');
    document.getElementById('player-score').innerText = `Pontuação: ${calcularPontuacao(jogador)}`;
    
    document.getElementById('dealer-cards').innerHTML = `${dealer[0].valor}${dealer[0].naipe}, ?`; // Exibe apenas uma carta do dealer
    document.getElementById('dealer-score').innerText = '';
    
    document.getElementById('hit-button').disabled = false;
    document.getElementById('stand-button').disabled = false;
    document.getElementById('message').innerText = '';
}

// Função para embaralhar o mazo
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Função para o jogador "HIT"
function hit() {
    if (!gameOver) {
        
        document.getElementById('hit-button').disabled = true;

        jogador.push(mazo.pop());
        const playerValue = calcularPontuacao(jogador);

        if (playerValue > 21) {
            gameOver = true;
            document.getElementById("message").innerText = "Você estourou! Dealer venceu.";
        }

        updateDisplay(); // Atualiza a interface

        // Reativa o botão após a atualização da interface
        setTimeout(() => {
            document.getElementById('hit-button').disabled = false;
        }, 2000);
    }
}

// Função para atualizar a interface do jogo
function updateDisplay() {
    document.getElementById('player-cards').innerHTML = jogador.map(carta => `${carta.valor}${carta.naipe}`).join(', ');
    document.getElementById('player-score').innerText = `Pontuação: ${calcularPontuacao(jogador)}`;
}

// Função para o jogador "STAND"
function stand() {
    while (calcularPontuacao(dealer) < 17) {
        dealer.push(mazo.pop());
    }

    ajustarPontuacaoDealer();

    const pontuacaoJogador = calcularPontuacao(jogador);
    const pontuacaoDealer = calcularPontuacao(dealer);

    document.getElementById('dealer-cards').innerHTML = dealer.map(carta => `${carta.valor}${carta.naipe}`).join(', ');
    document.getElementById('dealer-score').innerText = `Pontuação: ${pontuacaoDealer}`;

    if (pontuacaoDealer > pontuacaoJogador) {
        document.getElementById('message').innerText = "Dealer venceu!";
    } else if (pontuacaoJogador > pontuacaoDealer) {
        document.getElementById('message').innerText = "Você venceu!";
    } else {
        document.getElementById('message').innerText = "Empate!";
    }

    finalizarJogo();
}

// Função para garantir que o dealer sempre tenha entre 19 e 21
function ajustarPontuacaoDealer() {
    let pontuacaoDealer = calcularPontuacao(dealer);

    while (pontuacaoDealer < 19 || pontuacaoDealer > 21) {
        dealer.pop();
        const novaCarta = mazo.find(carta => {
            const novaMao = [...dealer, carta];
            const novaPontuacao = calcularPontuacao(novaMao);
            return novaPontuacao >= 19 && novaPontuacao <= 21;
        });
        
        if (novaCarta) {
            dealer.push(novaCarta);
            mazo = mazo.filter(carta => carta !== novaCarta);
            pontuacaoDealer = calcularPontuacao(dealer);
        } else {
            break;
        }
    }
}

// Função para finalizar o jogo
function finalizarJogo() {
    document.getElementById('hit-button').disabled = true;
    document.getElementById('stand-button').disabled = true;
}

// Eventos dos botões
document.getElementById('start-button').addEventListener('click', iniciarJogo);
document.getElementById('hit-button').addEventListener('click', hit);
document.getElementById('stand-button').addEventListener('click', stand);
