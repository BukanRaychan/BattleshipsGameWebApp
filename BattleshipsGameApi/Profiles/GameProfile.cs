using AutoMapper;
using ProductCatalogAPI.DTOs.GameDtos;
using ProductCatalogAPI.Models;

namespace ProductCatalogAPI.Profiles;

public class GameProfile : Profile
{
    public GameProfile()
    {
        CreateMap<Cell, CoordinateDto>();

        CreateMap<Ship, ShipViewDto>()
            .ForMember(d => d.IsSunk, o => o.MapFrom(s => s.Cells.All(c => c.IsHit)));

        CreateMap<Attack, ShotDto>();
    }
}
