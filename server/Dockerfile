FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy all csproj files and restore as distinct layers
COPY ["src/LexAudit.Api/LexAudit.Api.csproj", "src/LexAudit.Api/"]
COPY ["src/LexAudit.Application/LexAudit.Application.csproj", "src/LexAudit.Application/"]
COPY ["src/LexAudit.Domain/LexAudit.Domain.csproj", "src/LexAudit.Domain/"]
COPY ["src/LexAudit.Infrastructure/LexAudit.Infrastructure.csproj", "src/LexAudit.Infrastructure/"]
RUN dotnet restore "src/LexAudit.Api/LexAudit.Api.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/src/LexAudit.Api"
RUN dotnet publish "LexAudit.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet", "LexAudit.Api.dll"]
