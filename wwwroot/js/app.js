import Pedidos from "./views/Pedidos.js";
import Title from "./components/Title.js";
import Footer from "./components/footer/Footer.js";

let root = document.querySelector('#root')
let title = Title('head-title');

root.appendChild(title({
    text : 'Pedidos la Prima'
}));

Pedidos();

let footer = Footer('footer-bar');
root.appendChild(footer())
