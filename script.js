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
    let total = mao.reduce((acc, carta) => acc + valorCarta(carta), 0);
    let ases = mao.filter(carta => carta[0] === 'A').length;
    while (total > 21 && ases > 0) {
        total -= 10;
        ases--;
    }
    return total;
}

function iniciarJogo() {
    mazo = criarMazo();
    mazo.sort(() => Math.random() - 0.5); // Embaralhar o mazo

    jogador = [mazo.pop(), mazo.pop()];
    dealer = [mazo.pop(), mazo.pop()];

    atualizarInterface();
function turnoDealer() {
    // O dealer deve tirar cartas até atingir pelo menos 19
    while (calcularPontuacao(dealer) < 19) {
        dealer.push(mazo.pop());
    }

    // Atualizar a interface para mostrar a mão do dealer
    document.getElementById('dealer-cards').innerText = dealer.map(c => c.join(' ')).join(', ');
    document.getElementById('dealer-score').innerText = `Pontuação: ${calcularPontuacao(dealer)}`;

    // Verificar o resultado do jogo
    verificarResultado();
}

function verificarResultado() {
    const pontuacaoJogador = calcularPontuacao(jogador);
    const pontuacaoDealer = calcularPontuacao(dealer);

    if (pontuacaoJogador > 21) {
        document.getElementById('message').innerText = "Você estourou! Dealer venceu.";
    } else if (pontuacaoDealer > 21 || pontuacaoJogador > pontuacaoDealer) {
        document.getElementById('message').innerText = "Você venceu!";
    } else if (pontuacaoJogador < pontuacaoDealer) {
        document.getElementById('message').innerText = "Dealer venceu!";
    } else {
        document.getElementById('message').innerText = "Empate!";
    }
}

function atualizarInterface() {
    document.getElementById('player-cards').innerText = jogador.map(c => c.join(' ')).join(', ');
    document.getElementById('player-score').innerText = `Pontuação: ${calcularPontuacao(jogador)}`;
    document.getElementById('dealer-cards').innerText = `${dealer[0].join(' ')} e ?`;
}

// Evento de clique para iniciar o jogo
document.getElementById('start-button').addEventListener('click', () => {
    iniciarJogo();
    turnoDealer();  // Adiciona o turno do dealer assim que o jogo inicia
});

// Evento de clique para iniciar o jogo
document.getElementById('start-button').addEventListener('click', iniciarJogo);
