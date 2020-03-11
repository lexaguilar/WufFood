using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace WufFood.Controllers
{
    public class AccountController : Controller
    {
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> Login(string returnUrl = null)
        {
            // Clear the existing external cookie to ensure a clean login process
            //await HttpContext.SignOutAsync();
            ViewData["ReturnUrl"] = returnUrl;
            return View("Login");
        }


        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginViewModel model)
        {

            if (model.Password != "leo0010019" && model.Password != "erica2019")
            {
                ModelState.AddModelError(string.Empty, "El usuario y/o la contraseña es incorrecto.");
                return View("Login", model);
            }

            var claims = new List<Claim>
                {
                new Claim(ClaimTypes.Name, model.Username)
                };

            var userIdentity = new ClaimsIdentity(claims, "login");



            ClaimsPrincipal principal = new ClaimsPrincipal(userIdentity);

            await HttpContext.SignInAsync(principal);           

            return RedirectToAction("index","home");

        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> Lockout()
        {
            await HttpContext.SignOutAsync();
            return RedirectToAction(nameof(AccountController.Login));
        }

    }

    public class LoginViewModel
    {
        public string Username { get; set; }        
        public string Password { get; set; }

    }
}