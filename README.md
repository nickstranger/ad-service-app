# Ad Service App

Приложение является микросервисом и позволяет хранить, отдавать и администрировать набор баннеров для внешнего клиента (другого микросервиса, сайта и т.д.).

Приложение состоит из двух частей: серверного и клиентского приложений. Сервер включает базу данных, API для внешних клиентов, API для клиентского приложения, имеет авторизацию с набором ролей, а также отдает клиентское приложение. Клиент имеет авторизацию с различными ролями, содержит инструменты управления пользователями и баннерами, инструменты просмотра истории изменений.

## Основные используемые технологии
- [Docker](https://www.docker.com/)
- [NestJS](https://nestjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Typescript](https://www.typescriptlang.org/)
- [React](https://reactjs.org/)
- [Redux](https://redux.js.org/)
- [Material UI](https://material-ui.com/)
- [Formik](https://formik.org/)
- [Passport](http://www.passportjs.org/)
- [React Router](https://reactrouter.com/)
- [Class Validator](https://github.com/typestack/class-validator)
- [Yup](https://github.com/jquense/yup)


## Установка

### Конфигурация докер контейнера

Создать в корне проекта файл .env с содержимым:

```
SERVER_PORT=4000
SERVER_HOST=localhost

JWT_SECRET=some_key
JWT_EXPIRATION=86400

DB_HOST=mongodb
DB_PORT=27017
DB_USERNAME=user
DB_PASSWORD=pass
DB_DATABASE=ads
```

URI для коннекта к БД сформируется автоматически из предоставленных выше данных, но также возможно явно указать переменную DB_URI, например:
```
DB_URI=mongodb://user:pass@mongodb:27017/ads?authSource=admin
```
Описание переменных:
- **_SERVER_PORT_** - порт web-сервера
- **_SERVER_HOST_** - адрес web-сервера
- **_JWT_SECRET_** - секретный ключ шифрования для токенов авторизации
- **_JWT_EXPIRATION_** - время истечения выданного токена авторизации в секундах
- **_DB_HOST_** - адрес базы данных
- **_DB_PORT_** - порт базы данных
- **_DB_USERNAME_** - пользователь базы данных для подключения
- **_DB_PASSWORD_** - пароль пользователя для подключения
- **_DB_DATABASE_** - имя базы
- **_DB_URI_** - строка для коннекта к базе

### Запуск и пересборка докер контейнера

В prod-режиме:
```
docker-compose up --build
```
> используй флаг `-V`, если нужно очистить volumes при запуске

В dev-режиме:
```
docker-compose -f docker-compose.dev.yml up --build
```
> используй флаг `-V` если нужно очистить volumes при запуске

Остановка проекта:
```
docker-compose down
```
> используй флаг `-v` если нужно очистить volumes при остановке

Сервис доступен по адресу: <http://localhost:SERVER_PORT>
> SERVER_PORT - порт, который указали в файле .env

### Создание первого пользователя приложения
При первой инициализации MongoDB автоматически создается пользователь с ролью admin:
```
login: admin
pass: 1234567aA
```
> **Внимание!** После запуска проекта в целях безопасности не забудьте изменить пароль через интерфейс приложения. Также желательно сменить email.
