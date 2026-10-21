import { Routes } from '@angular/router';
import { ExploreComponent } from './features/anime/pages/explore/explore.component';
import { AnimeComponent } from './features/anime/pages/anime/anime.component';
import { SearchComponent } from './features/anime/pages/search/search.component';
import { UsersComponent } from './features/user/pages/users/users.component';
import { AdminComponent } from './features/admin/pages/admin/admin.component';
import { AnimeListComponent } from './features/admin/components/anime-list/anime-list.component';
import { AnimeEditComponent } from './features/admin/components/anime-edit/anime-edit.component';
import { AnimeAddComponent } from './features/admin/components/anime-add/anime-add.component';
import { EpisodeListComponent } from './features/admin/components/episode-list/episode-list.component';
import { EpisodeAddComponent } from './features/admin/components/episode-add/episode-add.component';
import { FranchiseListComponent } from './features/admin/components/franchise-list/franchise-list.component';
import { FranchiseAddComponent } from './features/admin/components/franchise-add/franchise-add.component';
import { AdminGuard } from './features/admin/guards/admin.guard';
import { MediaReactionsComponent } from './features/user/pages/media-reactions/media-reactions.component';
import { ExploreCollectionComponent } from './features/anime/components/explore-collection/explore-collection.component';
import { ExploreBrowseComponent } from './features/anime/components/explore-browse/explore-browse.component';

export const routes: Routes = [
  { 
    path: "explore", component: ExploreComponent, children: [
      {
        path: "",
        component: ExploreBrowseComponent
      },
      {
        path: ":collection",
        component: ExploreCollectionComponent
      }
    ] 
  },
  { path: "explore/category/:category", component: ExploreComponent },
  { path: "anime/:id", component: AnimeComponent },
  { path: "anime/:id/:tab", component: AnimeComponent },
  { path: "search", component: SearchComponent },
  { path: "users/:id", component: UsersComponent },
  { path: "users/:id/:tab", component: UsersComponent },
  { path: "media-reactions/:id", component: MediaReactionsComponent },
  {
    path: "admin", component: AdminComponent, children: [
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
  { path: "", redirectTo: "/explore", pathMatch: "full" },
];
