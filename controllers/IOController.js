import {ROCK, PAPER, SCISSORS, ROUNDS, PLAYER_NB} from './Constants.js'
import Player from './Player.js'

export default class IOController {
    #io;
    #clients;
    #moves;
    #points;
    #players
  
    constructor(io) {
      this.#io = io;
      this.#clients = []; //liste des sockets connectées
      this.#players = []; 
      this.scoremap = new Map()
        .set(1, 1)
        .set(0, 0)
        .set(-1, 0)
     this.rounds = ROUNDS;
     this.player_number = PLAYER_NB;
     this.moveNumbers = 0;
    }
  
    /* enregistre un nouveau  (gère la map et la liste des clients)
     envoie un message de bienvenue au socket s'il y a assez de places avec son numéro, sinon lui informe qu'il faut attendre
     */
    registerSocket(socket) {
        if (this.#clients.length >= this.player_number){
            socket.emit("welcome", "error");
            socket.emit("connected-number", {number : this.#clients.length});
        }
        else{
            this.setupListeners(socket);
            this.#clients.push(socket);
            this.#players.push(new Player());
            this.initGameAttributes()
            socket.emit("welcome", "ok");
            socket.emit("connected-number", {number : this.#clients.length-1});
            this.#clients[0].emit("connected-number", {number : this.#clients.length-1});
        }
    }

    initGameAttributes(){
        this.moveNumbers = 0;
        this.#players.forEach(p => p.reset())
    }
  
    // initie les listeners : disconnect et play
    setupListeners(socket) {
        socket.on('disconnect', () => this.leave(socket, true));
        socket.on('play', (data) => {
            this.handleMove(socket, data);
        });
        socket.on('new-game', data => {
            const current_socket = this.#clients.find(s => s.id = data)
            this.leave(current_socket, false);
            this.registerSocket(current_socket);
        })
    }

    /* gère un nouveau coup : l'ajoute à la map, et vérifie si tous les coups ont été joués, le cas échéant la méthode qui gère
    les résultats est appelée
    */ 
    handleMove(socket, data){
        this.#players[this.#clients.indexOf(socket)].move = data;
        if (this.#clients.length == this.player_number && this.#players.every((p) => p.move !== false)){
            this.handleResult();
        }
    }

    /* gère les résultats :
    calcule le résultat, appelle la fonction qui envoie, et celle qui réinitialise les coups des joueurs
    */
    handleResult(){
        this.moveNumbers ++;
        const move0 = this.#players[0].move
        const move1 = this.#players[1].move

        const res = this.computeResult(move0, move1);

        this.addResults(res);
        this.sendResults(res);
        this.checkFinalResults(res);
        this.initMoves();
    }

    computeResult(move0, move1){

        let res = 0; // draw by default
        // 1 : joueur 0 a gagné
        // -1 : joueur 1 a gagné
        
        switch(move0){
            case ROCK : 
                switch (move1){
                    case SCISSORS : res = 1;
                    break;
                    case PAPER : res = -1;
                    break;
                }
                break;
            case PAPER : 
                switch (move1) {
                    case ROCK : res = 1;
                    break;
                    case SCISSORS : res = -1;
                    break;
                }
                break;
            case SCISSORS : 
                switch (move1) { 
                    case PAPER : res = 1;
                    break;
                    case ROCK : res = -1;
                    break;
                }
                break;
        }

        return res;
    }

    addResults(res){
        // ajoute les points dans la map
        this.#players[0].points += this.scoremap.get(res)
        this.#players[1].points += this.scoremap.get(-res)
    }

    initMoves(){
        this.#players.forEach(player => player.move = false)
    }

    // envoie les resultats aux sockets, avec les datas corespondants (résultat, et coup joué par l'adversaire)
    sendResults(result){ 
        const p0 = this.#players[0];
        const p1 = this.#players[1];
        this.#clients[0].emit("results",{
            score : result,
            move : p1.move,
            points : [p0.points, p1.points],
            round : this.moveNumbers
        });
        this.#clients[1].emit("results", {
            score : -result,
            move : p0.move,
            points : [p1.points, p0.points],
            round : this.moveNumbers
        });
    }

    checkFinalResults(){
        if (this.moveNumbers >= this.rounds){
            const point0 = this.#players[0].points;
            const point1 = this.#players[1].points;
            const res = point0 > point1 ? 1 : point1 > point0 ? -1 : 0
            this.#clients[0].emit("finalResults", res)
            this.#clients[1].emit("finalResults", -res)
        }
    }

    // gère le retrait d'un socket
    leave(socket, disconnection){
        const index = this.#clients.indexOf(socket);
        const p = this.#players[index]
        this.#clients = this.#clients.filter(e => e!=socket);
        this.#players = this.#players.filter(e => e!=p);

        this.resetAttributes()

        if (disconnection) this.#clients.forEach(c => c.emit("left"));
    }

    resetAttributes(){
        this.#players.forEach(p => p.reset())
    }
}