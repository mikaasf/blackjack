// pcm 20172018a Blackjack object

//constante com o número máximo de pontos para blackJack
const MAX_POINTS = 21;


// Classe BlackJack - construtor
class BlackJack {
    constructor() {
        // array com as cartas do dealer
        this.dealer_cards = [];
        // array com as cartas do player
        this.player_cards = [];
        // variável booleana que indica a vez do dealer jogar até ao fim
        this.dealerTurn = false;

        // objeto na forma literal com o estado do jogo
        this.state = {
            'gameEnded': false,
            'dealerWon': false,
            'playerBusted': false
        };

        //métodos utilizados no construtor (DEVEM SER IMPLEMENTADOS PELOS ALUNOS)
        this.new_deck = function () {
            let s = ["&hearts;", "&spades;", "&diams;", "&clubs;"];
            const SUITS = 4;
            const CARDS_PER_SUIT = 13;
            let deck = [];
            for (let j = 0; j < SUITS; j++) {
                for (let i = 1; i <= CARDS_PER_SUIT; i++) {
                  deck.push([i, s[j]]);
                }
              }
            return deck;
        };

        this.shuffle = function (deck) {
            let indexes = [];
            let shuffled = [];
            let index = null;
            for(let n = 0; n<deck.length; n++){
                indexes.push(n);
            }
            for(let n=0; n<deck.length; n++){
                index = Math.floor(Math.random()*indexes.length); //para arredondar ao inteiro abaixo
                shuffled.push(deck[indexes[index]]);
                indexes.splice(index,1); //para não sortear novamente a mesma carta
            }
            return shuffled;
        };

        // baralho de cartas baralhado
        this.deck = this.shuffle(this.new_deck());
        //this.deck = this.new_deck();
    }
    // Fim do construtor

    // métodos
    // devolve as cartas do dealer num novo array (splice)
    get_dealer_cards() {
        return this.dealer_cards.slice();
    }

    // devolve as cartas do player num novo array (splice)
    get_player_cards() {
        return this.player_cards.slice();
    }

    // Ativa a variável booleana "dealerTurn"
    setDealerTurn (val) {
        this.dealerTurn = val;
    }

    //MÉTODOS QUE DEVEM SER IMPLEMENTADOS PELOS ALUNOS
    get_cards_value(cards) {
        let cards_val = []
        cards.forEach(function(card) { cards_val.push(card[0]) })
        let noAces = cards_val.filter(function(card) {return card != 1;}); //função anónima que também podia ser com função arrow
        let figTransform = noAces.map(function(c) {return c > 10 ? 10 : c;}); //mapeia o array
        let sum = figTransform.reduce(function(sum, value) { return sum += value; }, 0); //reduz um array a 1 número
        let numAces = cards_val.length - noAces.length;
        while (numAces > 0) {
            if (sum + 11 > MAX_POINTS)
                return sum + numAces;
            sum += 11;
            numAces -= 1;
        }
        return sum + numAces;
    }

    dealer_move() {
        let card = this.deck[0];
        this.deck.splice(0,1);
        this.dealer_cards.push(card);
        return this.get_game_state();
    }

    player_move() {
        let card = this.deck[0];
        this.deck.splice(0,1);
        this.player_cards.push(card);
        return this.get_game_state();
    }

    get_game_state() {
        let playerPoints = this.get_cards_value(this.player_cards);
        let dealerPoints = this.get_cards_value(this.dealer_cards);
        let playerBusted = playerPoints > MAX_POINTS;
        let playerWon = playerPoints === MAX_POINTS;

        let dealerBusted = this.dealerTurn && (dealerPoints > MAX_POINTS);
        let dealerWon = this.dealerTurn && (dealerPoints <= MAX_POINTS) && (dealerPoints > playerPoints);
        this.state.gameEnded = playerBusted || playerWon || dealerBusted || dealerWon;
        this.state.dealerWon = dealerWon;
        this.state.playerBusted = playerBusted;

        return this.state;
    }
}