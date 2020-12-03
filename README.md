# Обследования

Web-интерфейс для заполнения опросных листов.

## Настройки ##

Все настройки определяются в файле [.env](./.env).

## Зависимости

В [Хранилище](https://www.contourcomponents.com/ru/dw) данных создаются опросные листы и сохраняются анкеты с ответами.

Используемые библиотеки определены в [package.json](./package.json).

Пакеты устанавливаются в каталог `node_modules/`.

## Установка

    npm install

Проект инициирован с помощью [Create React App](https://github.com/facebook/create-react-app).

## Сборка

Сборка файлов фронтенда в папке `build/` для использования в production:

    npm build

It correctly bundles React in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes.
See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Запуск

In the project directory, you can run:

    npm start

## Тесты

Launch the test runner in the interactive watch mode:

    npm test

See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## Термины

### Обследование

**Survey**. Вопросы и ответы.

### Опросный лист

Вопросы *Обследования*.

### Анкета

Ответы на вопросы *Обследования*.

## API

### GET /api/load

Получает *Опросный лист*:

    curl -kLs -H 'Content-Type: application/json' localhost:3000/api/load

### POST /api/save

Сохраняет *Анекту*:

    curl -X POST -kLs -H 'Content-Type: application/json' --data-binary '{}' localhost:8123/api/save

## Ссылки

To learn React, check out the [React documentation](https://reactjs.org/).
