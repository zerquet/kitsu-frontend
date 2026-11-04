# Kitsu clone (front-end)

A full-stack anime tracker based on [Kitsu](https://kitsu.app/). It was built to practice Angular, .NET and Azure.

> This is an unofficial portfolio project. It is not affiliated with, endorsed by, or connected to Kitsu.

You can [demo the live app](https://icy-sky-0b3ce1210.6.azurestaticapps.net/). A demo login is provided below for you to use:

**Email**: demo1@gmail.com  
**Password**: kitsudemo12345

## Features

### Explore Anime

Find anime in the explore page, browse by category or collection, or use the advanced search with filters and sorting.  
<img width="1280" height="729" alt="Explore and search anime" src="https://github.com/user-attachments/assets/668f6270-eec8-4510-8d60-986a020a6713" />

### Track anime

Track anime with ratings, progress, and a library. Each anime page has a summary, episodes, reactions and franchise tab.  
<img width="1280" height="726" alt="Add anime to your library" src="https://github.com/user-attachments/assets/d14f1387-6f68-43ad-afca-2508187188c9" />

### Media reactions

Post short reactions to anime you've watched. Reactions show up on the anime's page and on your profile, and you can edit or delete your own.
<!-- TODO: add screenshot -->

### View your profile

Manage your profile with a profile/cover photo or a list of favorite anime.  
<img width="1280" height="727" alt="Customize your profile" src="https://github.com/user-attachments/assets/9fa519f8-202f-4b14-a693-363e513f15a1" />

### Manage your library

Edit your library entries with a search, filter, and sorting options.  
<img width="1280" height="724" alt="Manage your library" src="https://github.com/user-attachments/assets/d2e048f2-b49f-416b-9b79-ef9f2e7dfb7a" />

### Admin Hub

Manage the anime catalog, episodes and franchises via the admin hub.  
<img width="1000" height="566" alt="Admin hub" src="https://github.com/user-attachments/assets/bb7aad80-5b44-4bf8-bc6d-14dff6e6fa75" />

## Tech stack

- Angular 18 with Bootstrap 5 / ng-bootstrap and Angular Material (front-end)
- ASP.NET Core (back-end, [repository link](https://github.com/zerquet/kitsu-backend))
- SQL Server (database)
- Azure (Static Web App for front-end, App Service for API, SQL Server for database, Storage account for image hosting)

## Architecture notes

- `core/`: JWT interceptor, nav menu layout, and app-wide directives/utilities
- `shared/`: reusable components, services, models, validators, helpers and DTO -> model mappers
- A route guard protects the admin hub

The code-base is structured by features under `features/`:

- `admin/`: admin hub to manage the anime catalog, episodes and franchises
- `anime/`: contains the explore, search and anime pages
- `auth/`: authentication (sign up, sign in, sign out)
- `user/`: relates to the user's library, profile, and media reactions

Each feature keeps its own DTOs, models, components and services.

## Running locally

This front-end expects the [kitsu-backend](https://github.com/zerquet/kitsu-backend) API running locally on `https://localhost:7017`. Once that's up:

```
npm install
npm start
```

Navigate to `http://localhost:4200`. Without the backend running, pages that fetch data (explore, search, anime, profiles) won't load.

To run the unit tests:

```
npm test
```
