using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ProductCatalogAPI.Models;

namespace ProductCatalogAPI.Configurations;

public class PlayerConfiguration : IEntityTypeConfiguration<Player>
{
    public void Configure(EntityTypeBuilder<Player> builder)
    {
        builder.HasKey(p => p.Id);
        
        builder.Property(p => p.Id).ValueGeneratedNever(); // Id is assigned client-side (Guid.NewGuid()); insert it as-is.

        builder.Property(p => p.PlayerToken)
            .IsRequired()
            .HasMaxLength(64);

        builder.HasIndex(p => p.PlayerToken)
            .IsUnique();

        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(p => p.JoinedAt)
            .IsRequired();

        builder.HasMany(p => p.Ships)
            .WithOne(s => s.Player)
            .HasForeignKey(s => s.PlayerId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
