var MostraPedidos = () => {
    $('#loading').show();
    $('#root').html('');
    var now = new Date();
    $('#root').append(
        $('<div id="root-toolbar" />').dxCheckBox({
            value: false, text: 'Mostrar pagados',
            onValueChanged: function (data) {
                $('#loading').show();
                cargarPedidos();
            }
        }),
        $('<div id="root-toolbar-date" />').dxDateBox({
            value: now,
            onValueChanged: function (data) {
                $('#loading').show();
                cargarPedidos();
            }
        }),
        $('<div id="root-main" />')
    )

    cargarPedidos();
}

var cargarPedidos = t => {
    $(".page-wrapper").removeClass("toggled");
    $('#root-main').html('<div id="popup"></div><div id="popup-2"></div>');

    var ul = $('<ul class="demo-list-two mdl-list"></ul>');
    var floatingButton = $(`<a href="#" class="float" onclick="showInfo('0')">
                            <i class="fa fa-plus my-float"></i>
                        </a>`);
    var accountDiv = $('<p id="accountSummary">')

    $('#root-main').append(ul);
    $('#root-main').append(accountDiv);
    $('#root-main').append(floatingButton);
    $('#titulo').html('Pedidos');


    function loadList() {

        var _pagado = $("#root-toolbar").dxCheckBox('instance').option('value');
        var _date = $("#root-toolbar-date").dxDateBox('instance').option('value');

        if (t) {
            d = t;
            var w = $('.btn-search').val().toString().toLowerCase();
            findItems(w);
            //loadData(t);
        } else {

            http(urls.pedido.obtener(_pagado, _date.getFullYear(), _date.getMonth() + 1, _date.getDate())).get().then(data => {
                d = data;
                loadData(data);
            });

        }

    }

    http(urls.cliente.obtener).get().then(
        r => {
            clientes = r;
        }
    )

    http(urls.servicio.obtener).get().then(
        r => {
            servicios = r;
        }
    )

    loadList();



}


var loadData = data => {
    var ul = $('.demo-list-two');
    $('.demo-list-two').html('');

    if (data.length == 0) {
        $(ul).append($('<p class="nodata">No hay datos</p>'));
    }

    var currentDate = '';
    var etiqueta = ''
    var sumamaryGroup = 0;
    var currentSummary = {}
    data.forEach(pedido => {

        if (pedido.fecha != currentDate) {
            etiqueta = pedido.fecha
            currentDate = pedido.fecha;
            currentSummary = getSummary(data.filter(x => x.fecha == currentDate));
            sumamaryGroup = ` - ${data.filter(x => x.fecha == currentDate).length} - ${currentSummary.total} | <span class="text-success">${currentSummary.pagado}</span> | <span class="text-danger">${currentSummary.total - currentSummary.pagado}</span>`
        } else {
            etiqueta = '';
            sumamaryGroup = null;
        }

        var li = $(`<span> ${etiqueta}${sumamaryGroup ? sumamaryGroup : ''}</span><li data-content="${pedido.cliente}" data-account="${pedido.saldo}" class="btn-ripple mdl-list__item mdl-list__item--two-line ${(pedido.pagado ? 'div-pagado' : '')}">
                      <span class="mdl-list__item-primary-content"  onclick="showInfo('${pedido.id}')">
                        <i class="material-icons mdl-list__item-avatar fa fa-user"></i>
                        <span>${pedido.cliente} ${(String(pedido.nota).length > 0 && pedido.nota != null ? '<i class="dx-icon-pin" ></i>' : '')}</span>
                        ${pedido.detalle.map(x => `<span class="mdl-list__item-sub-title">-${x.servicio}</span>`).join('')}
                      </span>
                      <span class="mdl-list__item-secondary-content">
                      <span class="mdl-list__item-sub-title ${(pedido.pagado ? 'pagado' : '')}">${parseFloat(pedido.saldo).toFixed(2)}</span>
                        <div id="checked-${pedido.id}"></div>   
                        <div id="btn-${pedido.id}"></div>                     
                      </span>
                      <p class="date">${pedido.fechaPagado}</p>
                    </li>`);


        $(ul).append(li);

        $(`#checked-${pedido.id}`).dxCheckBox({ value: pedido.pagado });

        $(`#btn-${pedido.id}`).dxButton({
            icon: "close",
            type: 'danger',
            onClick: function () {
                deleteItem(pedido.id);
            }
        });

    });
    $('#loading').fadeOut();
    $('#root-main').fadeIn();
    getTotalAccount(data);
}

var deleteItem = id => {
    if (popup2) {
        $(".popup-2").remove();
    }
    var $popupContainer = $("<div />")
        .addClass("popup-2")
        .appendTo($("#popup-2"));

    pedidoId = id;
    popup2 = $popupContainer.dxPopup(popupOptionsConfirm).dxPopup("instance");
    popup2.show();
}

