using System;
using System.Collections.Generic;

namespace WufFood.Models
{
    public partial class Pedido
    {
        public Pedido()
        {
            PedidoDetalle = new HashSet<PedidoDetalle>();
        }

        public int Id { get; set; }
        public int ClienteId { get; set; }
        public bool Pagado { get; set; }
        public DateTime FechaPedido { get; set; }
        public DateTime? FechaPagado { get; set; }
        public string Nota { get; set; }

        public Cliente Cliente { get; set; }
        public ICollection<PedidoDetalle> PedidoDetalle { get; set; }
    }
}
