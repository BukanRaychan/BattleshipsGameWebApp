using FluentValidation;
using ProductCatalogAPI.DTOs.GameDtos;

namespace ProductCatalogAPI.Validators.GameValidators;

public class JoinGameValidator : AbstractValidator<JoinGameDto>
{
    public JoinGameValidator()
    {
        RuleFor(x => x.PlayerName)
            .NotEmpty().WithMessage("Player name is required")
            .MaximumLength(50).WithMessage("Player name cannot exceed 50 characters");
    }
}
