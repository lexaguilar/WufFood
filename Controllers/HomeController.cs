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
    public class HomeController : Controller
    {
        dbContext db;
        public HomeController(dbContext _db)
        {
            db =_db;
        }
        public IActionResult Index()
        {            
            return View();
        }

        [HttpGet("home/pedidos/{showAll}")]
        public IActionResult GetPedidos(bool showAll)
        {
            IQueryable<Pedido> result = db.Pedido
                .Include(x => x.Cliente)
                .Include(x => x.PedidoDetalle);
                
            if(!showAll)
                result = result.Where(x => x.Pagado);
            
            return Json(result);
        }


        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
