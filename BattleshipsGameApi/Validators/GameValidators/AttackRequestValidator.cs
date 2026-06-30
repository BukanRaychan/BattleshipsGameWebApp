using FluentValidation;
using ProductCatalogAPI.DTOs.GameDtos;

namespace ProductCatalogAPI.Validators.GameValidators;

public class AttackRequestValidator : AbstractValidator<AttackRequestDto>
{
    public AttackRequestValidator()
    {
        RuleFor(x => x.X)
            .GreaterThanOrEqualTo(0).WithMessage("X must be zero or greater");

        RuleFor(x => x.Y)
            .GreaterThanOrEqualTo(0).WithMessage("Y must be zero or greater");
    }
}
