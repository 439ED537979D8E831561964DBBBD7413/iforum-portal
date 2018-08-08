import { NgModule } from '@angular/core';
import { ThemeComponent } from './theme.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../auth/_guards/auth.guard";

const routes: Routes = [
    {
        "path": "",
        "component": ThemeComponent,
        "canActivate": [AuthGuard],
        "children": [
            {
                "path": "index",
                "loadChildren": ".\/pages\/aside-left-display-disabled-loader-enabled-enabled-type-spinner-message\/index\/index.module#IndexModule"
            },
            {
                "path": "post",
                "loadChildren": ".\/pages\/aside-left-display-disabled-loader-enabled-enabled-type-spinner-message\/post\/post.module#PostModule"
            },
            {
                "path": "entercategory",
                "loadChildren": ".\/pages\/aside-left-display-disabled-loader-enabled-enabled-type-spinner-message\/enter-category\/enter-category.module#EnterCategoryModule"
            },
            {
                "path": "addcategory",
                "loadChildren": ".\/pages\/aside-left-display-disabled-loader-enabled-enabled-type-spinner-message\/add-category\/add-category.module#AddCategoryModule"
            },
            {
                "path": "account",
                "loadChildren": ".\/pages\/aside-left-display-disabled-loader-enabled-enabled-type-spinner-message\/account\/account.module#AccountModule"
            },
            {
                "path": "autocomment",
                "loadChildren": ".\/pages\/aside-left-display-disabled-loader-enabled-enabled-type-spinner-message\/auto-comment\/auto-comment.module#AutoCommentModule"
            },
            {
                "path": "commentcategory",
                "loadChildren": ".\/pages\/aside-left-display-disabled-loader-enabled-enabled-type-spinner-message\/comment-category\/comment-category.module#CommentCategoryModule"
            },
            {
                "path": "commentcontent",
                "loadChildren": ".\/pages\/aside-left-display-disabled-loader-enabled-enabled-type-spinner-message\/comment-content\/comment-content.module#CommentContentModule"
            },
            {
                "path": "404",
                "loadChildren": ".\/pages\/default\/not-found\/not-found.module#NotFoundModule"
            },
            {
                "path": "",
                "redirectTo": "index",
                "pathMatch": "full"
            }
        ]
    },
    {
        "path": "**",
        "redirectTo": "404",
        "pathMatch": "full"
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ThemeRoutingModule { }