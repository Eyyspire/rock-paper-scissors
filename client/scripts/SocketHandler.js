import {statusmap, matchmap, scoremap, resultsmap} from './maps.js'

export class SocketHandler{

    constructor(){
        this.socket = io()
        this.results = document.getElementById("game-results")
        this.status = document.getElementById("connexion-status")
        this.played_move = document.getElementById("played-move")
        this.played_opponent_move = document.getElementById("opponent-move")
        this.play_buttons = document.getElementsByClassName("play-button")
        this.adviceDiv = document.getElementById("advice")
        this.currentRound = document.getElementById("current-round")
        this.currentInfo = document.getElementById("current-info")
        this.init();
        this.setupSocket()
    }

    // init game attributes
    init(){
      this.played = false;
      this.your_move = null;
      this.opponent_move = null;
      document.getElementById("connexion-status").style.color = "#555";
    }

    // setup socketlisteners
    setupSocket(){
        this.welcome();
        this.connectedNumber();
        this.results_handler();
        this.finalResults();
        this.left();
    }

    // welcome message : est ce que la connection s'est bien passé
    welcome(){
        this.socket.on('welcome', data => {
            if(data == "ok"){
              console.log("vous êtes bien connectés au jeu");
            }
            if(data == "error"){
              console.log("Une erreur s'est produite");
            }
          })
    }

    // connectedNumber message : nombre de joueurs connectés
    connectedNumber(){
        this.socket.on('connected-number', data => {
            const number = data.number
              if(number == 0){
                this.status.style.color = "red";
                this.status.textContent = statusmap.get(0)
                this.enable_buttons(false);
              }
              if(number == 1){
                this.status.textContent = statusmap.get(1)
                this.enable_buttons(true);
                this.init();
                this.setup_listeners(); 
              }
              if(number == 2){
                this.status.style.color = "red";
                this.status.textContent = statusmap.get(2)
                this.enable_buttons(false);
              }
            } 
        )
    }

    // results message : resultat d'une manche
    results_handler(){
        this.socket.on('results', data => {
            this.display_results(data);
            this.opponent_move = data.move;
            this.played = false;
            this.advice()
        });
    }

    // left message : l'adversaire a quitté la partie
    left(){
      this.socket.on("left", data => {
        this.status.textContent = statusmap.get(3)
        this.status.style.color = "green";
        this.reset()
        this.enable_buttons(false)
        this.currentRound.textContent = 0;
        this.currentInfo.style.display = "unset";
        this.currentInfo.textContent = "Votre adversaire a quitté la partie précédente"
      })
    }

    //finalResults message : resultat d'une partie
    finalResults(){
      this.socket.on("finalResults", data => {
        this.results.textContent = resultsmap.get(data);
        console.log(data)
        if (data != 0){
          this.displayNewGameBtn(true);
          this.enable_buttons(false);
        }
      })
    }

    // se charge des changements d'affichage suite à la réception d'un résultat de manche
    display_results(data){
      const score_boxes = document.querySelectorAll('div[class*="score-box"]')
      const move_scores = document.getElementsByClassName("move-score")
      score_boxes[0].textContent = data.points[0]; // score du joueur
      score_boxes[1].textContent = data.points[1]; // score de l'adversaire
      move_scores[0].textContent = matchmap.get(data.score);
      move_scores[1].textContent = matchmap.get(-data.score);
      this.played_opponent_move.src= `../images/${data.move}.png`
      this.currentRound.textContent = data.round
      this.currentInfo.textContent = ""
      this.currentInfo.style.display = "none";
    }


    // rend disponible ou non selon la valeur de state (booléen) le bouton de nouvelle partie
    displayNewGameBtn(state){
      const newGameBtn = document.getElementById('new-game');
      if (state)
        newGameBtn.style.display = 'block'
      else
        newGameBtn.style.display = 'none'
    }

    // tous les éléments à mettre à jour quand une partie se termine suite à une déconnexion, ou qu'une nouvelle commence
    reset(){
      const move_scores = document.getElementsByClassName("move-score");
      for(let m of move_scores){
        m.textContent = "";
      }
      const score_boxes = document.querySelectorAll('div[class*="score-box"]')
      for(let s of score_boxes){
        s.textContent = 0;
      }
      this.played_move.setAttribute('src', '');
      this.played_opponent_move.setAttribute('src', '');
      this.results.textContent = '';
      this.displayNewGameBtn(false)
      this.adviceDiv.textContent = "";
    }


    // listeners des boutons
    setup_listeners(){
        for (let button of this.play_buttons){
        let handleMove = this.handleMove.bind(this, button);
          button.addEventListener("click", function() {
            handleMove();
            })
        }
        const newGameBtn = document.getElementById("new-game")
        newGameBtn.addEventListener("click", () => {
          this.reset();
          this.socket.emit('new-game', this.socket.id);
          this.currentRound.textContent = 0;
        } 
      )
      }

    // rend disponible selon la valeur de state (booleen) les boutons de coup
    enable_buttons(state){
      const buttons = document.getElementsByClassName("play-button")
      for(let button of buttons){
        button.disabled = !state
      }
    }


    // gère les événements quand un coup est effectué
    handleMove(button){
      if (this.played == false){
        this.socket.emit("play", button.id); 
        this.your_move = button.id
        const hasPlayerAlreadyPlayed = (this.played_opponent_move.src != "") 
        if (hasPlayerAlreadyPlayed)
          this.played_opponent_move.setAttribute('src', '')
        this.played_move.src = `../images/${button.id}.png`
        this.played = true;
      }
    }

    // affiche comment poursuivre la partie
    advice(){
      this.adviceDiv.textContent = "=> Pour passer à la manche suivante, vous pouvez sélectionner un nouveau coup"
    }
}