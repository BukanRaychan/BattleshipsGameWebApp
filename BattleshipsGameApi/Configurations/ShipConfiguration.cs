using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ProductCatalogAPI.Models;

namespace ProductCatalogAPI.Configurations;

public class GameShipConfiguration : IEntityTypeConfiguration<Ship>
{
    public void Configure(EntityTypeBuilder<Ship> builder)
    {
        builder.HasKey(s => s.Id);

        builder.Property(s => s.ShipType)
            .IsRequired()
            .HasConversion<string>();

        builder.Property(s => s.Orientation)
            .IsRequired()
            .HasConversion<string>();

        builder.HasMany(s => s.Cells)
            .WithOne(c => c.Ship)
            .HasForeignKey(c => c.ShipId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
