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

Получает *Опросный лист*.

#### Пример запроса ####

    curl -kLs -H 'Content-Type: application/json' localhost:8123/api/load

#### Пример ответа ####

```json
{
    "code": "satisfaction_of_users_with_official_stat_inform",
    "caption": "Удовлетворенность пользователей официальной статистической информацией...",
    "Questionary": [
        {
            "code": "v1",
            "value": "Пользуетесь ли Вы официальной статистической информацией, предоставляемой Службой?",
            "question": "v1",
            "multiply_values": false,
            "other_allowed": false,
            "question_num": 1
        },
        {
            "code": "v2",
            "value": "Как часто Вы пользуетесь официальной статистической информацией?..",
            "parent_code": "v1",
            "question": "v2",
            "multiply_values": false,
            "other_allowed": false,
            "condition": 1,
            "question_num": 2
        },
        {
            "code": "v5",
            "value": "Какую официальную статистическую информацию Вы используете?",
            "parent_code": "v2",
            "question": "v5",
            "multiply_values": true,
            "other_allowed": true,
            "question_tooltip": "Возможны несколько вариантов ответа",
            "question_num": 5
        },
        {
            "code": "v6.1",
            "value": "Уровень детализации информации",
            "parent_code": "v2",
            "question": "v6",
            "multiply_values": false,
            "other_allowed": false,
            "question_group": 6,
            "question_num": 6,
        },
        {
            "code": "v6.3",
            "value": "Оперативность",
            "parent_code": "v2",
            "question": "v6",
            "multiply_values": false,
            "other_allowed": false,
            "question_group": 6,
            "question_num": 6
        }
    ],
    "References": {
        "question_groups": {
            "code": "satisfaction_of_users_with_official_stat_inform_groupref",
            "caption": "Удовлетворенность пользователей...",
            "question_groups": true,
            "Reference": [
                {
                    "code": 6,
                    "question_num": 6,
                    "value": "Оцените, пожалуйста, официальную статистическую информацию по 10-балльной шкале..."
                },
                {
                    "code": 7,
                    "question_num": 7,
                    "value": "Насколько хорошо Вы осведомлены..."
                }
            ]
        },
        "v7": {
            "code": "v7",
            "caption": "Вопрос 07. Насколько хорошо Вы осведомлены о методологических разработках?..",
            "Reference": [
                {
                    "code": 3,
                    "value": "Практически ничего не знаю"
                },
                {
                    "code": 4,
                    "value": "Не знаю ничего"
                },
                {
                    "code": 0,
                    "value": "Затрудняюсь ответить"
                }
            ]
        },
        "v1": {
            "code": "v1",
            "caption": "Вопрос 01. Пользуетесь ли Вы официальной статистической информацией, предоставляемой Службой?",
            "Reference": [
                {
                    "code": 1,
                    "value": "Да"
                },
                {
                    "code": 2,
                    "value": "Нет"
                }
            ]
        }
    }
}
```

#### Примечания ####

*Опросный лист* состоит из четырех полей:

* `code` строчный код *Обследования*,
* `caption` название *Обследования*,
* `Questionary` список вопросов в порядке их показа,
* `References` справочники вариантов ответов.

##### Обязательные поля вопросов #####

* Идентификатором вопроса служит строчное поле `code`;
* номер вопроса содержится в целочисленном поле `question_num`;
* текст вопроса содержится в строчном поле `value`.

##### Необязательные поля #####

* `question_tooltip` содержит текст для подсказки.

##### Параметры ответов #####

Булевы (логические) признаки вопроса обозначают, что разрешено:

* `multiple_values` — несколько ответов на вопрос;
* `other_allowed` — значение «Прочее».

##### Условие видимости #####

* Вопросы образуют дерево. Код *родительского вопроса* указыватся в поле `parent_code`.
* Целочисленное поле `condition` задает условие показа вопроса;
* в нем содержится номер ответа на родителький вопрос.
* Если оно задано, то вопрос задается только при указанном ответе на *родительский вопрос*.

##### Составные вопросы #####

* Несколько воспросов могут быть сгруппированы для одновременного заполнения.
* У таких вопросов указано одинаковое целочисленное значение `question_group`.
* Все вопросы в группе используют один и тот же набор возможных ответов.
* Общий заголовок составного вопроса содержится в справочнике `question_groups`;
* в нем следует выбрать запись ответа по значению поля `question_num`.

##### Варианты ответа #####

* Возможные варианты ответа определены в справочниках.
* Вопрос хранит строковый код справочника ответов в поле `question`.
* Варианты ответа перечислены в массиве `Reference` в порядке их показа.
* Значением ответа служит целое число в поле `code`.
* Текст варианта ответа содержится в поле `value`.

### POST /api/save ###

Сохраняет *Анкету* (ответы на вопросы *Обследования*).

#### Пример запроса ####

    curl  -kLs  -H 'Content-Type: application/json' -X POST --data-binary '{}' localhost:3000/api/save

## Ссылки ##

To learn React, check out the [React documentation](https://reactjs.org/).
