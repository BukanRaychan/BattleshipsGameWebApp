# Graph Report - .  (2026-06-29)

## Corpus Check
- Corpus is ~13,966 words - fits in a single context window. You may not need a graph.

## Summary
- 586 nodes · 947 edges · 39 communities (23 shown, 16 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.79)
- Token cost: 67,609 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_API Controllers & Services|API Controllers & Services]]
- [[_COMMUNITY_Obsidian BRAT Plugin|Obsidian BRAT Plugin]]
- [[_COMMUNITY_React App Shell & Auth|React App Shell & Auth]]
- [[_COMMUNITY_Frontend Dependencies|Frontend Dependencies]]
- [[_COMMUNITY_EF Core DB Configuration|EF Core DB Configuration]]
- [[_COMMUNITY_Frontend API Services|Frontend API Services]]
- [[_COMMUNITY_Launch Settings|Launch Settings]]
- [[_COMMUNITY_Auth & Validation|Auth & Validation]]
- [[_COMMUNITY_shadcnui Config|shadcn/ui Config]]
- [[_COMMUNITY_Architecture Concepts|Architecture Concepts]]
- [[_COMMUNITY_TS App Config|TS App Config]]
- [[_COMMUNITY_TS Node Config|TS Node Config]]
- [[_COMMUNITY_Backend NuGet Packages|Backend NuGet Packages]]
- [[_COMMUNITY_Database Seeders|Database Seeders]]
- [[_COMMUNITY_Theme Provider|Theme Provider]]
- [[_COMMUNITY_Obsidian Plugin Manifest|Obsidian Plugin Manifest]]
- [[_COMMUNITY_Global Exception Handling|Global Exception Handling]]
- [[_COMMUNITY_AutoMapper Profiles|AutoMapper Profiles]]
- [[_COMMUNITY_TS Base Config|TS Base Config]]
- [[_COMMUNITY_API Response Wrapper|API Response Wrapper]]
- [[_COMMUNITY_React Branding|React Branding]]
- [[_COMMUNITY_Auth Response DTO|Auth Response DTO]]
- [[_COMMUNITY_Login DTO|Login DTO]]
- [[_COMMUNITY_Register DTO|Register DTO]]
- [[_COMMUNITY_Update Profile DTO|Update Profile DTO]]
- [[_COMMUNITY_User Info DTO|User Info DTO]]
- [[_COMMUNITY_Solution File|Solution File]]
- [[_COMMUNITY_Create Product DTO|Create Product DTO]]
- [[_COMMUNITY_Product Response DTO|Product Response DTO]]
- [[_COMMUNITY_Update Product DTO|Update Product DTO]]
- [[_COMMUNITY_Vite Branding|Vite Branding]]
- [[_COMMUNITY_Create Unit Product DTO|Create Unit Product DTO]]
- [[_COMMUNITY_Unit Product Response DTO|Unit Product Response DTO]]
- [[_COMMUNITY_Update Unit Product DTO|Update Unit Product DTO]]
- [[_COMMUNITY_Obsidian Welcome Note|Obsidian Welcome Note]]

## God Nodes (most connected - your core abstractions)
1. `apiFetch()` - 19 edges
2. `compilerOptions` - 19 edges
3. `cn()` - 16 edges
4. `compilerOptions` - 16 edges
5. `UnitProduct` - 13 edges
6. `Product` - 11 edges
7. `addPlugin()` - 11 edges
8. `UnitProductService` - 10 edges
9. `N()` - 10 edges
10. `P()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Battleships UI (React + Vite + shadcn/ui)` --conceptually_related_to--> `JWT Bearer Authentication`  [INFERRED]
  BattleshipsGameUI/README.md → README.md
- `updateProfile()` --calls--> `apiFetch()`  [INFERRED]
  BattleshipsGameUI/src/services/authService.ts → BattleshipsGameUI/src/services/api.ts
- `getAllProducts()` --calls--> `apiFetch()`  [INFERRED]
  BattleshipsGameUI/src/services/productService.ts → BattleshipsGameUI/src/services/api.ts
- `getProductById()` --calls--> `apiFetch()`  [INFERRED]
  BattleshipsGameUI/src/services/productService.ts → BattleshipsGameUI/src/services/api.ts
- `getUnitProductById()` --calls--> `apiFetch()`  [INFERRED]
  BattleshipsGameUI/src/services/unitProductService.ts → BattleshipsGameUI/src/services/api.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Request Lifecycle Layered Pipeline** — readme_global_exception_handler, readme_fluentvalidation, readme_jwt_authentication, readme_controller_layer, readme_service_layer, readme_repository_layer, readme_appdbcontext [EXTRACTED 1.00]

## Communities (39 total, 16 thin omitted)

### Community 0 - "API Controllers & Services"
Cohesion: 0.05
Nodes (28): Authorize, ControllerBase, AuthController, ProductsController, UnitProductsController, CreateProductDto, CreateUnitProductDto, HttpDelete (+20 more)

### Community 1 - "Obsidian BRAT Plugin"
Cohesion: 0.05
Nodes (59): addPlugin(), bs(), checkForPluginUpdatesAndInstallUpdates(), checkIncompatiblePlugins(), compare(), compareMain(), comparePre(), constructor() (+51 more)

