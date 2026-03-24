
export default [
  {
    path: "/login",
    name: "Login",
    component: () => import("#/views/_core/authentication/login.vue"),
    meta: {
      title: "登录",
      showLink: false,
      rank: 101
    }
  },

];
