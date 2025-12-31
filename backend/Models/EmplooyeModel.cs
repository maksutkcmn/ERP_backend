using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Models;

public class EmplooyeModel
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int id {get; set;}

    [Column("admin_id")]
    [JsonIgnore]
    public int? adminId {get; set;}

    [Column("full_name")]
    [Required(ErrorMessage = "Name is required")]
    public string? FullName {get; set;}

    [Required(ErrorMessage = "Department is required")]
    public string? Department {get; set;}

    [Required(ErrorMessage = "Position is required")]
    public string? Position {get; set;}

    [Required(ErrorMessage = "Email is required")]
    public string? Email {get; set;}

    [Required(ErrorMessage = "Phone is required")]
    public string? Phone {get; set;}

    [Required(ErrorMessage = "Salary is required")]
    public decimal Salary {get; set;}
}

public class EmployeeResponseDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("fullName")]
    public string? FullName { get; set; }

    [JsonPropertyName("department")]
    public string? Department { get; set; }

    [JsonPropertyName("position")]
    public string? Position { get; set; }

    [JsonPropertyName("email")]
    public string? Email { get; set; }

    [JsonPropertyName("phone")]
    public string? Phone { get; set; }

    [JsonPropertyName("salary")]
    public decimal? Salary { get; set; }
}
