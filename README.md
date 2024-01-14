Tasks
In the src/dishes/dishes.controller.js file, add handlers and middleware functions to create, read, update, and list dishes. Note that dishes cannot be deleted.

In the src/dishes/dishes.router.js file, add two routes: /dishes and /dishes/:dishId. Attach the handlers (create, read, update, and list) exported from src/dishes/dishes.controller.js.

In the src/orders/orders.controller.js file, add handlers and middleware functions to create, read, update, delete, and list orders.

In the src/orders/orders.router.js file, add two routes: /orders and /orders/:orderId. Attach the handlers (create, read, update, delete, and list) exported from src/orders/orders.controller.js.

Any time you need to assign a new id to an order or dish, use the nextId function exported from src/utils/nextId.js.

Steps to complete
To complete this project, you must complete the following steps:

Write code that passes all the tests in the Qualified assessment in this lesson.

Write code that passes all of the requirements outlined below, and submit your GitHub repo link in the next lesson.

Requirements to pass
For your project to pass, all of the following statements must be true. These criteria are reflected in the rubric in the following lesson.

All tests are passing in Qualified.

All middleware and handler functions have a single responsibility and are named functions.

All data passed between middleware and handler functions uses response.locals.

All chained method calls on a route(...) end with all(methodNotAllowed).

All update handlers guarantee that the id property of the stored data cannot be overwritten.
