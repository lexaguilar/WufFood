if (!Array.prototype.sum) {
    Array.prototype.sum = function (elemt) {
        if (elemt)
            return this.reduce((a, b) => (+a) + (+b[elemt]), 0);
        else
            return this.reduce((a, b) => (+a) + (+b), 0);
    };
}

var http = url => 
{
    var _url = `${path}${url}`;
    return{
        get : () => {
            return new Promise(resolve =>{
                fetch(_url)
                .then(response => response.json())
                .then(response => resolve(response))
                .catch(error => console.error('Error:', error));
            })
        },
        post : data => {
            return new Promise(resolve =>{
                fetch(_url,{
                        method: 'POST',
                        body: data?JSON.stringify(data):null,
                        headers:{
                            "Content-Type": "application/json;charset=UTF-8"
                          }
                    })
                    .then(response => response.json())
                    .then(response => resolve(response))
                    .catch(error => console.error('Error:', error));
            })
        },
    }
    
}

var urls = {
    cliente :{
        obtener : 'clientes',
        insertar : 'clientes/insertar',
        actualizar : 'clientes/actualizar',
        eliminar : id => `clientes/${id}/eliminar`
    },
    servicio :{
        obtener : 'servicios',
        insertar : 'servicios/insertar',
        actualizar : 'servicios/actualizar',
        eliminar : id => `servicios/${id}/eliminar`
    },
    pedido :{
        obtener : (pagado,yyyy,mm,dd) => `pedidos/${pagado}/year/${yyyy}/month/${mm}/day/${dd}`,
        insertar : 'pedidos/insertar',
        actualizar : 'pedidos/actualizar',
        eliminar : id => `pedidos/${id}/eliminar`
    },
}



var findItems = word =>{
    var t = $('#titulo').html();
    //var value=0;
    //var valuePagado=0;
    if(t == 'Pedidos'){
        if(String(word).length>0)
            loadData(d.filter(x => x.cliente.toString().toLowerCase().includes(word)));
        else
            loadData(d);       
    }    

}


$('.btn-search').keyup(function (e) {    
   
    findItems(e.target.value.toString().toLowerCase());

});


var getTotalAccount = data => {   

    var result = getSummary(data);

    $('#accountSummary').html('C$ ' + parseFloat(result.total).toFixed(2) +' | <span class="text-success">' + parseFloat(result.pagado).toFixed(2)+'</span> | <span class="text-danger">' + parseFloat(result.total-result.pagado).toFixed(2)+'</span> | Total: ' + data.length);

}

var getSummary = data => {
    var pagado = data.filter(x => x.pagado).sum('saldo');
    var total = data.sum('saldo');
    

    return{
        pagado,
        total
    }

}