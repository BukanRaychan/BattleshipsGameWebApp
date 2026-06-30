using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ProductCatalogAPI.Models;

namespace ProductCatalogAPI.Configurations;

public class CellConfiguration : IEntityTypeConfiguration<Cell>
{
    public void Configure(EntityTypeBuilder<Cell> builder)
    {
        builder.HasKey(c => c.Id);

        builder.Property(c => c.X).IsRequired();
        builder.Property(c => c.Y).IsRequired();
        builder.Property(c => c.IsHit).IsRequired();
    }
}
