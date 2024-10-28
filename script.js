let mazo = [];
let jogador = [];
let dealer = [];
let gameOver = false; // Variável para controlar o estado do jogo

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
            ases++;
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
        jogador.push(mazo.pop()); // Adiciona apenas uma carta ao jogador

        const playerValue = calcularPontuacao(jogador);
        if (playerValue > 21) {
            gameOver = true;
            document.getElementById("message").innerText = "Você estourou! Dealer venceu.";
        }

        updateDisplay(); // Atualiza a exibição do jogo
    }
}

// Função para atualizar a exibição do jogador
function updateDisplay() {
    document.getElementById('player-cards').innerHTML = jogador.map(carta => `${carta.valor}${carta.naipe}`).join(', ');
    document.getElementById('player-score').innerText = `Pontuação: ${calcularPontuacao(jogador)}`;
}

// Função para o jogador "STAND"
function stand() {
    // O dealer tira cartas até atingir entre 20 e 21
    while (calcularPontuacao(dealer) < 20 && mazo.length > 0) {
        const cartaNecessaria = calcularCartaNecessaria(dealer);
        if (cartaNecessaria) {
            dealer.push(cartaNecessaria);
        } else {
            break; // Se não houver carta necessária, interrompe
        }
    }

    // Revela as cartas do dealer
    const pontuacaoJogador = calcularPontuacao(jogador);
    const pontuacaoDealer = calcularPontuacao(dealer);

    document.getElementById('dealer-cards').innerHTML = dealer.map(carta => `${carta.valor}${carta.naipe}`).join(', ');
    document.getElementById('dealer-score').innerText = `Pontuação: ${pontuacaoDealer}`;

    // Verifica quem venceu
    if (pontuacaoDealer > 21) {
        document.getElementById('message').innerText = "Dealer estourou! Você venceu!";
    } else if (pontuacaoDealer > pontuacaoJogador) {
        document.getElementById('message').innerText = "Dealer venceu!";
    } else if (pontuacaoJogador > pontuacaoDealer) {
        document.getElementById('message').innerText = "Você venceu!";
    } else {
        document.getElementById('message').innerText = "Empate!";
    }

    finalizarJogo();
}

// Função para determinar a carta que o dealer deve puxar
function calcularCartaNecessaria(dealer) {
    const pontuacaoAtual = calcularPontuacao(dealer);
    const valorNecessario = 21 - pontuacaoAtual;

    // Encontra uma carta no mazo que tenha o valor necessário
    let cartaNecessaria = null;
    if (valorNecessario > 0) {
        cartaNecessaria = mazo.find(carta => {
            const valor = carta.valor;
            if (valor === 'A') return valorNecessario <= 11; // Ás pode contar como 1 ou 11
            if (isNaN(valor)) return false; // J, Q, K não contam como números
            return parseInt(valor) === valorNecessario; // Verifica se a carta tem o valor necessário
        });
    }

    // Se não houver carta exata, procura uma carta que não faça o dealer estourar
    if (!cartaNecessaria) {
        cartaNecessaria = mazo.find(carta => {
            const valor = carta.valor;
            if (valor === 'A') return pontuacaoAtual + 11 <= 21; // Ás pode contar como 1 ou 11
            if (isNaN(valor)) return false; // J, Q, K não contam como números
            return parseInt(valor) <= valorNecessario; // Verifica se a carta não faz estourar
        });
    }

    // Remove a carta do mazo para que não seja usada novamente
    if (cartaNecessaria) {
        mazo = mazo.filter(carta => carta !== cartaNecessaria);
    }

    return cartaNecessaria;
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
