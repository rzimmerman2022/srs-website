# Admin API Documentation

This document provides comprehensive documentation for the Admin API routes that query Supabase to manage questionnaires and clients.

## Overview

All admin API routes follow these security and design patterns:

- **Rate Limiting**: 100 requests per hour per IP address
- **Error Sanitization**: Generic error messages returned to clients, detailed logs on server
- **Input Validation**: All inputs validated using Zod schemas
- **Supabase Integration**: Uses the anon key (not service role) for RLS compliance
- **Consistent Response Format**: JSON responses with proper HTTP status codes

## API Endpoints

### 1. Get All Questionnaires

**Endpoint**: `GET /api/admin/questionnaires`

**Description**: Retrieves a paginated list of all questionnaires with computed statistics.

**Query Parameters**:
- `status` (optional): Filter by status - `all`, `completed`, `in_progress`. Default: `all`
- `search` (optional): Search by client_id or questionnaire_id (case-insensitive)
- `limit` (optional): Number of results per page (1-100). Default: `50`
- `offset` (optional): Pagination offset. Default: `0`
- `sortBy` (optional): Sort field - `created_at`, `updated_at`, `client_id`. Default: `updated_at`
- `sortOrder` (optional): Sort direction - `asc`, `desc`. Default: `desc`

**Response**:
```json
{
  "questionnaires": [
    {
      "id": "uuid",
      "client_id": "client-123",
      "questionnaire_id": "discovery",
      "completed": false,
      "progress_percentage": 45,
      "total_questions": 20,
      "answered_questions": 9,
      "points": 450,
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-02T12:30:00Z",
      "last_activity": "2025-01-02T12:30:00Z"
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

**Example Usage**:
```bash
# Get all completed questionnaires
curl "http://localhost:3000/api/admin/questionnaires?status=completed"

# Search for specific client
curl "http://localhost:3000/api/admin/questionnaires?search=client-123"

