using System;
using System.Collections.Generic;

namespace WufFood.Models
{
    public partial class Cliente
    {
        public Cliente()
        {
            Pedido = new HashSet<Pedido>();
        }

        public int Id { get; set; }
        public string Nombre { get; set; }

        public ICollection<Pedido> Pedido { get; set; }
    }
}
