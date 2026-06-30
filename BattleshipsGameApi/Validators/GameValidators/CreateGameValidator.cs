using FluentValidation;
using ProductCatalogAPI.DTOs.GameDtos;

namespace ProductCatalogAPI.Validators.GameValidators;

public class CreateGameValidator : AbstractValidator<CreateGameDto>
{
    public CreateGameValidator()
    {
        RuleFor(x => x.PlayerName)
            .NotEmpty().WithMessage("Player name is required")
            .MaximumLength(50).WithMessage("Player name cannot exceed 50 characters");

        RuleFor(x => x.BoardSize)
            .InclusiveBetween(8, 16).WithMessage("Board size must be between 8 and 16");
    }
}
