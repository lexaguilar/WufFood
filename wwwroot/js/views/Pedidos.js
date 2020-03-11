import SearchBar from "../components/SearchBar.js";
import pedidos from "../services/pedidos.svc.js";
import createNode, { HTMLElements } from "../utlis/creators.js";

const Pedidos = () =>{

    let root = document.querySelector('#root')
    let searchBar = SearchBar('search');
    root.appendChild(searchBar());

    let ul = createNode(HTMLElements.ul);
    let lista = ul('pedidos');

    pedidos.map((p,key) =>{

        let li = createNode(HTMLElements.li);
        let item = li(key);

        item.innerHTML = p.nombre;

        return item;

    }).forEach(p =>{
        lista.appendChild(p);
    })

    root.appendChild(lista);

    

}

export default Pedidos;