# Paginate results
curl "http://localhost:3000/api/admin/questionnaires?limit=20&offset=40"
```

---

### 2. Get Single Questionnaire

**Endpoint**: `GET /api/admin/questionnaires/[id]`

**Description**: Retrieves detailed information about a specific questionnaire including all answers and response history.

**Path Parameters**:
- `id` (required): Questionnaire UUID

**Response**:
```json
{
  "questionnaire": {
    "id": "uuid",
    "client_id": "client-123",
    "questionnaire_id": "discovery",
    "answers": {
      "question-1": "answer text",
      "question-2": ["option1", "option2"]
    },
    "current_question_index": 10,
    "current_module_index": 2,
    "points": 500,
    "streak": 5,
    "combo": 3,
    "shown_milestones": [100, 200],
    "completed": false,
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-02T12:30:00Z",
    "metadata": {
      "total_questions": 20,
      "answered_questions": 10,
      "progress_percentage": 50,
      "completion_rate": 50,
      "last_activity": "2025-01-02T12:30:00Z"
    }
  },
  "history": [
    {
      "id": "uuid",
      "response_id": "uuid",
      "snapshot": {
        "answers": {},
        "currentQuestionIndex": 5,
        "timestamp": "2025-01-01T10:00:00Z"
      },
      "created_at": "2025-01-01T10:00:00Z"
    }
  ]
}
```

**Example Usage**:
```bash
curl "http://localhost:3000/api/admin/questionnaires/550e8400-e29b-41d4-a716-446655440000"
```

**Error Responses**:
- `400`: Invalid questionnaire ID format
- `404`: Questionnaire not found
- `500`: Server error

---

### 3. Get All Clients

**Endpoint**: `GET /api/admin/clients`

**Description**: Retrieves a list of all unique clients with aggregated questionnaire statistics.

**Query Parameters**:
- `search` (optional): Search by client_id (case-insensitive)
- `limit` (optional): Number of results per page (1-100). Default: `50`
- `offset` (optional): Pagination offset. Default: `0`
- `sortBy` (optional): Sort field - `client_id`, `last_activity`, `questionnaire_count`. Default: `last_activity`
- `sortOrder` (optional): Sort direction - `asc`, `desc`. Default: `desc`

**Response**:
```json
{
  "clients": [
    {
      "client_id": "client-123",
      "questionnaire_count": 3,
      "completed_count": 1,
      "in_progress_count": 2,
      "total_points": 1200,
      "first_activity": "2025-01-01T00:00:00Z",
      "last_activity": "2025-01-02T12:30:00Z"
    }
  ],
  "pagination": {
    "total": 50,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

**Example Usage**:
```bash
# Get all clients sorted by activity
curl "http://localhost:3000/api/admin/clients"

# Search for specific client
curl "http://localhost:3000/api/admin/clients?search=client-123"

# Sort by questionnaire count
curl "http://localhost:3000/api/admin/clients?sortBy=questionnaire_count&sortOrder=desc"
```

---

### 4. Get Single Client

**Endpoint**: `GET /api/admin/clients/[clientId]`

**Description**: Retrieves detailed information about a specific client including all their questionnaires and activity history.

**Path Parameters**:
- `clientId` (required): Client identifier (alphanumeric, hyphens, underscores only)

**Response**:
```json
{
  "client": {
    "client_id": "client-123",
    "questionnaires": [
      {
        "id": "uuid",
        "questionnaire_id": "discovery",
        "completed": false,
        "progress_percentage": 45,
        "answered_questions": 9,
        "points": 450,
        "created_at": "2025-01-01T00:00:00Z",
        "updated_at": "2025-01-02T12:30:00Z"
      }
    ],
    "activity_history": [
      {
        "id": "uuid",
        "questionnaire_id": "discovery",
        "event_type": "updated",
        "timestamp": "2025-01-02T12:30:00Z",
        "snapshot": {}
      },
      {
        "id": "uuid",
        "questionnaire_id": "discovery",
        "event_type": "created",
        "timestamp": "2025-01-01T00:00:00Z"
      }
    ],
    "summary": {
      "total_questionnaires": 3,
      "completed_questionnaires": 1,
      "in_progress_questionnaires": 2,
      "total_points": 1200,
      "total_answered_questions": 45,
      "first_activity": "2025-01-01T00:00:00Z",
      "last_activity": "2025-01-02T12:30:00Z"
    }
  }
}
```

**Example Usage**:
```bash
curl "http://localhost:3000/api/admin/clients/client-123"
```

**Error Responses**:
- `400`: Invalid client ID format
- `404`: Client not found
- `500`: Server error

---

### 5. Get Dashboard Statistics

**Endpoint**: `GET /api/admin/stats`

**Description**: Retrieves comprehensive dashboard statistics including overview metrics, trends, recent activity, and top performers.

**Query Parameters**: None

**Response**:
```json
{
  "stats": {
    "overview": {
      "total_questionnaires": 150,
      "total_clients": 45,
      "completed_questionnaires": 60,
      "in_progress_questionnaires": 90,
      "completion_rate": 40,
      "average_progress": 65
    },
    "recent_activity": [
      {
        "client_id": "client-123",
        "questionnaire_id": "discovery",
        "action": "Updated",
        "timestamp": "2025-01-02T12:30:00Z"
      }
    ],
    "trends": {
      "questionnaires_last_24h": 5,
      "questionnaires_last_7d": 25,
      "questionnaires_last_30d": 80,
      "completions_last_24h": 2,
      "completions_last_7d": 10,
      "completions_last_30d": 35
    },
    "top_performers": [
      {
        "client_id": "client-456",
        "total_points": 5000,
        "completed_count": 5
      }
    ]
  },
  "generated_at": "2025-01-02T13:00:00Z"
}
```

**Example Usage**:
```bash
curl "http://localhost:3000/api/admin/stats"
```

---

## Security Features

### Rate Limiting
- All endpoints enforce a rate limit of 100 requests per hour per IP address
- Rate limit headers are included in 429 responses
- Automatic cleanup of old rate limit records every 10 minutes

### Input Validation
- All query parameters validated using Zod schemas
- Path parameters validated for format and security
- Invalid inputs return 400 Bad Request with generic error messages

### Error Handling
- Detailed errors logged server-side for debugging
- Generic error messages returned to clients to prevent information leakage
- Consistent error response format across all endpoints

### Database Security
- Uses Supabase anon key (respects RLS policies)
- Never exposes service role key in API routes
- All queries use parameterized inputs to prevent SQL injection

---

## Common Response Codes

- `200 OK`: Request successful
- `400 Bad Request`: Invalid input parameters
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server-side error
- `503 Service Unavailable`: Supabase not configured

---

## Data Models

### Questionnaire Response
```typescript
{
  id: string;                    // UUID
  client_id: string;             // Client identifier
  questionnaire_id: string;      // Questionnaire type
  answers: Record<string, any>;  // JSONB answers object
  current_question_index: number;
  current_module_index: number;
  points: number;
  streak: number;
  combo: number;
  shown_milestones: number[];
  completed: boolean;
  created_at: string;            // ISO 8601 timestamp
  updated_at: string;            // ISO 8601 timestamp
}
```

### Response History
```typescript
{
  id: string;                    // UUID
  response_id: string;           // References questionnaire_responses.id
  snapshot: Record<string, any>; // JSONB snapshot of state
  created_at: string;            // ISO 8601 timestamp
}
```

---

## Implementation Notes

1. **Progress Calculation**: The `progress_percentage` is computed based on the number of answered questions vs. an estimated total. The estimated total is the maximum of `current_question_index + 1` and the actual number of answered questions.

2. **Activity History**: Combines events from the main `questionnaire_responses` table (created, completed) and the `response_history` table (updates).

3. **Client Aggregation**: Client statistics are computed in-memory by aggregating all questionnaires for each unique `client_id`.

4. **Caching**: Currently no caching is implemented. For production with high traffic, consider adding Redis or similar caching layer.

5. **Pagination**: All list endpoints support offset-based pagination. Consider implementing cursor-based pagination for better performance with large datasets.

---

## Testing Examples

### Using curl

```bash
# Get stats
curl http://localhost:3000/api/admin/stats

# Get all questionnaires
curl "http://localhost:3000/api/admin/questionnaires?limit=10"

# Get completed questionnaires
curl "http://localhost:3000/api/admin/questionnaires?status=completed"

# Search questionnaires
curl "http://localhost:3000/api/admin/questionnaires?search=client-123"

# Get specific questionnaire
curl http://localhost:3000/api/admin/questionnaires/{uuid}

# Get all clients
curl http://localhost:3000/api/admin/clients

# Get specific client
curl http://localhost:3000/api/admin/clients/client-123
```

### Using JavaScript/TypeScript

```typescript
// Get dashboard stats
const statsResponse = await fetch('/api/admin/stats');
const { stats } = await statsResponse.json();

// Get questionnaires with filters
const questionnaireResponse = await fetch(
  '/api/admin/questionnaires?status=in_progress&limit=20&offset=0'
);
const { questionnaires, pagination } = await questionnaireResponse.json();

// Get client details
const clientResponse = await fetch('/api/admin/clients/client-123');
const { client } = await clientResponse.json();
```

---

## Next Steps

To use these API routes in a frontend admin interface:

1. Create admin UI components that call these endpoints
2. Implement authentication/authorization before the admin routes
3. Add request caching for better performance
4. Consider adding WebSocket support for real-time updates
5. Implement export functionality (CSV, Excel) for reports
