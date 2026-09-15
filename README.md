# Калькулятор доходности вклада

Fullstack-приложение для расчёта итоговой суммы и дохода по банковскому вкладу с ежемесячной капитализацией процентов.

Проект состоит из независимых backend- и frontend-приложений. React-клиент проверяет введённые данные, отправляет их в REST API и отображает результат расчёта. Spring Boot повторно валидирует запрос и выполняет вычисления с помощью `BigDecimal`.

## Возможности

- расчёт сложного процента с ежемесячной капитализацией;
- валидация параметров на frontend и backend;
- форматирование денежных значений и разделение разрядов;
- обработка ошибок API;
- адаптивный интерфейс;
- модульные и интеграционные тесты backend.

## Технологии

### Backend

- Java 17;
- Spring Boot 4;
- Spring Web MVC;
- Jakarta Bean Validation;
- Gradle;
- JUnit 5.

### Frontend

- React 19;
- TypeScript;
- Vite;
- ESLint;
- CSS.

## Структура проекта

```text
deposit-calculator/
├── backend/     # REST API и расчёт доходности
├── frontend/    # пользовательский интерфейс
├── LICENSE
└── README.md
```

## Требования для запуска

- JDK 17 или новее;
- Node.js 20.19+ или 22.12+;
- npm.

Устанавливать Gradle отдельно не требуется: в проекте используется Gradle Wrapper.

## Локальный запуск

### 1. Backend

Из корня репозитория:

```powershell
cd backend
.\gradlew.bat bootRun
```

Для Linux или macOS:

```bash
cd backend
./gradlew bootRun
```

Backend будет доступен по адресу `http://localhost:8080`.

### 2. Frontend

В отдельном терминале из корня репозитория:

```powershell
cd frontend
npm install
npm run dev
```

Frontend будет доступен по адресу `http://localhost:5173`.

В режиме разработки запросы с `/api` перенаправляются Vite на `http://localhost:8080`, поэтому backend должен быть запущен одновременно с frontend.

## API

### Рассчитать доходность вклада

```http
POST /api/calculate
Content-Type: application/json
```

Пример запроса:

```json
{
  "amount": 100000,
  "months": 12,
  "rate": 8
}
```

Пример успешного ответа:

```json
{
  "total": 108299.95,
  "profit": 8299.95
}
```

Параметры запроса:

| Поле | Описание | Допустимое значение |
| --- | --- | --- |
| `amount` | начальная сумма вклада в рублях | от 1 000 до 10 000 000 |
| `months` | срок вклада в месяцах | целое число от 1 до 60 |
| `rate` | годовая процентная ставка | от 1 до 20 |

При нарушении ограничений API возвращает статус `400 Bad Request` и описание ошибок валидации.

## Формула расчёта

Итоговая сумма рассчитывается по формуле сложного процента:

```text
total = amount × (1 + rate / 100 / 12) ^ months
profit = total − amount
```

Результат округляется до двух знаков после запятой по правилу `HALF_UP`.

## Проверка проекта

Backend-тесты:

```powershell
cd backend
.\gradlew.bat test
```

Проверка frontend:

```powershell
cd frontend
npm run lint
npm run build
```

Production-сборка frontend создаётся в директории `frontend/dist`.
