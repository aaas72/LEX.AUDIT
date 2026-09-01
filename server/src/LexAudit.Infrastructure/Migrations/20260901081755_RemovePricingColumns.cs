using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LexAudit.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemovePricingColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AuditsUsedThisMonth",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "CurrentPlan",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "SubscriptionExpiry",
                table: "Users");

            migrationBuilder.AddColumn<string>(
                name: "GeminiApiKey",
                table: "Users",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GeminiApiKey",
                table: "Users");

            migrationBuilder.AddColumn<int>(
                name: "AuditsUsedThisMonth",
                table: "Users",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CurrentPlan",
                table: "Users",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "SubscriptionExpiry",
                table: "Users",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
