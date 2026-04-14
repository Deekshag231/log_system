# Log Monitor

Spring Boot pipeline: **REST ingest → Apache Kafka → consumer → Elasticsearch + sliding-window ERROR alerts → Kibana**.

## Prerequisites

- JDK 17+
- Maven 3.9+ (or build only via Docker using the provided `Dockerfile`)
- Docker & Docker Compose (for full stack)

## Run with Docker Compose

```bash
docker compose up --build
```

Wait until Elasticsearch and Kafka are healthy, then:

- API: `http://localhost:8080`
- Kibana: `http://localhost:5601`
- Elasticsearch: `http://localhost:9200`

## Authentication (JWT)

Protected APIs now require a Bearer token.

Default credentials (override with env vars `APP_AUTH_USERNAME`, `APP_AUTH_PASSWORD`):

- username: `admin`
- password: `admin123`

Login and copy token:

```bash
curl -s -X POST http://localhost:8080/api/v1/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

Use token (replace `<TOKEN>`):

```bash
curl -H "Authorization: Bearer <TOKEN>" "http://localhost:8080/api/v1/logs/recent?limit=20"
```

### Kibana (quick)

1. Open Kibana → **Management** → **Stack Management** → **Data Views** → **Create data view**.
2. Name: `logs`, Index pattern: `logs`.
3. Time field: `timestamp`.
4. Under **Analytics** → **Discover** / **Dashboard**, build visualizations:
   - Error logs over time: date histogram on `timestamp`, filter `level: ERROR`.
   - Logs by service: terms aggregation on `service`.
   - Log level distribution: pie on `level`.

## Run locally (without Docker)

Start Zookeeper, Kafka, and Elasticsearch yourself, then:

```bash
mvn spring-boot:run
```

Defaults: Kafka `localhost:9092`, Elasticsearch `http://localhost:9200`.

## API examples

**Ingest (ERROR → Kafka + ES + alert pipeline, requires JWT):**

```bash
curl -s -X POST http://localhost:8080/api/v1/logs ^
  -H "Authorization: Bearer <TOKEN>" ^
  -H "Content-Type: application/json" ^
  -d "{\"timestamp\":\"2026-04-12T10:01:23\",\"level\":\"ERROR\",\"service\":\"payment-service\",\"message\":\"Payment failed\"}"
```

**Search (Elasticsearch-backed, requires JWT):**

```bash
curl -H "Authorization: Bearer <TOKEN>" "http://localhost:8080/api/v1/logs/search/level?level=ERROR&size=10"
curl -H "Authorization: Bearer <TOKEN>" "http://localhost:8080/api/v1/logs/search/service?name=payment-service&size=10"
curl -H "Authorization: Bearer <TOKEN>" "http://localhost:8080/api/v1/logs/search/message?q=failed&size=10"
curl -H "Authorization: Bearer <TOKEN>" "http://localhost:8080/api/v1/logs/search/range?from=2026-04-12T00:00:00Z&to=2026-04-13T00:00:00Z&size=50"
```

**Recent in-memory buffer (all accepted levels, requires JWT):**

```bash
curl -H "Authorization: Bearer <TOKEN>" "http://localhost:8080/api/v1/logs/recent?limit=20"
```

**Active alerts (requires JWT):**

```bash
curl -H "Authorization: Bearer <TOKEN>" http://localhost:8080/api/v1/alerts/active
```

## Configuration

| Property | Description |
|----------|-------------|
| `logmonitor.kafka.topic.logs` | Kafka topic name (default `logs.raw`) |
| `logmonitor.alert.error-threshold-per-minute` | ERROR count in window to trigger alert (default `100`) |
| `logmonitor.alert.sliding-window-seconds` | Window length (default `60`) |
| `KAFKA_BOOTSTRAP_SERVERS` | Kafka brokers |
| `ELASTICSEARCH_URIS` | Elasticsearch HTTP URL |

## Tests

```bash
mvn test
```

## Sample Elasticsearch queries (Dev Tools)

```json
GET logs/_search
{
  "query": { "term": { "level": "ERROR" } },
  "sort": [{ "timestamp": "desc" }],
  "size": 20
}
```

```json
GET logs/_search
{
  "query": {
    "bool": {
      "must": [
        { "match": { "message": "Payment" } },
        { "term": { "service": "payment-service" } }
      ]
    }
  }
}
```
