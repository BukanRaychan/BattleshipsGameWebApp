using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ProductCatalogAPI.Models;

namespace ProductCatalogAPI.Configurations;

public class AttackConfiguration : IEntityTypeConfiguration<Attack>
{
    public void Configure(EntityTypeBuilder<Attack> builder)
    {
        builder.HasKey(a => a.Id);

        builder.Property(a => a.X).IsRequired();
        builder.Property(a => a.Y).IsRequired();

        builder.Property(a => a.Result)
            .IsRequired()
            .HasConversion<string>();

        builder.Property(a => a.CreatedAt)
            .IsRequired();

        builder.HasOne(a => a.AttackingPlayer)
            .WithMany()
            .HasForeignKey(a => a.AttackingPlayerId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
