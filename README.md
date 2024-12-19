# Edge and 5G Proof-of-Concept (PoC)

This repository contains a comprehensive proof-of-concept project for integrating edge computing and 5G technologies. It demonstrates how applications can be dynamically placed and managed based on latency requirements and user proximity to 5G cell towers. The project includes multiple components, such as Kubernetes orchestration, WebSocket-based applications, dynamic deployment controllers, and tools for simulating 5G environments.

---

## **Repository Overview**

### **1. Components**

#### **AMF Simulator**
- Simulates an Access and Mobility Function (AMF) in a 5G network.
- Reports the cell tower closest to a user's current location.
- Provides a web-based interface for monitoring and controlling user movement across cell towers.

#### **Custom Controller**
- Dynamically updates Kubernetes deployment affinities based on the user’s current cell tower.
- Fetches data from the AMF Simulator and ensures that services are placed on nodes closest to the user’s location.

#### **Bouncing Ball Game Application**
- A WebSocket-based application where users interact with a game hosted on Kubernetes.
- The application measures and visualizes latency based on user interaction.

#### **Infrastructure Configuration**
- Terraform configuration for provisioning a Kubernetes cluster.
- Includes setup for node labeling to reflect cell tower locations.

---

## **Features**

### **Dynamic Application Placement**
- The system dynamically assigns services to Kubernetes nodes based on proximity to 5G cell towers, minimizing latency.
- A controller fetches the current cell tower from the AMF Simulator and adjusts node affinity for deployments.

### **WebSocket-Based Game**
- Real-time interaction with a bouncing ball game.
- Supports latency monitoring and dynamic payload adjustments to simulate varying network conditions.

### **AMF Simulation**
- A user interface allows users to drag a marker on a map to simulate movement between cell towers.
- Updates the backend about the user’s current location.

---

## **Setup and Usage**

### **Prerequisites**
- Docker and Kubernetes installed.
- Node.js environment (for development).
- Terraform for provisioning infrastructure.

### **1. Deploying the AMF Simulator**

#### Docker Deployment
```bash
cd amf_simulator
docker build -t dimitrisgian/amf-simulator .
docker run -it --rm -p 80:80 dimitrisgian/amf-simulator
```
Access the AMF Simulator at `http://localhost`.

#### Kubernetes Deployment
```bash
kubectl apply -f amf_simulator/deployment.yaml
```
Access the simulator via the NodePort or LoadBalancer defined in the Kubernetes service.

### **2. Running the Bouncing Ball Game**

#### Docker Deployment
```bash
cd example_app
docker build -t bouncing-ball-game .
docker run -it --rm -p 80:80 bouncing-ball-game
```
Access the game at `http://localhost:80`.

#### Kubernetes Deployment
```bash
kubectl apply -f example_app/deployment.yaml
```
Access the game via the NodePort or LoadBalancer defined in the Kubernetes service.

### **3. Terraform Infrastructure Setup**

1. Navigate to the `infrastructure` directory.
2. Configure the `terraform.tfvars` file with your environment-specific variables.
3. Initialize and apply the Terraform configuration:
   ```bash
   terraform init
   terraform apply
   ```

This sets up a Kubernetes cluster with nodes labeled to represent cell tower locations (e.g., `cell-tower=AWS` and `cell-tower=UoP-1`).

### **4. Running the Custom Controller**

The custom controller dynamically adjusts the deployment's node affinity based on the AMF Simulator’s data.

1. Install dependencies:
   ```bash
   npm install @kubernetes/client-node axios
   ```
2. Run the controller:
   ```bash
   node controller.js
   ```

The controller polls the AMF Simulator every 5 seconds and updates Kubernetes deployments.

---

## **How It Works**

### **1. AMF Simulator and Cell Tower Tracking**
- Users move a marker on a map to simulate their location.
- The AMF Simulator identifies the closest cell tower and updates its state.
- The information is exposed via a REST API at `/tower`.

### **2. Dynamic Node Affinity**
- The custom controller retrieves the user’s current cell tower.
- Maps the cell tower to Kubernetes node labels (e.g., `cell-tower=AWS`).
- Updates the `nodeAffinity` field in the target deployment to ensure the service runs on the closest node.

### **3. Game Interaction**
- The bouncing ball game uses WebSocket connections for real-time interaction.
- Latency is monitored, and users can adjust payload sizes to simulate varying network conditions.
- The game state is synchronized across all clients.

---

## **Key Files**

- **`amf_simulator/`:** AMF Simulator code and deployment configuration.
- **`example_app/`:** Bouncing Ball Game application.
- **`controller.js`:** Custom controller for dynamic deployment.
- **`infrastructure/`:** Terraform scripts for Kubernetes setup.

---

## **Future Enhancements**
- Integrate with real 5G network components.
- Add more complex scenarios with multiple users and cell towers.

---

## **License**
This project is licensed under the Apache 2.0 - see the `LICENSE` file for details.

