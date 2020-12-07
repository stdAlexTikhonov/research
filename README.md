# Обследования #

Web-интерфейс для заполнения *Анкет*.

## Настройки ##

Все настройки определяются в файле [.env](./.env).

Используемые библиотеки определены в файле [package.json](./package.json).

Каталог `data/` и сторонние библиотеки [не хранятся](https://git-scm.com/docs/gitignore) в репозитории.

## Зависимости ##

В [Хранилище](https://www.contourcomponents.com/ru/dw) данных:

* создаются *Опросные листы* с вопросами, и
* сохраняются заполненные *Анкеты* с ответами.

Для управления пакетами и служебными скриптами используется [npm](https://docs.npmjs.com/packages-and-modules).

Требуемые пакеты скачиваются в каталог `node_modules/` при установке приложения.

Проект инициирован с помощью [Create React App](https://github.com/facebook/create-react-app).

Файл `data/dwh.wsdl` скачивается из *Хранилища* при разворачивании приложения.

## Установка ##

Комбинация `npm install` и `make data/dwh.wsdl`:

    make install

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

Комбинация скриптов `npm run frontend` и `npm run backend`:

    npm start

При запуске *фронтенда* открывается браузер с сайтом на порте [3000](http://localhost:3000).

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

Получает *Опросный лист*. Код обследования и

#### Пример запроса ####

    curl -kLs -H 'Content-Type: application/json' localhost:8123/api/load

#### Пример ответа ####

```json
{
    "code": "satisfaction_of_users_with_official_stat_inform",
    "caption": "Удовлетворенность пользователей официальной статистической информацией...",
    "Questionary": [
        {
            "action_id": 382,
            "code": "v5",
            "value": "Отметьте, какую официальную статистическую информацию Вы используете?",
            "sort_order": 5,
            "parent_code": "v2",
            "question": "v5",
            "multiply_values": true,
            "other_allowed": true,
            "question_tooltip": "Возможны несколько вариантов ответа",
            "question_num": 5
        },
        {
            "action_id": 389,
            "code": "v6.1",
            "value": "Уровень детализации информации",
            "sort_order": 6,
            "parent_code": "v2",
            "question": "v6",
            "multiply_values": false,
            "other_allowed": false,
            "question_group": 6,
            "question_num": 6
        }
    ]
}
```

### POST /api/save ###

Сохраняет *Анкету*.

#### Пример запроса ####

    curl  -kLs  -H 'Content-Type: application/json' -X POST --data-binary '{}' localhost:3000/api/save

## Ссылки ##

To learn React, check out the [React documentation](https://reactjs.org/).
