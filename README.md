<p align="center"> 
  <img src="image/logo.png" alt="TaskFlow Logo" width="100px" height="100px">
</p>
<h1 align="center"> TaskFlow: Distributed Processing Engine </h1>
<h3 align="center"> Scalable Notification & Asynchronous Task Queue </h3>

<p align="center"> 
<img src="gif/dashboard-demo.gif" alt="Animated gif of TaskFlow dashboard" height="382px">
</p>

<p>I have developed an enterprise-grade distributed processing system that decouples resource-intensive tasks from synchronous REST APIs. It offloads heavy workloads to background worker nodes via a message broker, ensuring high availability, fault tolerance, and horizontal scalability.</p>

<h2> :floppy_disk: Architecture & Components </h2>

<p>This project is orchestrated via Docker and divided into decoupled microservices:</p>
<h4>Backend Services:</h4>
<ul>
  <li><b>FastAPI (API Gateway)</b> - Handles incoming HTTP requests, validates payloads, enforces Redis-backed rate limiting, and writes initial state to PostgreSQL.</li>
  <li><b>Celery (Worker Nodes)</b> - Asynchronous background processors that pull tasks from the message queue, execute them (e.g., Discord webhook dispatching), and update the database state.</li>
</ul>

<h4>Infrastructure:</h4>
<ul>
  <li><b>Redis (Message Broker)</b> - Acts as the high-speed, in-memory conveyor belt passing task IDs from the API to the workers.</li>
  <li><b>PostgreSQL (Datastore)</b> - ACID-compliant relational database for persisting task metadata, timestamps, and execution status.</li>
</ul>

<h4>Frontend Directory:</h4>
<ul>
  <li><b>React & Vite</b> - A high-performance, Single Page Application (SPA) dashboard utilizing Tailwind CSS for glassmorphism styling and Recharts for real-time telemetry visualization.</li>
</ul>

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

<h2> :book: Distributed Event-Driven Architecture</h2>

<p>In traditional monolithic architectures, executing resource-intensive tasks within the lifecycle of a synchronous HTTP request leads to connection timeouts and poor user experience. Abstractly, this system solves the problem by acting as an asynchronous backbone.</p>

<p>When a client submits a payload, the system instantly acknowledges the request (HTTP 202 Accepted) and assigns probabilities of execution by dropping a serialized message onto the Redis queue:</p>
<p align="center"><img src="image/queue_diagram.png" alt="Queue Architecture" style="max-width:100%;"></p>

<p>The Celery workers continuously monitor this broker. Once a task is acquired, an atomic lock prevents other workers from duplicating the effort. The worker processes the external webhook and mutates the final state in the database, allowing the React frontend to actively poll and update the UI in real-time.</p>

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

<h2> :clipboard: Execution Instruction</h2>
<p>The entire cluster is containerized and can be spun up using Docker Compose.</p>
<p><b>1) Environment Configuration</b></p>
<p>Create a <code>.env</code> file in the root directory and define your external integrations:</p>
<pre><code>DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."</code></pre>

<p><b>2) Build & Run Cluster</b></p>
<p>Execute the following command to download the Postgres/Redis images, build the Python containers, and map the ports:</p>
<pre><code>docker-compose up --build -d</code></pre>

<p><b>3) Access Telemetry Dashboard</b></p>
<p>Once the containers are successfully running, the React application will proxy requests to the backend. Access the UI at:</p>
<pre><code>http://localhost:5173</code></pre>

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

<h2> :books: Core Technologies</h2>
<ul>
  <li><p>FastAPI Framework. [Online].</p>
      <p>Available: https://fastapi.tiangolo.com/</p>
  </li>
  <li><p>Celery: Distributed Task Queue. [Online].</p>
      <p>Available: https://docs.celeryq.dev/en/stable/</p>
  </li>
  <li><p>Redis In-Memory Datastore. [Online].</p>
      <p>Available: https://redis.io/</p>
  </li>
  <li><p>React & Vite Tooling. [Online].</p>
      <p>Available: https://vitejs.dev/</p>
  </li>
</ul>

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)
