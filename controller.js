// Custom Controller to Update Deployment Based on User's Connected Cell Tower

const k8s = require('@kubernetes/client-node');
const axios = require('axios');

// Kubernetes configuration
const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(k8s.AppsV1Api);

// Deployment and namespace configuration
const deploymentName = 'latency-bandwidth-simulator';
const namespace = 'default';

// AMF Simulator endpoint
const amfSimulatorUrl = 'http://localhost:3000/tower'; // Replace with the actual AMF Simulator API endpoint

// Tower-to-node mapping based on labels
const towerLabelMapping = {
  'Frankfurt (AWS Cell)': 'AWS',
  'Patras (UoP Cell)': 'UoP-1',
};

let currentTower = null;

// Function to fetch the current tower from the AMF Simulator
async function fetchCurrentTower() {
  try {
    const response = await axios.get(amfSimulatorUrl);
    return response.data.tower; // Ensure the AMF Simulator sends data in the format { tower: 'Tower Name' }
  } catch (error) {
    console.error('Error fetching current tower from AMF Simulator:', error.message);
    return null;
  }
}

// Function to update the deployment's node affinity
async function updateNodeAffinity(towerLabel) {
  try {
    const deployment = await k8sApi.readNamespacedDeployment(deploymentName, namespace);
    const updatedDeployment = { ...deployment.body };

    // Set node affinity
    updatedDeployment.spec.template.spec.affinity = {
      nodeAffinity: {
        requiredDuringSchedulingIgnoredDuringExecution: {
          nodeSelectorTerms: [
            {
              matchExpressions: [
                {
                  key: 'cell-tower',
                  operator: 'In',
                  values: [towerLabel],
                },
              ],
            },
          ],
        },
      },
    };

    // Apply the updated deployment
    await k8sApi.replaceNamespacedDeployment(deploymentName, namespace, updatedDeployment);
    console.log(`Deployment updated to target nodes with cell-tower: ${towerLabel}`);
  } catch (error) {
    console.error('Error updating deployment node affinity:', error.message);
  }
}

// Main loop to monitor and update affinity based on tower changes
async function monitorAndUpdate() {
  setInterval(async () => {
    const newTower = await fetchCurrentTower();
    if (newTower && newTower !== currentTower) {
      currentTower = newTower;
      console.log(`User moved to a new tower: ${currentTower}`);

      const towerLabel = towerLabelMapping[currentTower];
      if (towerLabel) {
        await updateNodeAffinity(towerLabel);
      } else {
        console.warn(`No label mapping found for tower: ${currentTower}`);
      }
    }
  }, 5000); // Poll every 5 seconds
}

// Start the monitoring loop
monitorAndUpdate();
