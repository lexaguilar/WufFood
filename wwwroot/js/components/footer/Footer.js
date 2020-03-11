import createNode, { HTMLElements } from "../../utlis/creators.js";
import Block from "./Block.js";
import items from "./items.js";

const Footer = id => (option = {

}) => {

    let div = createNode(HTMLElements.div);
    let footer = div(id);

    footer.classList.add('footer-bar');

    let block = Block()

    footer.appendChild(block(items[0]));

    return footer;
}

export default Footer;