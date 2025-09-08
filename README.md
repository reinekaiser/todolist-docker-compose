# Todolist Docker Compose

## Project Description

This is a simple **Todolist application** built with a **Node.js backend**, a **React frontend**, and **MongoDB** as the database. The project is fully containerized using **Docker** and orchestrated with **Docker Compose** for easy setup and deployment.

## Features

- Create, read, update, and delete tasks.
- Filter tasks by status (completed / not completed / all).
- Responsive frontend interface built with **React** and **Tailwind CSS**.
- RESTful API backend built with **Node.js** and **Express**.
- Persistent data storage using **MongoDB Atlas**.

## Docker Setup

The project uses **Docker Compose** to run multiple services simultaneously:

1. **Backend**: Runs the Node.js API on port `3000`.
2. **Frontend**: Runs the React app on port `5173`.
3. **MongoDB**: Stores all tasks data.

The `docker-compose.yml` file defines the services, their build context, ports, and network configuration, making it easy to launch the entire application with a single command:

```bash
docker compose up -d