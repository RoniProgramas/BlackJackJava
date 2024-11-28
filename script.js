let mazo = [];
let jogador = [];
let dealer = [];
let gameOver = false;
let playerWins = 0;
let dealerWins = 0;

function criarMazo() {
    const naipes = ['♥', '♦', '♣', '♠'];
    const valores = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    return valores.flatMap(valor => naipes.map(naipe => ({ valor, naipe })));
}


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


function iniciarJogo() {
    mazo = criarMazo();
    shuffle(mazo);
    
    jogador = [mazo.pop(), mazo.pop()];
    dealer = [mazo.pop()]; 
    gameOver = false;

   
    document.getElementById('player-cards').innerHTML = jogador.map(carta => {
        return `<img src="imagens/${carta.valor}${carta.naipe}.png" alt="${carta.valor}${carta.naipe}" class="card">`;
    }).join('');
    document.getElementById('player-score').innerText = `Pontuação: ${calcularPontuacao(jogador)}`;

    
    document.getElementById('dealer-cards').innerHTML = `<img src="imagens/${dealer[0].valor}${dealer[0].naipe}.png" alt="${dealer[0].valor}${dealer[0].naipe}" class="card">, ?`;
    document.getElementById('dealer-score').innerText = '';

    document.getElementById('hit-button').disabled = false;
    document.getElementById('stand-button').disabled = false;
    document.getElementById('message').innerText = '';
}



function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


function hit() {
    if (!gameOver) {
        console.log("Hit button clicked"); 
        document.getElementById('hit-button').disabled = true;

        jogador.push(mazo.pop());
        const playerValue = calcularPontuacao(jogador);
        console.log(`Player value: ${playerValue}`); 
        if (playerValue > 21) {
            gameOver = true;
            document.getElementById("message").innerText = "Você estourou! Dealer venceu.";
            console.log("Game over triggered"); 
            atualizarVitorias();
        }

        updateDisplay(); 

    
        setTimeout(() => {
            document.getElementById('hit-button').disabled = false;
            console.log("Hit button reactivated"); 
        }, 400);
    }
}



function updateDisplay() {
    document.getElementById('player-cards').innerHTML = jogador.map(carta => {
    return `<img src="imagens/${carta.valor}${carta.naipe}.png" alt="${carta.valor}${carta.naipe}" class="card">`;
}).join('');
    document.getElementById('player-score').innerText = `Pontuação: ${calcularPontuacao(jogador)}`;
}


function stand() {
    while (calcularPontuacao(dealer) < 17) {
        dealer.push(mazo.pop());
    }

    ajustarPontuacaoDealer();

    const pontuacaoJogador = calcularPontuacao(jogador);
    const pontuacaoDealer = calcularPontuacao(dealer);

    document.getElementById('dealer-cards').innerHTML = dealer.map(carta => {
    return `<img src="imagens/${carta.valor}${carta.naipe}.png" alt="${carta.valor}${carta.naipe}" class="card">`;
}).join('');
    document.getElementById('dealer-score').innerText = `Pontuação: ${pontuacaoDealer}`;

    if (pontuacaoDealer > pontuacaoJogador) {
        document.getElementById('message').innerText = "Dealer venceu!";
        dealerWins++;
    } else if (pontuacaoJogador > pontuacaoDealer) {
        document.getElementById('message').innerText = "Você venceu!";
        playerWins++;
    } else {
        document.getElementById('message').innerText = "Empate!";
    }

    atualizarVitorias();
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

function atualizarVitorias() {
    document.getElementById('player-wins').innerText = `Vitórias do Jogador: ${playerWins}`;
    document.getElementById('dealer-wins').innerText = `Vitórias do Dealer: ${dealerWins}`;
}

function finalizarJogo() {
    document.getElementById('hit-button').disabled = true;
    document.getElementById('stand-button').disabled = true;
}


document.getElementById('start-button').addEventListener('click', iniciarJogo);
document.getElementById('hit-button').addEventListener('click', hit);
document.getElementById('stand-button').addEventListener('click', stand);
