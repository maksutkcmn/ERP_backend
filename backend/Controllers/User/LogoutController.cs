using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ASP_deneme.Controllers;

[ApiController]
[Route("[controller]")]
public class LogoutController : ControllerBase
{
    [HttpPost]
    [Authorize]
    public IActionResult Logout()
    {
        try
        {
            Response.Cookies.Delete("access_token", new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                SameSite = SameSiteMode.Lax,
                Path = "/"
            });

            return Ok(new
            {
                message = "Logged out successfully"
            });
        }
        catch (System.Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Logout failed",
                error = ex.Message
            });
        }
    }
}