var fireMsg = control => {
    control.validationRequest.fire()
    return false;
}

var getValue = control => control.option('value');

pedidoId = 0;
var pedidoDetalle = []
var clientes;
var servicios;
var d;
var currentPedido = {},
    popup = null,
    popup2 = null,
    popupOptions = {
        showCloseButton: true,
        closeOnBackButton: false,
        width: 300,
        height: 250,
        contentTemplate: function () {
            var div = $('<div class="form"/>').append(
                $('<div class="dx-fieldset"/>').append(
                    //clientes
                    $('<div class="dx-field"/>').append(
                        $('<div class="dx-field-label">Clientes</div>'),
                        $('<div class="dx-field-value"/>').append(
                            $('<div id="tagClienteId"/>').dxTagBox({
                                dataSource: new DevExpress.data.ArrayStore({
                                    data: clientes,
                                    key: "id"
                                }),
                                searchEnabled: true,
                                displayExpr: "nombre",
                                valueExpr: "id",
                                value: currentPedido.clienteId == null? null : [currentPedido.clienteId]
                            }).dxValidator({
                                validationRules: [{
                                    type: "required",
                                    message: "Agregar clientes"
                                }]
                            })
                        )
                    ),
                    //servicios
                    $('<div class="dx-field"/>').append(
                        $('<div class="dx-field-label">Servicios</div>'),
                        $('<div class="dx-field-value"/>').append(
                            $('<div id="tagPedidos" />').dxTagBox({
                                value: currentPedido.detalle.map(x => x.servicioId),
                                dataSource: makeAsyncDataSource(currentPedido.detalle),
                                valueExpr: "id",
                                searchEnabled: true,
                                displayExpr: "nombre",
                                itemTemplate: function (itemData, itemIndex, element) {

                                    return $("<div />").append(
                                        $("<p />")
                                            .append($("<span />").text(itemData.nombre).addClass("nombre"))
                                            .append($("<span />").text(itemData.costo).addClass("costo badge badge-secondary")),

                                    );

                                }
                            }).dxValidator({
                                validationRules: [{
                                    type: "required",
                                    message: "Agregar pedidos"
                                }]
                            })
                        )
                    ),

                    //Fecha Pedido
                    $('<div class="dx-field"/>').append(
                        $('<div class="dx-field-label">Fecha del pedido</div>'),
                        $('<div class="dx-field-value"/>').append(
                            $('<div id="fechaPedido"/>').dxDateBox({
                                type: "date",
                                value: currentPedido.fechaPedido,
                                displayFormat: "dd/MM/yyyy"
                            }).dxValidator({
                                validationRules: [{
                                    type: "required",
                                    message: "Elija la fecha"
                                }]
                            })
                        )
                    ),

                    //Pagado
                    $('<div class="dx-field"/>').append(
                        $('<div class="dx-field-value"/>').append(
                            $('<div class="dx-field-label">Pagado</div>'),
                            $('<div id="pagado"/>').dxSwitch({
                                value: currentPedido.pagado,
                                switchedOffText: "NO",
                                switchedOnText: "SI",
                            })
                        )
                    ),

                    //nota
                    $('<div class="dx-field"/>').append(
                        $('<div class="dx-field-label">Observacion</div>'),
                        $('<div class="dx-field-value"/>').append(
                            $('<div id="nota"/>').dxTextBox({
                                value: currentPedido.nota,
                            })
                        )
                    ),

                    //nota
                    $('<div class="dx-field"/>').append(
                        $('<div class="dx-field-value"/>').append(
                            $('<div id="nota"/>').dxButton({
                                stylingMode: 'contained',
                                text: 'Guardar',
                                type: 'success',
                                icon: "check",
                                width: '100%',
                                template: function(data, container) {

                                    $("<div class='button-indicator'></div><span class='dx-button-text'>" + data.text + "</span>").appendTo(container);
                                    buttonIndicator = container.find(".button-indicator").dxLoadIndicator({
                                        visible: false
                                    }).dxLoadIndicator("instance");

                                },
                                onClick: function (obj) {
                                    var isOk = true;

                                    var clienteIdsResult = $("#tagClienteId").dxTagBox('instance')
                                    if(clienteIdsResult.option('value').length == 0)
                                        isOk = fireMsg(clienteIdsResult);                               
                                    

                                    var pedidosResult = $("#tagPedidos").dxTagBox('instance');
                                    if(pedidosResult.option('value').length == 0)
                                        isOk = fireMsg(pedidosResult); 

                                    var fechaPedidoResult = $("#fechaPedido").dxDateBox('instance');
                                    if(fechaPedidoResult.option('value') == null)
                                        isOk = fireMsg(fechaPedidoResult); 

                                    if(isOk){
                                        var fechaPedido = getValue(fechaPedidoResult);
                                        var clienteIds = getValue(clienteIdsResult);
                                        var pedidos = getValue(pedidosResult);


                                        pedidoDetalle = servicios.filter(x => pedidos.includes(x.id)).map(x => {
                                            return {
                                                servicioId: x.id,
                                                pedidoId: currentPedido.id,
                                                costo: x.costo
                                            }
                                        });
                                        
                                        obj.component.option("text", "guardando...");
                                        buttonIndicator.option("visible", true);
                                        
                                        var msgResult = ''
                                        var url;
                                        if (currentPedido.id > 0) {
                                            
                                            url = urls.pedido.actualizar;
                                            msgResult = 'La orden fue actualizada'
                                            
                                        }
                                        else {
                                            
                                            url = urls.pedido.insertar;
                                            msgResult = 'La orden fue guardada'
                                            
                                        }                                    
                                        
                                        var nota = $("#nota").dxTextBox('instance').option('value');
                                        var pagado = $("#pagado").dxSwitch('instance').option('value');

                                        var data = {} // currentPedido;
                                        data.id = currentPedido.id;
                                        data.pedidoDetalle = pedidoDetalle;
                                        data.pagado = pagado;
                                        data.nota = nota;
                                        data.FechaPedido = fechaPedido;                          
                                        data.fechaPagado = new Date();

                                        var solicitudes = [];

                                        clienteIds.filter(clienteId => clienteId!=null).forEach(clienteId =>{
                                            data.clienteId = clienteId;

                                            solicitudes.push(new Promise(resolve =>{
                                                http(url).post(data).then(r => {                                    
                                                    resolve(r);
                                                })
                                            }));

                                        });

                                        Promise.all(solicitudes).then(r=>{
                                            buttonIndicator.option("visible", false);
                                            obj.component.option("text", "Send");
                                            DevExpress.ui.notify(msgResult);
                                            $('#loading').fadeIn();
                                            $('#root-main').fadeOut();
                                            if(currentPedido.id > 0){

                                                cargarPedidos(d.map(x => {

                                                    if(x.id == currentPedido.id){

                                                        x.clienteId = r[0].clienteId;   
                                                        x.cliente = r[0].cliente;   
                                                        x.detalle = r[0].detalle;
                                                        x.fecha = r[0].fecha;
                                                        x.pagado = r[0].pagado;
                                                        x.nota = r[0].nota;
                                                        x.fechaPagado = r[0].fechaPagado
                                                        x.FechaPedido = r[0].fechaPedido;                          
                                                        x.saldo = r[0].saldo;     

                                                    }

                                                    return x;
                                                }));
                                            }
                                            else
                                                cargarPedidos();

                                            $(".popup").remove();

                                        })
                                    }
                                }
                            })
                        )
                    ),
                )
            )

            return div;
        },
        showTitle: true,
        title: "Pedido",
        visible: false,
        dragEnabled: true,
        fullScreen: true,
    }

