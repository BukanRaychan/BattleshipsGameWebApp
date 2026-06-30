using FluentValidation;
using ProductCatalogAPI.DTOs.GameDtos;
using ProductCatalogAPI.Services.Game;

namespace ProductCatalogAPI.Validators.GameValidators;

public class PlaceFleetValidator : AbstractValidator<PlaceFleetDto>
{
    public PlaceFleetValidator()
    {
        RuleFor(x => x.Ships)
            .NotEmpty().WithMessage("A fleet must be submitted")
            .Must(ships => ships.Count == BattleshipRules.RequiredShipLengths.Length)
                .WithMessage($"A fleet must contain exactly {BattleshipRules.RequiredShipLengths.Length} ships");

        RuleForEach(x => x.Ships).ChildRules(ship =>
        {
            ship.RuleFor(s => s.Cells)
                .NotEmpty().WithMessage("Each ship must have cells")
                .Must(cells => cells.Count >= 2).WithMessage("Each ship must occupy at least 2 cells");
        });
    }
}
