using System.Security.Claims;
using ASP_deneme.Services;
using DB;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Models;

namespace ASP_deneme.Controllers;

[ApiController]
[Route("[controller]")]
public class GetController : ControllerBase
{
    private readonly IRedisCacheService _cacheService;
    private readonly AppDbContext _context;

    public GetController(IRedisCacheService cacheService, AppDbContext context)
    {
        _context = context;
        _cacheService = cacheService;
    }

    [HttpGet("/auth/me")]
    [EnableRateLimiting("fixed")]
    [Authorize]
    public async Task<IActionResult> GetMe()
    {
        try
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
            {
                return Unauthorized(new { message = "Invalid token" });
            }
            var response = await _context.users.FindAsync(userId);

            return Ok(new
            {
                message = "User Found",
                user = new
                {
                    response?.id,
                    response?.name,
                    response?.surname,
                    response?.email,
                }
            });
        }
        catch (System.Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Fail",
                error = ex.Message
            });
        } 
    }


    [HttpGet("employees")]
    [EnableRateLimiting("fixed")]
    [Authorize]
    public async Task<IActionResult> GetEmployee()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int adminId))
            {
                return Unauthorized(new {message = "Invalid Token"});
            }

            string cacheKey = $"employees_v2_{adminId}";

            var employees = await _cacheService.GetAsync<List<EmployeeResponseDto>>(cacheKey);

            if (employees == null)
            {
                var rawEmployees = await _context.employees
                    .Where(e => e.adminId == adminId)
                    .ToListAsync();

                employees = rawEmployees.Select(e => new EmployeeResponseDto
                {
                    Id = e.id,
                    FullName = e.FullName,
                    Department = e.Department,
                    Position = e.Position,
                    Email = e.Email,
                    Phone = e.Phone,
                    Salary = e.Salary,
                }).ToList();

                if (employees.Any())
                {
                    await _cacheService.SetAsync(cacheKey, employees, TimeSpan.FromMinutes(5));
                }
            }

            if (!employees.Any())
            {
                return NotFound(new {message = "No emplooyes found"});
            }
            
            return Ok(new
            {
                message = "Success",
                count = employees.Count,
                employees
            });
            
        }
        catch (System.Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Fail",
                error = ex.Message
            });
        }    
    }

    [HttpGet("employees/by-name/{name}")]
    [EnableRateLimiting("fixed")]
    [Authorize]
    public async Task<IActionResult> GetEmployeeByName(string name)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return BadRequest(new {message = "Name is required"});
            }

            var adminIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrWhiteSpace(adminIdClaim) || !int.TryParse(adminIdClaim, out int adminId))
            {
                return Unauthorized(new {message = "Invalid Token"});
            }

            var emplooye = await _context.employees
                        .FirstOrDefaultAsync(e => e.adminId == adminId && e.FullName == name);
            
            if (emplooye == null)
            {
                return BadRequest(new {message = "Employee not Found"});
            }

            var response = new EmployeeResponseDto
            {
                Id = emplooye.id,
                FullName = emplooye.FullName,
                Department = emplooye.Department,
                Email = emplooye.Email,
                Position = emplooye.Position,
                Phone = emplooye.Phone,
                Salary = emplooye.Salary
            };

            return Ok(response);
        }
        catch (System.Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Fail",
                error = ex.Message
            });
        }
    }

    [HttpGet("employees/search")]
    [Authorize]
    public async Task<IActionResult> GetEmployeeSearch([FromQuery] string name)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return BadRequest(new {message = "Bad Input!"});
            }

            var adminIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrWhiteSpace(adminIdClaim) || !int.TryParse(adminIdClaim, out int adminId))
            {
                return Unauthorized(new {message = "Invalid Token"});
            }

            var employees = await _context.employees
                .Where(e => e.adminId == adminId && e.FullName!.ToLower().Contains(name.ToLower()))
                .Select(e => new EmployeeResponseDto
                {
                    Id = e.id,
                    FullName = e.FullName,
                    Department = e.Department,
                    Position = e.Position,
                    Email = e.Email,
                    Phone = e.Phone,
                    Salary = e.Salary
                }).ToListAsync();

            return Ok(new
            {
                message = employees.Any() ? "Success" : "No employees found",
                count = employees.Count,
                employees
            });
        }
        catch (System.Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Fail",
                error = ex.Message
            });
        }
    }
}