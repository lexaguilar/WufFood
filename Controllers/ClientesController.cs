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
    public class ClienteController : Controller
    {
        dbContext db;
        public ClienteController(dbContext _db)
        {
            db =_db;
        }
        

        [HttpGet("clientes")]
        public IActionResult ObtenerClientes()
        {
            var result = db.Cliente.Select(x => new {
                nombre = x.Nombre,
                id = x.Id
            }).OrderBy(x => x.nombre);               
            
            return Json(result);
        }

        [HttpPost("clientes/insertar")]
        public IActionResult Insertar([FromBody] Cliente cliente)
        {
            if(ModelState.IsValid){
                db.Cliente.Add(cliente);
                db.SaveChanges();
                return Json(cliente);
            }
            
            return BadRequest();
        }

        [HttpPost("clientes/actualizar")]
        
        public IActionResult Actualizar([FromBody] Cliente cliente)
        {

            var oldCliente = db.Cliente.Find(cliente.Id);
            oldCliente.Nombre = cliente.Nombre;
            db.SaveChanges();
            return Json(cliente);
        }

        [HttpPost("clientes/{id}/eliminar")]
        public IActionResult Eliminar(int id)
        {
            var oldCliente = db.Cliente.Find(id);

            if(oldCliente != null){
                db.Cliente.Remove(oldCliente);
                db.SaveChanges();
                return Json(oldCliente);
            }
            
            return BadRequest();
        }

    }
}
