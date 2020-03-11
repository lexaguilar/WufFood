using System;
using System.Collections.Generic;

namespace WufFood.Models
{
    public partial class Servicio
    {
        public Servicio()
        {
            PedidoDetalle = new HashSet<PedidoDetalle>();
        }

        public int Id { get; set; }
        public string Nombre { get; set; }
        public double Costo { get; set; }

        public ICollection<PedidoDetalle> PedidoDetalle { get; set; }
    }
}
