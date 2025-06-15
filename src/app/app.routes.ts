import { Routes } from '@angular/router';
import { ExploreComponent } from './animes/pages/explore/explore.component';
import { AnimeComponent } from './animes/pages/anime/anime.component';
import { SearchComponent } from './animes/pages/search/search.component';
import { UserComponent } from './users/pages/user/user.component';
import { AdminComponent } from './admin/pages/admin/admin.component';
import { AnimeListComponent } from './admin/components/anime-list/anime-list.component';
import { AnimeEditComponent } from './admin/components/anime-edit/anime-edit.component';
import { AnimeAddComponent } from './admin/components/anime-add/anime-add.component';
import { EpisodeListComponent } from './admin/components/episode-list/episode-list.component';
import { EpisodeAddComponent } from './admin/components/episode-add/episode-add.component';
import { FranchiseListComponent } from './admin/components/franchise-list/franchise-list.component';
import { FranchiseAddComponent } from './admin/components/franchise-add/franchise-add.component';
import { AdminGuard } from './core/guards/admin.guard';
import { MediaReactionsComponent } from './users/pages/media-reactions/media-reactions.component';

export const routes: Routes = [
    {path: "explore", component: ExploreComponent},
    {path: "explore/category/:category", component: ExploreComponent},
    {path: "anime/:id", component: AnimeComponent},
    {path: "anime/:id/:tab", component: AnimeComponent},
    {path: "search", component: SearchComponent},
    {path: "users/:id", component: UserComponent},
    {path: "users/:id/:tab", component: UserComponent},
    {path: "media-reactions/:id", component: MediaReactionsComponent},
    {path: "admin", component: AdminComponent, children: [
      {
        path: "anime",
        component: AnimeListComponent,
        pathMatch: "prefix"
      },
      {
        path: "anime/:animeId",
        component: AnimeEditComponent
      },
      {
        path: "add/anime", // 'anime/add' doesn't work because angular routes to anime edit route
        component: AnimeAddComponent
      },
      {
        path: "episodes",
        component: EpisodeListComponent
      },
      {
        path: "add/episode",
        component: EpisodeAddComponent
      },
      {
        path: "franchises",
        component: FranchiseListComponent
      },
      {
        path: "add/franchise",
        component: FranchiseAddComponent
      }
    ],
    canActivate: [AdminGuard]
  },
    {path: "", redirectTo: "/explore", pathMatch: "full"},
];
