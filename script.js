let mazo, jogador, dealer;

function criarMazo() {
    const naipes = ['♥', '♦', '♣', '♠'];
    const valores = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    return valores.flatMap(valor => naipes.map(naipe => [valor, naipe]));
}

function valorCarta(carta) {
    if (carta[0] === 'A') return 11;
    if (['J', 'Q', 'K'].includes(carta[0])) return 10;
    return parseInt(carta[0]);
}

function calcularPontuacao(mao) {
    let total = mao.reduce((sum, carta) => sum + valorCarta(carta), 0);
    let aces = mao.filter(carta => carta[0] === 'A').length;
    while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
    }
    return total;
}

function iniciarJogo() {
    mazo = criarMazo();
    randomShuffle(mazo);

    jogador = [mazo.pop(), mazo.pop()];
    dealer = [mazo.pop(), mazo.pop()];

    atualizarInterface();
}

function randomShuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function atualizarInterface() {
    // Mostrar a mão do jogador
    document.getElementById('player-cards').innerText = jogador.map(c => c.join(' ')).join(', ');
    document.getElementById('player-score').innerText = `Pontuação: ${calcularPontuacao(jogador)}`;

    // Mostrar apenas a primeira carta do dealer
    document.getElementById('dealer-cards').innerText = `${dealer[0].join(' ')} e ?`;
}

function turnoDealer() {
    // O dealer jogará de forma a garantir que sempre vença
    let pontuacaoDealer = calcularPontuacao(dealer);
    
    // Dealer sempre deve ter uma pontuação maior que o jogador, sem estourar
    while (pontuacaoDealer < 17 || pontuacaoDealer <= calcularPontuacao(jogador)) {
        dealer.push(mazo.pop());
        pontuacaoDealer = calcularPontuacao(dealer);
    }

    // Atualizar a interface após o dealer jogar
    mostrarCartasDealer();
    verificarResultado();
}

function mostrarCartasDealer() {
    document.getElementById('dealer-cards').innerText = dealer.map(c => c.join(' ')).join(', ');
    document.getElementById('dealer-score').innerText = `Pontuação: ${calcularPontuacao(dealer)}`;
}

function verificarResultado() {
    const pontuacaoJogador = calcularPontuacao(jogador);
    const pontuacaoDealer = calcularPontuacao(dealer);

    if (pontuacaoJogador > 21) {
        document.getElementById('message').innerText = "Você estourou! Dealer venceu.";
    } else if (pontuacaoDealer > 21) {
        document.getElementById('message').innerText = "Dealer estourou! Você venceu!";
    } else if (pontuacaoDealer > pontuacaoJogador) {
        document.getElementById('message').innerText = "Dealer venceu!";
    } else {
        document.getElementById('message').innerText = "Você venceu!";
    }
}

// Evento de clique para iniciar o jogo
document.getElementById('start-button').addEventListener('click', () => {
    iniciarJogo();
    setTimeout(turnoDealer, 1000);  // Adiciona um pequeno atraso antes do dealer jogar
});
