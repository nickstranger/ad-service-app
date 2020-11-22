export const password_regexp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,20}$/;

export const routes = Object.freeze({
  banners: {
    path: '/banners',
    name: 'Список баннеров'
  },
  banner: {
    path: '/banners/:id',
    name: 'Настройки баннера'
  },
  createBanner: {
    path: '/banners/create',
    name: 'Создать баннер'
  },
  bannersHistory: {
    path: '/banners/history',
    name: 'История изменений'
  },
  login: {
    path: '/login',
    name: 'Авторизация'
  },
  logout: {
    path: '/logout',
    name: 'Логаут'
  },
  users: {
    path: '/users',
    name: 'Список пользователей'
  },
  user: {
    path: '/users/:id',
    name: 'Настройки пользователя'
  },
  createUser: {
    path: '/users/create',
    name: 'Создать пользователя'
  },
  usersHistory: {
    path: '/users/history',
    name: 'История изменений'
  }
});
