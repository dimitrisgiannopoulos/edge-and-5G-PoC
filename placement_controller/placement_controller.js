// Custom Controller to Update Deployments Based on User's Connected Cell Tower

const k8s = require('@kubernetes/client-node');
const axios = require('axios');

// Kubernetes configuration
const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(k8s.AppsV1Api);

// Environment variable configuration
const targetLabelKey = process.env.TARGET_LABEL_KEY || 'follow-user'; // Label key for monitoring deployments
const targetLabelValue = process.env.TARGET_LABEL_VALUE || 'true'; // Label value for monitoring deployments

// AMF Simulator configuration
const amfSimulatordeploymentName = process.env.AMF_SIMULATOR_DEPLOYMENT_NAME || 'amf-simulator';
const amfSimulatorNamespace = process.env.AMF_SIMULATOR_NAMESPACE || 'default';
const amfSimulatorUrl =
  process.env.AMF_SIMULATOR_URL ||
  `http://${amfSimulatordeploymentName}.${amfSimulatorNamespace}.svc.cluster.local/tower`; // Default URL
const towerLabelMapping = JSON.parse(process.env.TOWER_LABEL_MAPPING || '{}'); // JSON string as input e.g. '{"Frankfurt (AWS Cell)": "AWS", "Patras (UoP Cell)": "UoP-1"}'

let currentTower = null;

// Function to fetch the current tower from the AMF Simulator
async function fetchCurrentTower() {
  console.log(`Fetching tower data from URL: ${amfSimulatorUrl}`);
  try {
    const response = await axios.get(amfSimulatorUrl);
    return response.data.tower; // Ensure the AMF Simulator sends data in the format { tower: 'Tower Name' }
  } catch (error) {
    console.error('Error fetching current tower from AMF Simulator:', error.message);
    return null;
  }
}


// Function to get deployments with the target label
async function getDeployments() {
  try {
    const response = await k8sApi.listDeploymentForAllNamespaces(
      undefined,            // pretty
      undefined,            // _continue (no continue token)
      undefined,            // fieldSelector
      `${targetLabelKey}=${targetLabelValue}` // labelSelector
    );    
    return response.body.items;
  } catch (error) {
    console.error(`Error fetching deployments:`, error.message);
    if (error.response) {
      console.error('Status Code:', error.response.statusCode);
      console.error('Response Body:', error.response.body);
    }
    return [];
  }
}

// Function to update the deployment's node affinity
async function updateNodeAffinity(deployment, towerLabel) {
  try {
    const namespace = deployment.metadata.namespace; // Dynamically fetch the namespace
    const updatedDeployment = { ...deployment };

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
    await k8sApi.replaceNamespacedDeployment(deployment.metadata.name, namespace, updatedDeployment);
    console.log(`Deployment ${deployment.metadata.name} in namespace ${namespace} updated to target nodes with cell-tower: ${towerLabel}`);
  } catch (error) {
    console.error(`Error updating deployment ${deployment.metadata.name} in namespace ${deployment.metadata.namespace}:`, error.message);
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
        const deployments = await getDeployments();
        for (const deployment of deployments) {
          await updateNodeAffinity(deployment, towerLabel);
        }
      } else {
        console.warn(`No label mapping found for tower: ${currentTower}`);
      }
    }
  }, 5000); // Poll every 5 seconds
}

// Start the monitoring loop
monitorAndUpdate();
