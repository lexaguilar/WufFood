using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace WufFood.Models
{
    public partial class dbContext : DbContext
    {
        public dbContext()
        {
        }

        public dbContext(DbContextOptions<dbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Cliente> Cliente { get; set; }
        public virtual DbSet<Pedido> Pedido { get; set; }
        public virtual DbSet<PedidoDetalle> PedidoDetalle { get; set; }
        public virtual DbSet<Servicio> Servicio { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Server=LEX-PC\\PCLEX;Database=WuftFood;User Id=sa;Password=123;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Cliente>(entity =>
            {
                entity.Property(e => e.Nombre)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<Pedido>(entity =>
            {
                entity.HasIndex(e => e.ClienteId)
                    .HasName("IX_Pedido_Cliente");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.FechaPagado).HasColumnType("datetime");

                entity.Property(e => e.FechaPedido).HasColumnType("datetime");

                entity.Property(e => e.Nota).HasMaxLength(150);

                entity.HasOne(d => d.Cliente)
                    .WithMany(p => p.Pedido)
                    .HasForeignKey(d => d.ClienteId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Pedido_Cliente");
            });

            modelBuilder.Entity<PedidoDetalle>(entity =>
            {
                entity.HasIndex(e => e.PedidoId)
                    .HasName("IX_PedidoDetalle");

                entity.HasIndex(e => e.ServicioId)
                    .HasName("IX_PedidoDetalle_Servicio");

                entity.HasOne(d => d.Pedido)
                    .WithMany(p => p.PedidoDetalle)
                    .HasForeignKey(d => d.PedidoId)
                    .HasConstraintName("FK_PedidoDetalle_Pedido");

                entity.HasOne(d => d.Servicio)
                    .WithMany(p => p.PedidoDetalle)
                    .HasForeignKey(d => d.ServicioId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PedidoDetalle_Servicio");
            });

            modelBuilder.Entity<Servicio>(entity =>
            {
                entity.Property(e => e.Nombre)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });
        }
    }
}
