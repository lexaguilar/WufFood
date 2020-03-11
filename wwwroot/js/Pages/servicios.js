var cargarServicios = () =>
{
    $('#titulo').html('Servicios');
    
    $('#root').html('<div id="gridContainer"></div><div id="action-add"></div><div id="action-remove"></div><div id="action-edit"></div>');
    $(".page-wrapper").removeClass("toggled");
    
    var servicios = new DevExpress.data.DataSource({
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
        dataSource: servicios,
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
                width : '80%',
                validationRules: [{ type: "required" }]
            },
            {
                dataField: "costo",
                validationRules: [{ type: "required" }]
            },
        ],       
        onRowInserted: function(e) {
           
            http(urls.servicio.insertar).post({nombre : e.data.nombre, costo:e.data.costo}).then(r =>{
                loadGrid();
            });

        },
        onRowUpdated: function(e) {

            console.log(e.data);

            http(urls.servicio.actualizar).post(e.data).then(r =>{
                loadGrid();
            });

        },
        onRowRemoved: function(e) {
            http(urls.servicio.eliminar(e.data.id)).post().then(r =>{
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

  


    function loadGrid() {

        http(urls.servicio.obtener).get().then(data => { 
            $("#gridContainer").dxDataGrid("instance").option('dataSource', data);
        });

    }

    loadGrid();

}