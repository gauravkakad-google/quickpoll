# QuickPoll Application

This is a full-stack polling application with a React frontend and a Python backend.

## Prerequisites

*   Python 3.9+ and pip
*   Node.js and npm (for the frontend)
*   A Google Cloud project with a Cloud SQL for PostgreSQL instance.
*   Git

## Setup

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd quickpoll
    ```

2.  **Set up the database:**

    *   Connect to your Cloud SQL for PostgreSQL instance and execute the `backend/database.sql` script to create the necessary tables.

3.  **Set up environment variables for the backend:**

    The backend requires the following environment variables to connect to your Cloud SQL instance. You can set them in your environment or create a `.env` file in the `backend` directory.

    ```
    CLOUD_SQL_POSTGRES_USER=<your-database-user>
    CLOUD_SQL_POSTGRES_PASSWORD=<your-database-password>
    CLOUD_SQL_POSTGRES_DATABASE=<your-database-name>
    CLOUD_SQL_POSTGRES_INSTANCE=<your-instance-connection-name>
    ```

4.  **Install dependencies:**

    *   **Backend:**

        ```bash
        cd backend
        pip install -r requirements.txt
        cd ..
        ```

    *   **Frontend:**

        ```bash
        cd frontend
        npm install
        cd ..
        ```

## Running the Application

1.  **Start the backend server:**

    ```bash
    cd backend
    uvicorn main:app --host 0.0.0.0 --port 3001
    ```

    The backend server will start on port 3001.

2.  **Start the frontend development server:**

    Open a new terminal window and run:

    ```bash
    cd frontend
    npm run dev
    ```

    The frontend development server will start on a different port (usually 5173). You can access the application in your browser at the address provided by the Vite development server.

## Deployment

The application is configured for deployment to Google Cloud Run.

### Prerequisites

*   [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed and configured.
*   You are logged in to your Google Cloud account (`gcloud auth login`).
*   Your Google Cloud project is configured (`gcloud config set project <your-gcp-project-id>`).
*   Enable the Cloud Run, Cloud Build, and Artifact Registry APIs:
    ```bash
    gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
    ```
*   Create an Artifact Registry repository:
    ```bash
    gcloud artifacts repositories create quickpoll-repo --repository-format=docker --location=<your-gcp-region>
    ```

### Deploying the Backend

1.  **Build and push the backend image:**
    ```bash
    gcloud builds submit --tag <your-gcp-region>-docker.pkg.dev/<your-gcp-project-id>/quickpoll-repo/quickpoll-backend ./backend
    ```

2.  **Deploy the backend to Cloud Run:**
    ```bash
    gcloud run deploy quickpoll-backend \
      --image <your-gcp-region>-docker.pkg.dev/<your-gcp-project-id>/quickpoll-repo/quickpoll-backend \
      --platform managed \
      --region <your-gcp-region> \
      --allow-unauthenticated \
      --add-cloudsql-instances "<your-instance-connection-name>" \
      --set-env-vars "CLOUD_SQL_POSTGRES_USER=<your-db-user>" \
      --set-env-vars "CLOUD_SQL_POSTGRES_PASSWORD=<your-db-password>" \
      --set-env-vars "CLOUD_SQL_POSTGRES_DATABASE=<your-db-name>" \
      --set-env-vars "CLOUD_SQL_POSTGRES_INSTANCE=<your-instance-connection-name>"
    ```
3.  After the deployment is complete, copy the backend service URL. You will need it for the frontend deployment.

### Deploying the Frontend

1.  **Build and push the frontend image:**
    ```bash
    gcloud builds submit --tag <your-gcp-region>-docker.pkg.dev/<your-gcp-project-id>/quickpoll-repo/quickpoll-frontend ./frontend
    ```

2.  **Deploy the frontend to Cloud Run:**
    Make sure to replace `<your-backend-url>` with the URL of your deployed backend service.
    ```bash
    gcloud run deploy quickpoll-frontend \
      --image <your-gcp-region>-docker.pkg.dev/<your-gcp-project-id>/quickpoll-repo/quickpoll-frontend \
      --platform managed \
      --region <your-gcp-region> \
      --allow-unauthenticated \
      --set-env-vars "BACKEND_URL=<your-backend-url>"
    ```
3.  Once the deployment is complete, you can access the frontend at the URL provided by the command.
