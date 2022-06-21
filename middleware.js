/*
Middleware are functions that have access to request and response objects.
Express has built in middleware but middleware also comes in 3rd party packages as well as custom middleware.

Benefits:
1. They can execute any code
2. Make changes to the request and response objects.
3. End response cycle
4. Call next middleware in the stack
*/