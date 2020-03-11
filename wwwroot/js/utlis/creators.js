const HTMLElements = {
    input:'input',
    title: level => `h${level}`,
    div:'div' ,
    span:'span' ,
    ul:'ul' ,
    li:'li' ,
}


/**
 * 
 * @param {String} type Type of element
 */
const createNode = type => id => {
    let element = document.createElement(type);

    if(id)
     element.id = id;

    return element
}

export default createNode;
export { HTMLElements }