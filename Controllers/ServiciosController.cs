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
    public class ServiciosController : Controller
    {
        dbContext db;
        public ServiciosController(dbContext _db)
        {
            db =_db;
        }
        

        [HttpGet("servicios")]
        public IActionResult ObtenerServicios()
        {
            var result = db.Servicio.Select(x => new {
                nombre = x.Nombre,
                id = x.Id,
                costo = x.Costo
            }).OrderBy(x => x.nombre);               
            
            return Json(result);
        }

        [HttpPost("servicios/insertar")]
        public IActionResult Insertar([FromBody] Servicio servicio)
        {
            if(ModelState.IsValid){
                db.Servicio.Add(servicio);
                db.SaveChanges();
                return Json(servicio);
            }
            
            return BadRequest();
        }

        [HttpPost("servicios/actualizar")]
        
        public IActionResult Actualizar([FromBody] Servicio servicio)
        {

            var oldServicio = db.Servicio.Find(servicio.Id);
            oldServicio.Nombre = servicio.Nombre;
            oldServicio.Costo = servicio.Costo;
            db.SaveChanges();
            return Json(servicio);
        }

        [HttpPost("servicios/{id}/eliminar")]
        public IActionResult Eliminar(int id)
        {
            var oldServicio = db.Servicio.Find(id);

            if(oldServicio != null){
                db.Servicio.Remove(oldServicio);
                db.SaveChanges();
                return Json(oldServicio);
            }
            
            return BadRequest();
        }

    }
}
