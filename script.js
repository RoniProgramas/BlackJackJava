let mazo = [];
let jogador = [];
let dealer = [];

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

function iniciarJogo() {
    criarMazo();
    // Embaralhar o mazo
    mazo.sort(() => Math.random() - 0.5);

    jogador = [mazo.pop(), mazo.pop()];
    dealer = [mazo.pop(), mazo.pop()];

    // Exibir mãos e pontuações
    console.log(`Mão do Jogador: ${jogador.map(c => c.valor + c.naipe)} | Pontuação ${calcularPontuacao(jogador)}`);
    console.log(`Mão do Dealer: [${dealer[0].valor + dealer[0].naipe}, ?]`);

    // Adicione a lógica para o jogo aqui (turno do jogador e dealer)
}
