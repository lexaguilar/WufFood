using System;
using System.Collections.Generic;

namespace WufFood.Models
{
    public partial class PedidoDetalle
    {
        public int Id { get; set; }
        public int PedidoId { get; set; }
        public int ServicioId { get; set; }
        public decimal Costo { get; set; }

        public Pedido Pedido { get; set; }
        public Servicio Servicio { get; set; }
    }
}