var buttonIndicator;

popupOptionsConfirm = {
    showCloseButton: true,
    showTitle: true,
    title: "Information",
    visible: false,
    height: 200,
    dragEnabled: true,
    contentTemplate: function () {
        return $("<div />").append(
            $("<p>Seguro de eliminar</p>"),
            $('<div style="margin-top: 10px;" />').dxButton({
                stylingMode: 'contained',
                text: 'Aceptar',
                icon: "check",
                width: '100%',
                onClick: function (e) {
                    http(urls.pedido.eliminar(pedidoId)).post().then(r => {
                        DevExpress.ui.notify('Registro eliminado', "error");
                        cargarPedidos();
                        $(".popup-2").remove();
                    });
                }
            })
        );
    },
}


var showInfo = function (id) {

    var data = d.find(x => x.id == id);
    currentPedido = data || {
        id: 0,
        clienteId: null,
        pagado: false,
        nota: '',
        detalle: [],
        fechaPedido: new Date()
    };
    if (popup) {
        $(".popup").remove();
    }
    var $popupContainer = $("<div />")
        .addClass("popup")
        .appendTo($("#popup"));
    popup = $popupContainer.dxPopup(popupOptions).dxPopup("instance");
    pedidoDetalle = currentPedido.detalle.map(x => {
        return {
            servicioId: x.servicioId,
            pedidoId: id,
            costo: x.costo
        }
    });
    popup.show();


};

var makeAsyncDataSource = function (detalle) {
    return new DevExpress.data.CustomStore({
        loadMode: "raw",
        key: "id",
        load: function () {

            return servicios.map(x => {
                var data = detalle.find(d => d.servicioId == x.id);
                if (data) {
                    x.costo = data.costo;
                }

                return x;
            })
        }
    });
};