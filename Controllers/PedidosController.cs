using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WufFood.Models;

namespace WufFood.Controllers
{
    [Authorize]
    public class PedidosController : Controller
    {
        dbContext db;
        public PedidosController(dbContext _db)
        {
            db =_db;
        }
        

        [HttpGet("pedidos/{pagado}/year/{yyyy}/month/{mm}/day/{dd}")]
        public IActionResult ObtenerPedidos(bool pagado, int yyyy, int mm, int dd)
        {            

            IQueryable<Pedido> result = db.Pedido
            .Include(x => x.Cliente)
            .Include(x => x.PedidoDetalle)
            .ThenInclude(x => x.Servicio)
            .OrderBy(x => x.FechaPedido);
            

            if(!pagado)
                result = result.Where(x => !x.Pagado);
            else{
                var myDate = new DateTime(yyyy,mm,dd,0,0,0);
                result = result.Where(x => x.FechaPedido >= myDate);
            }
              
            
            return Json(result.Select(x => new {
                id = x.Id,
                cliente = x.Cliente.Nombre,
                clienteId = x.ClienteId,
                pagado = x.Pagado,
                nota = x.Nota,
                fecha = x.FechaPedido.ToShortDateString(),
                fechaPedido = x.FechaPedido,
                saldo = x.PedidoDetalle.Sum(p => p.Costo),
                fechaPagado = x.FechaPagado==null?"":x.FechaPagado.Value.ToShortDateString(),
                detalle = x.PedidoDetalle.Select(s => new {
                    servicio = s.Servicio.Nombre,
                    servicioId = s.Servicio.Id,
                    costo = s.Costo
                })
            }));
        }

        [HttpPost("pedidos/insertar")]
        public IActionResult Insertar([FromBody] Pedido pedido)
        {
            if(ModelState.IsValid){
                
                if(!pedido.Pagado)                    
                    pedido.FechaPagado = null;

                db.Pedido.Add(pedido);

                 if(!pedido.Pagado)                    
                    pedido.FechaPagado = null;
                    
                db.SaveChanges();
                return Json(new{});
            }
            
            return BadRequest();
        }

        [HttpPost("pedidos/actualizar")]
        
        public IActionResult Actualizar([FromBody] Pedido pedido)
        {

            var oldPedido = db.Pedido.Find(pedido.Id);
            oldPedido.ClienteId = pedido.ClienteId;
            oldPedido.FechaPedido = pedido.FechaPedido;
            oldPedido.Pagado = pedido.Pagado; 
            oldPedido.Nota = pedido.Nota; 

            if(pedido.Pagado)
                oldPedido.FechaPagado = pedido.FechaPagado;
            else
                oldPedido.FechaPagado = null;

            var oldPedidoDetalle = db.PedidoDetalle.Where(x => x.PedidoId == pedido.Id);

            if(pedido.PedidoDetalle.Count > 0){
                db.PedidoDetalle.RemoveRange(oldPedidoDetalle);
                foreach (var detalle in pedido.PedidoDetalle)
                {
                    detalle.PedidoId = pedido.Id;
                    db.PedidoDetalle.Add(detalle);
                    
                } 
            }            
            
            db.SaveChanges();


            var result = db.Pedido
            .Include(x => x.Cliente)
            .Include(x => x.PedidoDetalle)
            .ThenInclude(x => x.Servicio)
            .FirstOrDefault(x => x.Id == pedido.Id);    
              
            
            return Json( new {
                id = result.Id,
                cliente = result.Cliente.Nombre,
                clienteId = result.ClienteId,
                pagado = result.Pagado,
                fecha = result.FechaPedido.ToShortDateString(),
                fechaPedido = result.FechaPedido,
                saldo = result.PedidoDetalle.Sum(p => p.Costo),
                fechaPagado = result.FechaPagado==null?"":result.FechaPagado.Value.ToShortDateString(),
                detalle = result.PedidoDetalle.Select(s => new {
                    servicio = s.Servicio.Nombre,
                    servicioId = s.Servicio.Id,
                    costo = s.Costo
                })
            });

            //return Json(new{});
        }

        [HttpPost("pedidos/{id}/eliminar")]
        public IActionResult Eliminar(int id)
        {

            var oldPedido = db.Pedido.Find(id);

            if(oldPedido != null){
                db.Pedido.Remove(oldPedido);
                db.SaveChanges();
                 return Json(new{});
            }
            
            return BadRequest();
        }

    }

}
