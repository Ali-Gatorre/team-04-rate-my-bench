# Frontend and API Contract

## Overview

This document defines how the frontend interacts with the backend services.

The application architecture contains:

- **Frontend (Ali)**: UI pages, search/filter, API integration
- **API 1 – Bench Service (Nabeel)**: manages benches and ratings
- **API 2 – Discussion Service (Ali)**: manages comments and the discussion feed for each bench

The frontend consumes both APIs.

API 1 provides the **core bench data**, while API 2 provides the **community discussion linked to each bench**.

---

## Frontend Pages

### Home Page

Displays the list of benches.

**Uses:**
- `GET /benches`

**Features:**
- display bench cards
- search benches
- sort benches by latest
- sort benches by popularity

### Bench Detail Page

Displays detailed information about a bench and its discussion thread.

**Uses:**
- `GET /benches/:id`
- `GET /comments?bench_id=:id`

**Features:**
- bench information
- average rating
- comments list
- add comment form

### Add Bench Page

Page with a form allowing users to create a new bench.

**Uses:**
- `POST /benches`

**Fields:**
- title
- description
- image_url
- location_name
- latitude
- longitude
- author_name

### Map Page (Bonus)

Displays benches on a map using coordinates.

**Possible future use:**
- `GET /benches`

---

## API 1 – Bench Service (Owned by Nabeel)

This service manages **bench data and ratings**.

It is responsible for:
- creating benches
- retrieving benches
- retrieving a single bench
- managing ratings
- calculating average rating

### Bench Object Returned by API 1

```json
{
  "id": 1,
  "title": "Sunny Bench",
  "description": "Quiet place",
  "image_url": "https://example.com/bench.jpg",
  "location_name": "Canal Saint-Martin",
  "latitude": 48.872,
  "longitude": 2.363,
  "author_name": "Ali",
  "created_at": "2026-03-10T10:00:00Z",
  "average_rating": 4.7,
  "ratings_count": 3
}
```

### API 1 Endpoints

#### GET /benches

Returns the list of benches.

**Example response:**

```json
[
  {
    "id": 1,
    "title": "Sunny Bench",
    "description": "Quiet place",
    "image_url": "https://example.com/bench.jpg",
    "location_name": "Canal Saint-Martin",
    "latitude": 48.872,
    "longitude": 2.363,
    "author_name": "Ali",
    "created_at": "2026-03-10T10:00:00Z",
    "average_rating": 4.7,
    "ratings_count": 3
  }
]
```

#### GET /benches/:id

Returns detailed information about a specific bench.

**Example response:**

```json
{
  "id": 1,
  "title": "Sunny Bench",
  "description": "Quiet place",
  "image_url": "https://example.com/bench.jpg",
  "location_name": "Canal Saint-Martin",
  "latitude": 48.872,
  "longitude": 2.363,
  "author_name": "Ali",
  "created_at": "2026-03-10T10:00:00Z",
  "average_rating": 4.7,
  "ratings_count": 3
}
```

#### POST /benches

Creates a new bench.

**Example request:**

```json
{
  "title": "Sunny Bench",
  "description": "Perfect place to relax",
  "image_url": "https://example.com/bench.jpg",
  "location_name": "Canal Saint-Martin",
  "latitude": 48.872,
  "longitude": 2.363,
  "author_name": "Ali"
}
```

#### POST /ratings

Adds a rating to a bench.

**Example request:**

```json
{
  "bench_id": 1,
  "author_name": "Ali",
  "score": 5
}
```

---

## API 2 – Discussion Service (Owned by Ali)

This service manages **comments and the discussion feed associated with each bench**.

While API 1 manages the **bench itself**, API 2 manages the **community interaction around that bench**.

Each comment is linked to a bench through the field `bench_id`.

It is responsible for:
- retrieving comments related to a bench
- creating new comments
- managing the discussion feed

This service lets users share opinions, experiences, and feedback about specific benches.

### Comment Object Returned by API 2

```json
{
  "id": 1,
  "bench_id": 1,
  "author_name": "Ali",
  "content": "Amazing bench.",
  "created_at": "2026-03-10T10:30:00Z"
}
```

### API 2 Endpoints

#### GET /comments?bench_id=:id

Returns all comments related to a specific bench.

**Example response:**

```json
[
  {
    "id": 1,
    "bench_id": 1,
    "author_name": "Ali",
    "content": "Amazing bench.",
    "created_at": "2026-03-10T10:30:00Z"
  },
  {
    "id": 2,
    "bench_id": 1,
    "author_name": "Nabeel",
    "content": "Great place to read.",
    "created_at": "2026-03-10T11:00:00Z"
  }
]
```

#### POST /comments

Creates a new comment associated with a bench.

**Example request:**

```json
{
  "bench_id": 1,
  "author_name": "Ali",
  "content": "Amazing bench."
}
```

**Example response:**

```json
{
  "id": 3,
  "bench_id": 1,
  "author_name": "Ali",
  "content": "Amazing bench.",
  "created_at": "2026-03-10T12:00:00Z"
}
```

---

## Integration Flow

When a user opens the **Bench Detail Page**, the frontend performs the following steps:

1. Request bench data from API 1 with `GET /benches/:id`
2. Request comments from API 2 with `GET /comments?bench_id=:id`
3. Combine both responses to render the page

Bench information comes from **API 1**.
Discussion comments come from **API 2**.
