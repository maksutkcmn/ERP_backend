FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 5057

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["ASP_deneme.csproj", "."]
RUN dotnet restore
COPY . .
RUN dotnet build ASP_deneme.csproj -c Release -o /app/build

FROM build AS publish
RUN dotnet publish ASP_deneme.csproj -c Release -o /app/publish --no-restore

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENV ASPNETCORE_URLS=http://+:5057
ENTRYPOINT ["dotnet", "ASP_deneme.dll"]
