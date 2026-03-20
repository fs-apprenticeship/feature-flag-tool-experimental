# Feature Flag API Contract

#### A REST API for a feature flagging platform.

## Admin Endpoints

These endpoints are for admin to  view, create, and modify flags as needed. This is separate from the SDK endpoints which are for applications to query flag states by environment.  

### List Flags

Returns all flags by project created by an authenticated user.

```
GET /api/admin/projects/:projectId
```

Sample Response: 
```
[{   
    "id": 123,
    "name": "lesson-demo",
    "description": "This flag toggles the Lessons card on home page",
    "environments": {
        "dev": true,
        "prod": false
    }
}
, {
    "id": 124,
    "name": "lesson-plan-demo",
    "description": "This flag toggles the Lesson Plan card on home page",
    "environments": {
        "dev": true,
        "prod": true
        }
    }
]
```

### Create a flag

Creates a new feature flag for the authenticated user

```
POST /api/admin/projects/:projectId/flags
```

Sample Request Body: 
```
{
    "name": "lesson-demo",
    "description": "This flag toggles the Lessons card on home page",
    "environments": {
        "dev": true,
        "prod": false
    }
}
```

Sample Response: 201 CREATED 
```
{   
    "id": 123,
    "name": "lesson-demo",
    "description": "This flag toggles the Lessons card on home page",
    "environments": {
        "dev": true,
        "prod": false
    }
}
```

### Updating a Flag

Update a flag's name, description, and environment states.   
Note: This would be called with a save changes button and would reduce the number of calls needed when toggling on and off different environments. The same form to create a flag can also be reused since all the inputs will be the same. 

```
PATCH /api/admin/flags/:flagId
```

Sample Request Body: 
```
{   
    "name": "lesson-demo",
    "description": "This flag toggles the Lessons card on home page",
    "environments": {
        "dev": true,
        "prod": false
    }
}
```

### Deleting a flag 

Delete a flag 

```
DELETE /api/admin/flags/:id
```
Response: 204 No Content


## SDK Endpoints

These endpoints are for applications to call to retrieve flag state and evaluate whether a feature is enabled. 

### Fetching flag values for a given environment  

Returns all flag states given a SDK key that will be passed sent in the headers. 

```
GET /api/sdk/flags
```

Sample Response: 
```
{   
    "flags": {
        "lesson-demo": true,
        "lesson-plan-demo": false
    }
}
```