### Community 2 - "React App Shell & Auth"
Cohesion: 0.09
Nodes (38): RequireAuth(), navItems, Shell(), ThemeProvider(), AuthContext, AuthContextType, AuthProvider(), useAuth() (+30 more)

### Community 3 - "Frontend Dependencies"
Cohesion: 0.05
Nodes (40): dependencies, class-variance-authority, clsx, @fontsource-variable/dm-sans, radix-ui, react, react-dom, react-router-dom (+32 more)

### Community 4 - "EF Core DB Configuration"
Cohesion: 0.07
Nodes (15): ApplicationUserConfiguration, ProductConfiguration, UnitProductConfiguration, AppDbContext, DataSeeder, EntityTypeBuilder, IdentityDbContext, IdentityUser (+7 more)

### Community 5 - "Frontend API Services"
Cohesion: 0.13
Nodes (27): apiFetch(), ApiRequestOptions, getAuthToken(), login(), register(), updateProfile(), createProduct(), deleteProduct() (+19 more)

### Community 6 - "Launch Settings"
Cohesion: 0.07
Nodes (28): ASPNETCORE_ENVIRONMENT, applicationUrl, commandName, dotnetRunMessages, environmentVariables, launchBrowser, launchUrl, applicationUrl (+20 more)

### Community 7 - "Auth & Validation"
Cohesion: 0.11
Nodes (13): AbstractValidator, AuthResponseDto, LoginValidator, RegisterValidator, UpdateProfileValidator, IConfiguration, LoginDto, RegisterDto (+5 more)

### Community 8 - "shadcn/ui Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 9 - "Architecture Concepts"
Cohesion: 0.10
Nodes (22): UI HTML Entry Point, Battleships UI (React + Vite + shadcn/ui), Consistent API Response Wrapper, AppDbContext (EF Core), ASP.NET Core Identity, ASP.NET Web API (Battleships Backend), AutoMapper DTO Mapping, Clean Architecture Layering (+14 more)

### Community 10 - "TS App Config"
Cohesion: 0.09
Nodes (21): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection, moduleResolution (+13 more)

### Community 11 - "TS Node Config"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, moduleResolution, noEmit (+9 more)

### Community 12 - "Backend NuGet Packages"
Cohesion: 0.13
Nodes (14): net8.0, AutoMapper (12.0.1), AutoMapper.Extensions.Microsoft.DependencyInjection (12.0.1), FluentValidation.AspNetCore (11.3.1), Microsoft.AspNetCore.Authentication.JwtBearer (8.0.13), Microsoft.AspNetCore.Identity.EntityFrameworkCore (8.0.13), Microsoft.AspNetCore.OpenApi (8.0.27), Microsoft.EntityFrameworkCore (8.0.13) (+6 more)

### Community 13 - "Database Seeders"
Cohesion: 0.15
Nodes (5): ApplicationUserSeeder, ISeeder, ProductSeeder, UnitProductSeeder, UserManager

### Community 14 - "Theme Provider"
Cohesion: 0.17
Nodes (6): ResolvedTheme, Theme, THEME_VALUES, ThemeProviderContext, ThemeProviderProps, ThemeProviderState

### Community 15 - "Obsidian Plugin Manifest"
Cohesion: 0.17
Nodes (11): author, authorUrl, description, fundingUrl, Visit my site, helpUrl, id, isDesktopOnly (+3 more)

### Community 16 - "Global Exception Handling"
Cohesion: 0.20
Nodes (8): CancellationToken, Exception, GlobalExceptionHandler, HttpContext, HttpStatusCode, IExceptionHandler, ILogger, ValueTask

### Community 17 - "AutoMapper Profiles"
Cohesion: 0.29
Nodes (4): Profile, ApplicationUserProfile, ProductProfile, UnitProductProfile

### Community 18 - "TS Base Config"
Cohesion: 0.33
Nodes (5): compilerOptions, paths, files, @/*, references

## Knowledge Gaps
- **182 isolated node(s):** `AuthResponseDto`, `LoginDto`, `RegisterDto`, `UpdateProfileDto`, `UserInfoResponseDto` (+177 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AppDbContext` connect `EF Core DB Configuration` to `API Controllers & Services`, `Database Seeders`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Why does `ApplicationUser` connect `EF Core DB Configuration` to `Auth & Validation`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **Why does `UnitProduct` connect `API Controllers & Services` to `EF Core DB Configuration`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `apiFetch()` (e.g. with `login()` and `register()`) actually correct?**
  _`apiFetch()` has 14 INFERRED edges - model-reasoned connections that need verification._
- **What connects `AuthResponseDto`, `LoginDto`, `RegisterDto` to the rest of the system?**
  _183 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `API Controllers & Services` be split into smaller, more focused modules?**
  _Cohesion score 0.05276907001044932 - nodes in this community are weakly interconnected._
- **Should `Obsidian BRAT Plugin` be split into smaller, more focused modules?**
  _Cohesion score 0.053313587560162905 - nodes in this community are weakly interconnected._