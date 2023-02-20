import {SocketHandler} from './SocketHandler.js'
import {ROCK, PAPER, SCISSORS} from './Constants.js'
import '../style/style.css'

const socketHandler = new SocketHandler()

const labels = [ROCK, PAPER, SCISSORS];
const play_buttons = document.getElementsByClassName("play-button")
const images = document.querySelectorAll("img.move")

let i = 0;
for(i; i<3; i++){
  const button = play_buttons[i];
  const image = images[i];
  const label = labels[i];
  button.textContent = label.charAt(0).toUpperCase() + label.slice(1);
  button.id = label;
  image.id = label;
}

 



