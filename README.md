# Kitsu clone (front-end)

A full-stack anime tracker based on [Kitsu](https://kitsu.app/). It was built to practice Angular, .NET and Azure.  
You can [demo the live app](https://icy-sky-0b3ce1210.6.azurestaticapps.net/). A demo login is provided below for you to use:

**Email**: demo1@gmail.com  
**Password**: kitsudemo12345

## Features

### Explore Anime

Find anime in the explore page or by searching.  
<img width="1280" height="729" alt="Explore and search anime" src="https://github.com/user-attachments/assets/668f6270-eec8-4510-8d60-986a020a6713" />

### Track anime

Track anime with ratings, progress, and a library.  
<img width="1280" height="726" alt="Add anime to your library" src="https://github.com/user-attachments/assets/d14f1387-6f68-43ad-afca-2508187188c9" />

### View your profile

Manage your profile with a profile/cover photo or a list of favorite anime.  
<img width="1280" height="727" alt="Customize your profile" src="https://github.com/user-attachments/assets/9fa519f8-202f-4b14-a693-363e513f15a1" />

### Manage your library

Edit your library entries with a search, filter, and sorting options.  
<img width="1280" height="724" alt="Manage your library" src="https://github.com/user-attachments/assets/d2e048f2-b49f-416b-9b79-ef9f2e7dfb7a" />

### Admin Hub

_(UI is a work-in-progress)_  
Control the anime catalog via the admin hub.
<img width="1280" height="726" alt="Admin Hub" src="https://github.com/user-attachments/assets/402d90c9-3176-4780-bd2c-3824a09ded7d" />

## Tech stack used:

- Angular 18 (front-end)
- ASP.NET Core (back-end, [repository link](https://github.com/zerquet/kitsu-backend))
- SQL Server (database)
- Azure (Static Web App for front-end, App Service for API, SQL Server for database, Storage account for image hosting)

## Architecture Notes:

- `core/`: JWT interceptors and layout
- `shared/`: reusable components, services, validators and DTO -> model mappers
- Route guards that protect the admin hub

The code-base is structured by features:

- `admin/ `: admin hub to manage anime catalog
- `anime/`: contains the search, explore and anime pages
- `auth/`: authentication (sign in/sign out)
- `user/`: relates to the user's library, profile, and media reactions.

## Running locally

This front-end expects the [kitsu-backend](https://github.com/zerquet/kitsu-backend) API running locally on `https://localhost:7017`. Once that's up:

```
npm install
ng serve
```

Navigate to `http://localhost:4200`. Without the backend running, pages that fetch data (explore, search, anime, profiles) won't load.
