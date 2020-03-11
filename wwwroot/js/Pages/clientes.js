var cargarClientes = () =>
{
    $('#titulo').html('Clientes');
    
    $('#root').html('<div id="gridContainer"></div><div id="action-add"></div><div id="action-remove"></div><div id="action-edit"></div>');
    $(".page-wrapper").removeClass("toggled");
    
    var clientes = new DevExpress.data.DataSource({
        store: {
            type: 'array',
            data: [],
            key: 'id'
        }
    });

    DevExpress.config({
        floatingActionButtonConfig: {
            icon: "rowfield",
            position: {
                of: "#grid",
                my: "right bottom",
                at: "right bottom",
                offset: "-16 -16"
            }
        }
    });

    var deleteSDA = null,
        editSDA = null;

    $("#action-add").dxSpeedDialAction({
        hint: "Add row",
        icon: "add",
        onClick: function() {
            grid.addRow();
        }
    }).dxSpeedDialAction("instance");
    
    var grid = $("#gridContainer").dxDataGrid({
        dataSource: clientes,
        searchPanel: {
            visible: true,
            highlightCaseSensitive: true
        },
        keyExpr: "id",
        showBorders: true,
        paging: {
            enabled: false
        },
        editing: {
            mode: "popup"
        }, 
        columns: [
            {
                dataField : 'id', 
                visible: false,
                allowEditing : false
            },
            {
                dataField: "nombre",
                validationRules: [{ type: "required" }],
                cellTemplate: function (container, options) {
                    $("<div>")
                        .append($(`<div class="item"><span class="icon dx-icon-user text-default"></span> ${options.value}</div>`))
                        .appendTo(container);
                }
            },
        ],
        onEditingStart: function(e) {
            console.log("EditingStart");
        },
        onInitNewRow: function(e) {
            console.log("InitNewRow");
        },
        onRowInserting: function(e) {
            console.log("RowInserting");
        },
        onRowInserted: function(e) {
           
            http(urls.cliente.insertar).post({nombre : e.data.nombre}).then(r =>{
                loadGrid();
            });

        },
        onRowUpdating: function(e) {
            console.log("RowUpdating");
        },
        onRowUpdated: function(e) {

            http(urls.cliente.actualizar).post(e.data).then(r =>{
                loadGrid();
            });

        },
        onRowRemoving: function(e) {
            console.log("RowRemoving");
        },
        onRowRemoved: function(e) {
            http(urls.cliente.eliminar(e.data.id)).post().then(r =>{
                loadGrid();
            });
        },
        selection: {
            mode: "single"
        },
        onSelectionChanged: function(e) {
            var selectedRowIndex = e.component.getRowIndexByKey(e.selectedRowKeys[0]); 

            if(selectedRowIndex === -1) {
                deleteSDA && deleteSDA.dispose();
                deleteSDA = null;
                editSDA && editSDA.dispose();
                editSDA = null;

                return;
            }

            deleteSDA = $("#action-remove").dxSpeedDialAction({
                icon: "trash",
                hint: "Delete row",
                onClick: function() {
                    grid.deleteRow(selectedRowIndex);
                    grid.deselectAll();
                }
            }).dxSpeedDialAction("instance");

            editSDA = $("#action-edit").dxSpeedDialAction({
                hint: "Edit row",
                icon: "edit",
                onClick: function(e) {
                    grid.editRow(selectedRowIndex);
                    grid.deselectAll();
                }
            }).dxSpeedDialAction("instance");

        },
    }).dxDataGrid("instance");

    $("#gridContainer").children().addClass('mybackground')

    function loadGrid() {

        http(urls.cliente.obtener).get().then(data => { 
            $("#gridContainer").dxDataGrid("instance").option('dataSource', data);
        });

    }

    loadGrid();

}
