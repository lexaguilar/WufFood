import createNode, { HTMLElements } from "../utlis/creators.js";

const Title = id => (option={
        text:''
    }) => {
        
        let elemt = createNode(HTMLElements.title(2));    
        let title = elemt(id);

        title.innerText = option.text;

        title.classList.add('title');
    
        return title;
}

export default Title;