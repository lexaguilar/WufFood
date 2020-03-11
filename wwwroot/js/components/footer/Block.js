import createNode, { HTMLElements } from "../../utlis/creators.js";
import { icons } from "../icons/svg.js";


const Block = id => (option={
      text:'',
      icon:''
    }) => {
    
    let div = createNode(HTMLElements.div);    
    let block = div(id);

    block.classList.add('footer-block');

    block.innerHTML = icons[option.icon];
    return block;
}

export default Block;