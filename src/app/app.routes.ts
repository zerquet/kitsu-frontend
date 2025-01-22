import { Routes } from '@angular/router';
import { ExploreComponent } from './animes/pages/explore/explore.component';
import { AnimeComponent } from './animes/pages/anime/anime.component';
import { SearchComponent } from './animes/pages/search/search.component';
import { UserComponent } from './users/pages/user/user.component';

export const routes: Routes = [
    {path: "explore", component: ExploreComponent},
    {path: "explore/category/:category", component: ExploreComponent},
    {path: "anime/:id", component: AnimeComponent},
    {path: "anime/:id/:tab", component: AnimeComponent},
    {path: "search", component: SearchComponent},
    {path: "users/:id", component: UserComponent},
    {path: "users/:id/:tab", component: UserComponent},
    {path: "", redirectTo: "/explore", pathMatch: "full"},
];
