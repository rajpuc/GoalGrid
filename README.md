# GoalGrid
GoalGrid is a roadmap app that allows users to create an account and interact with existing roadmap items through upvoting, commenting, and replying — enabling collaboration, feedback, and idea sharing.


---

## Feature Design

### 1. Infinite Scroll


To enhance user experience, I implemented infinite scroll instead of traditional pagination. This allows users to continuously browse roadmap items without manual page changes, reducing load times and showing the latest items first. It improves performance and keeps users engaged.


### 2. Detailed Roadmap View via Modal

When a user clicks on a roadmap item, a modal opens showing its full details along with all associated comments. This keeps users on the same page and avoids unnecessary navigation, ensuring a smooth experience.

### 3. Nested Commenting (Up to Depth 3)

To maintain readability and structure, comments support nesting up to 3 levels deep. This encourages discussions while preventing visual clutter and infinite threading.

### 4. Mention Reply Targets

Replies clearly show who the response is directed to using the format: @Full Name. However, if the user replies to their own comment, no mention is shown, making the UI cleaner and smarter.

### 5. Edit and Delete Own Comments

Users have full control over their comments. They can edit or delete only their own comments, not others'. This ensures both flexibility and data integrity.

### 6. Advanced Filtering with Infinite Scroll

Users can filter roadmap items based on:

* **Search keyword**
* **Status**: Todo, In Progress, Completed
* **Category**
* **Sort by**: Most Upvoted, Most Recent, Oldest
  Filtered results still support infinite scroll, offering both flexibility and performance.

### 7. Real-Time Upvoting System

Upvotes are instantly reflected in the UI for a responsive feel. The change is optimistically updated in the state before sending the request to the backend. If the request fails, the state reverts. This creates a fast, reliable toggle experience for users.

### 8. Dynamic Comment Count Display

Each roadmap item displays a real-time comment count.

---

## Architecture Decisions

### 1. **Frontend: React**

 I chose React.js as the frontend library due to its component-based architecture and strong ecosystem. It allows building reusable and modular UI components, which is ideal for scaling a dynamic applications.

### 2. **State Management: Zustand**

I selected Zustand for state management because it’s lightweight, has a minimal learning curve, and doesn’t require boilerplate like Redux. It provides a global state that is easy to update and subscribe to, which is helpful for managing UI state.

### 3. **Backend: Express.js**

I chose Express.js as the backend framework because it is fast, unopinionated, and lightweight — which allowed me to implement the MVC (Model-View-Controller) pattern easily and keep the codebase organized.

### 4. **Database: MongoDB**

I used MongoDB due to its document-based model.

---

## Code Style & Conventions

###  Naming Conventions

* **CamelCase** for variables and functions (e.g., `handleFilterToggle`, `fetchFilteredRoadmapItems`)
* **PascalCase** for React components and file names (e.g., `RoadmapItem.jsx`, `FilterModal.jsx`)

### MVC Pattern (Backend)

The backend is organized using the **Model-View-Controller** pattern:

* `models/` – MongoDB schemas for `User`, `RoadmapItem`, `Comment`.
* `controllers/` – Handles business logic, validation, and database interactions.
* `routes/` – Defines all API endpoints and their respective controllers.
* `middleware/` – Includes authentication, form validation logic.

### Asynchronous Code Handling

All asynchronous operations (API calls, database queries, etc.) use `async/await` and are wrapped in `try/catch` blocks. This ensures:



---

##  GitHub Repository

🔗 [https://github.com/rajpuc/GoalGrid](https://github.com/rajpuc/GoalGrid)


---
## Project Installation
```.env
//.env file configuration:
PORT=
MONGODB_CONNECTION = 
JWT_SECRET_KEY = 

CLOUDINARY_CLOUD_NAME = 
CLOUDINARY_API_KEY = 
CLOUDINARY_API_SECRET = 
```