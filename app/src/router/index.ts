import {
    createRouter,
    createWebHistory,
    NavigationGuardNext,
    RouteLocationNormalized, RouteLocationRaw,
    Router
} from "vue-router";

import {requiresAuth} from "@/middlewares/auth.middleware";
import {fetchCatalogs} from "@/middlewares/catalogs.middleware.ts";
import {
    fetchLessons,
    fetchQuestionsForLesson,
    loadLessonByUUID, loadLessonSolutionsByUUID
} from "@/middlewares/lesson.middleware.ts";

const routes = [
    {
        path: "/",
        component: () => import("@/layouts/Default.layout.vue"),
        children: [
            {
                path: "",
                name: "Home",
                component: () => import("@/views/home/Home.view.vue"),
            },
            {
                path: "/lessons",
                name: "Lessons",
                component: () => import("@/views/lesson/Lessons.view.vue"),
                meta: {
                    middleware: [
                        fetchLessons
                    ]
                }
            },
            {
                path: "/builder",
                name: "LessonBuilder",
                component: () => import("@/views/lesson/LessonBuilder.view.vue"),
                meta: {}
            },
            {
                path: "/lessons/:lessonUUID",
                name: "LessonDetails",
                component: () => import("@/views/lesson/LessonDetails.view.vue"),
                meta: {
                    middleware: [
                        loadLessonByUUID,
                        fetchQuestionsForLesson
                    ]
                }
            },
            {
                path: "/lessons/:lessonUUID/results",
                name: "LessonResults",
                component: () => import("@/views/lesson/LessonResults.view.vue"),
                meta: {
                    middleware: [
                        loadLessonSolutionsByUUID
                    ]
                }
            },
            {
                path: "/catalogs",
                name: "Catalogs",
                component: () => import("@/views/catalog/Catalogs.view.vue"),
                meta: {
                    middleware: [
                        fetchCatalogs
                    ]
                }
            },
            {
                path: "/catalogs/upload",
                name: "UploadCatalog",
                component: () => import("@/views/catalog/CatalogUpload.view.vue"),
                meta: {}
            },
            {
                path: "/catalogs/:catalogId",
                name: "CatalogDetails",
                component: () => import("@/views/catalog/CatalogDetail.view.vue"),
                meta: {}
            },
            {
                path: "/feedback",
                name: "Feedback",
                component: () => import("@/views/user/Feedback.view.vue"),
            },
            {
                path: "/login",
                name: "LogIn",
                component: () => import("@/views/user/LogIn.view.vue"),
            },
            {
                path: "/signup",
                name: "SignUp",
                component: () => import("@/views/user/SignUp.view.vue"),
            },
            {
                path: "/resetPassword",
                name: "ResetPassword",
                component: () => import("@/views/user/ResetPassword.view.vue"),
            },
            {
                path: "/profile",
                name: "Profile",
                component: () => import("@/views/user/Profile.view.vue"),
                meta: {
                    middleware: [
                        requiresAuth
                    ]
                },
            },
            {
                path: "/error",
                name: "Error",
                component: () => import("@/views/util/Error.view.vue"),
            },
            {
                path: "/:pathMatch(.*)*",
                name: "Error",
                component: () => import("@/views/util/Error.view.vue"),
            }
        ],
    },
];

const router: Router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.meta.middleware) {
        const middlewares = Array.isArray(to.meta.middleware) ? to.meta.middleware : [to.meta.middleware];
        return runMiddleware(middlewares, to, from, next);
    }

    return next();
});

function runMiddleware(middlewares: Function[], to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    const [middleware, ...rest] = middlewares;

    if (!middleware) {
        return next();
    }

    middleware(to, from, (nextRoute: RouteLocationRaw | undefined) => {
        runMiddleware(rest, to, from, nextRoute ? () => next(nextRoute) : next);
    });
}

export default router;