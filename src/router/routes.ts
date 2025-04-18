import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/HomePage.vue') },
      { name: 'classes', path: 'class', component: () => import('pages/ClassPage.vue') },
      { name: 'attendance', path: 'attendance/:classKey', component: () => import('pages/AttendancePage.vue') },
      { name: 'rollCall', path: 'roll-call/:classKey', component: () => import('pages/RollCallPage.vue') },

    ]
  },

  // Student Page
  {
    path: '/student',
    component: () => import('layouts/StudentLayout.vue'),
    children: [
      { path: '', component: () => import('pages/student/StudentDashboard.vue') },
    ]
  },
  // Teacher Page
  {
    path: '/teacher',
    component: () => import('layouts/TeacherLayout.vue'),
    children: [
      { path: '', component: () => import('pages/teacher/TeacherDashboard.vue') },
    ]
  },
  // Supervisor Page
  {
    path: '/supervisor',
    component: () => import('layouts/SupervisorLayout.vue'),
    children: [
      { path: '', component: () => import('pages/supervisor/SupervisorDashboard.vue') },
    ]
  },

  // Admin Page
  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      { path: '', component: () => import('pages/admin/DashboardPage.vue')},
      { path: 'user-approvals', component: () => import('pages/admin/UserApprovals.vue')},
      { path: 'users', component: () => import('pages/admin/UsersPage.vue')},
    ]
  },

  // Status Page
  {
    path: '/status',
    component: () => import('layouts/StatusAccLayout.vue'),
    children: [
      { path: '', component: () => import('pages/StatusPage.vue') },
    ]
  },


  //loginPage
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
    {path: 'login', component: () => import('pages/auth/LoginPage.vue')},

    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
