# Kitsu clone (front-end)

This project is a [Kitsu](https://kitsu.app/) clone for tracking anime.  
You can [demo the live app](https://icy-sky-0b3ce1210.6.azurestaticapps.net/). A demo login is provided below for you to use:  
**Email**:  
**Password**: 

## Features

### Explore Anime
Find anime in the explore page or by searching.  
<img width="1280" height="729" alt="KitsuMozillaFirefox2026-09-2816-52-57-ezgif com-video-to-gif-converter" src="https://github.com/user-attachments/assets/668f6270-eec8-4510-8d60-986a020a6713" />

### Track anime 
Track anime with ratings, progress, and a library.  
<img width="1280" height="726" alt="KitsuMozillaFirefox2026-09-2817-14-54-ezgif com-video-to-gif-converter" src="https://github.com/user-attachments/assets/d14f1387-6f68-43ad-afca-2508187188c9" />

### View your profile 
Manage your profile with a profile/cover photo or a list of favorite anime.  
<img width="1280" height="727" alt="KitsuMozillaFirefox2026-09-2817-43-49-ezgif com-video-to-gif-converter" src="https://github.com/user-attachments/assets/9fa519f8-202f-4b14-a693-363e513f15a1" />

### Manage your library 
Edit your library entries with a search, filter, and sorting options.  
<img width="1280" height="724" alt="KitsuMozillaFirefox2026-09-2818-22-49-ezgif com-video-to-gif-converter" src="https://github.com/user-attachments/assets/d2e048f2-b49f-416b-9b79-ef9f2e7dfb7a" />  

Tech stack used: 
- Angular 18 (front-end)
- ASP.NET Core (back-end, [repository link](https://github.com/zerquet/kitsu-backend))
- SQL Server (database)
- Azure (Static Web App for front-end, App Service for API, SQL Server for database, Storage account for image hosting)

Architecture Notes:
The code-base is structured by features
- `admin/ ` relates to the admin hub
- `anime` relates to the search, explore and anime pages
- `auth/` relates to authentication (sign in/sign out)
- `user/` relates to the user's library, profile, and media reactions. 
