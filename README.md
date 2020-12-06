# Обследования #

Web-интерфейс для заполнения *Анкет*.

## Настройки ##

Все настройки определяются в файле [.env](./.env).

Используемые библиотеки определены в файле [package.json](./package.json).

## Зависимости ##

В [Хранилище](https://www.contourcomponents.com/ru/dw) данных:

* создаются *Опросные листы* с вопросами, и
* сохраняются заполненные *Анкеты* с ответами.

Для управления пакетами и служебными скриптами используется [npm](https://docs.npmjs.com/packages-and-modules).

Сторонние библиотеки [не хранятся](https://git-scm.com/docs/gitignore) в репозитории.

Требуемые пакеты скачиваются в каталог `node_modules/` при установке приложения.

## Установка ##

Проект инициирован с помощью [Create React App](https://github.com/facebook/create-react-app).

    npm install

## Сборка ##

Сборка файлов фронтенда в папке `build/` для использования в **production**:

    npm run build

It correctly bundles React in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes.
See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Запуск ##

Два основных режима запуска приложения: разработка и эксплуатация.
Им соответствуют следующие значения переменной окружения `NODE_ENV`.

### development ###

    npm start

Открывает браузер с фронтендом на порту [3000](http://localhost:3000).

### production ###

    npm run server

## Тесты ##

Launch the test runner in the interactive watch mode:

    npm test

See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## Термины ###

### Обследование (Survey) ###

*Обследование* содержит набор вопросов и заполненные анкеты с ответами.

### Опросный лист (Questionary) ###

*Опросный лист* определяет порядок вопросов и возможные варианты ответа на них.

### Анкета ###

*Анкеты* хранят ответы респондентов в Хранилище.

## API ##

### GET /api/load ###

Получает *Опросный лист*:

    curl -kLs -H 'Content-Type: application/json' localhost:3000/api/load

### POST /api/save ###

Сохраняет *Анекту*:

    curl  -kLs  -H 'Content-Type: application/json' -X POST --data-binary '{}' localhost:8123/api/save

## Ссылки ##

To learn React, check out the [React documentation](https://reactjs.org/).
