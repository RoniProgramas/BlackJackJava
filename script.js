let mazo = [];
let jogador = [];
let dealer = [];
let jogoAtivo = false;

function criarMazo() {
    const naipes = ['♥', '♦', '♣', '♠'];
    const valores = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    mazo = [];
    for (const naipe of naipes) {
        for (const valor of valores) {
            mazo.push({ valor, naipe });
        }
    }
}

function valorCarta(carta) {
    if (carta.valor === 'J' || carta.valor === 'Q' || carta.valor === 'K') {
        return 10;
    } else if (carta.valor === 'A') {
        return 11;
    } else {
        return parseInt(carta.valor);
    }
}

function calcularPontuacao(mao) {
    let total = 0;
    let aces = 0;
    for (const carta of mao) {
        total += valorCarta(carta);
        if (carta.valor === 'A') aces++;
    }
    while (total > 21 && aces) {
        total -= 10;
        aces--;
    }
    return total;
}

function atualizarInterface() {
    // Atualiza a interface do jogador
    document.getElementById('player-cards').innerHTML = jogador.map(c => `${c.valor}${c.naipe}`).join(', ');
    document.getElementById('player-score').innerText = `Pontuação: ${calcularPontuacao(jogador)}`;
    
    // Atualiza a interface do dealer
    document.getElementById('dealer-cards').innerHTML = dealer.map(c => `${c.valor}${c.naipe}`).join(', ');
    document.getElementById('dealer-score').innerText = `Pontuação: ${calcularPontuacao(dealer)}`;

    // Verifica se o jogo acabou
    if (jogoAtivo) {
        const pontuacaoJogador = calcularPontuacao(jogador);
        const pontuacaoDealer = calcularPontuacao(dealer);
        if (pontuacaoJogador > 21) {
            document.getElementById('message').innerText = 'Você estourou! Dealer venceu.';
            jogoAtivo = false;
        }
    }
}

function iniciarJogo() {
    criarMazo();
    mazo.sort(() => Math.random() - 0.5);

    jogador = [mazo.pop(), mazo.pop()];
    dealer = [mazo.pop(), mazo.pop()];

    jogoAtivo = true;
    document.getElementById('hit-button').disabled = false;
    document.getElementById('stand-button').disabled = false;

    atualizarInterface();
}

// Adicione as funções hit() e stand()
function hit() {
    if (jogoAtivo) {
        jogador.push(mazo.pop());
        atualizarInterface();
    }
}

function stand() {
    if (jogoAtivo) {
        while (calcularPontuacao(dealer) < 17) {
            dealer.push(mazo.pop());
        }
        atualizarInterface();

        const pontuacaoJogador = calcularPontuacao(jogador);
        const pontuacaoDealer = calcularPontuacao(dealer);

        if (pontuacaoDealer > 21) {
            document.getElementById('message').innerText = 'Dealer estourou! Você venceu.';
        } else if (pontuacaoJogador > pontuacaoDealer) {
            document.getElementById('message').innerText = 'Você venceu!';
        } else if (pontuacaoJogador < pontuacaoDealer) {
            document.getElementById('message').innerText = 'Dealer venceu!';
        } else {
            document.getElementById('message').innerText = 'Empate!';
        }

        jogoAtivo = false;
        document.getElementById('hit-button').disabled = true;
        document.getElementById('stand-button').disabled = true;
    }
}
