let deck;
let playerHand;
let dealerHand;
let gameOver = false;

// Função para criar o deck de cartas
function createDeck() {
    const suits = ['♥', '♦', '♣', '♠'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const deck = [];
    for (const suit of suits) {
        for (const value of values) {
            deck.push({ value, suit });
        }
    }
    return deck.sort(() => Math.random() - 0.5);
}

// Função para calcular o valor da mão
function calculateHandValue(hand) {
    let value = 0;
    let aces = 0;
    for (const card of hand) {
        if (card.value === 'A') {
            value += 11;
            aces += 1;
        } else if (['K', 'Q', 'J'].includes(card.value)) {
            value += 10;
        } else {
            value += parseInt(card.value);
        }
    }
    while (value > 21 && aces) {
        value -= 10;
        aces -= 1;
    }
    return value;
}

// Função para iniciar o jogo
function startGame() {
    deck = createDeck();
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    gameOver = false;

    updateDisplay();
    document.getElementById("hit-button").disabled = false;
    document.getElementById("stand-button").disabled = false;
}

// Função para adicionar uma carta ao jogador quando ele clica em "HIT"
function hit() {
    if (!gameOver) {
        playerHand.push(deck.pop());
        const playerValue = calculateHandValue(playerHand);
        if (playerValue > 21) {
            gameOver = true;
            document.getElementById("message").innerText = "Você estourou! Dealer venceu.";
        }
        updateDisplay();
    }
}

// Função para o dealer jogar após o jogador clicar em "STAND"
function stand() {
    if (!gameOver) {
        let dealerValue = calculateHandValue(dealerHand);
        while (dealerValue < 19) {
            dealerHand.push(deck.pop());
            dealerValue = calculateHandValue(dealerHand);
        }
        
        const playerValue = calculateHandValue(playerHand);
        gameOver = true;

        if (dealerValue > 21 || playerValue > dealerValue) {
            document.getElementById("message").innerText = "Você venceu!";
        } else if (dealerValue >= playerValue) {
            document.getElementById("message").innerText = "Dealer venceu!";
        }

        updateDisplay(true);
    }
}

// Função para atualizar a exibição do jogo
function updateDisplay(revealDealer = false) {
    // Atualiza cartas e pontuação do jogador
    document.getElementById("player-cards").innerText = playerHand.map(card => `${card.value}${card.suit}`).join(" ");
    document.getElementById("player-score").innerText = `Pontuação: ${calculateHandValue(playerHand)}`;

    // Atualiza cartas do dealer (oculta uma carta se revealDealer for falso)
    if (revealDealer) {
        document.getElementById("dealer-cards").innerText = dealerHand.map(card => `${card.value}${card.suit}`).join(" ");
        document.getElementById("dealer-score").innerText = `Pontuação: ${calculateHandValue(dealerHand)}`;
    } else {
        document.getElementById("dealer-cards").innerText = `${dealerHand[0].value}${dealerHand[0].suit} ?`;
        document.getElementById("dealer-score").innerText = "Pontuação: ?";
    }

    // Desativa botões se o jogo acabou
    if (gameOver) {
        document.getElementById("hit-button").disabled = true;
        document.getElementById("stand-button").disabled = true;
    }
}

document.getElementById("start-button").onclick = startGame;
document.getElementById("hit-button").onclick = hit;
document.getElementById("stand-button").onclick = stand;
