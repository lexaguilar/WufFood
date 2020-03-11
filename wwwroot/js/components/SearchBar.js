import createNode, { HTMLElements } from "../utlis/creators.js";

const SearchBar = id => (option={
        placeholder:'Buscar...'
    }) => {
    
    let input = createNode(HTMLElements.input);    
    let searchBar = input(id);

    searchBar.classList.add('search-bar'); 
    searchBar.setAttribute('placeholder', option.placeholder);

    return searchBar;
}

export default SearchBar;