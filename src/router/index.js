import { createWebHistory, createRouter } from "vue-router";
import PageNotFound from '../views/PageNotFound.vue'

import SubPageForRouting from "../views/SubView.vue";
  
const routes = [
  {
    path: "/",
    component: SubPageForRouting,
    children: [
      {
        path: "",
        alias: "sub",
        name:"sub",
        // component: comp
      }
    ]
    },
    {
        path: '/:catchAll(.*)*',
        name: "PageNotFound",
        component: PageNotFound,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
