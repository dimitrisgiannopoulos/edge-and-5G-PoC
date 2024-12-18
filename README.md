# Kubernetes Cluster with Terraform and RKE

This project provisions a Kubernetes cluster using Terraform and RKE (Rancher Kubernetes Engine). The setup includes:

- One master node
- One worker node

## Prerequisites

- Terraform installed ([Download Terraform](https://www.terraform.io/downloads.html))
- SSH access to the master and worker nodes

## Project Structure

- **main.tf**: Defines the RKE cluster configuration.
- **variables.tf**: Input variables for customizing the cluster.
- **terraform.tfvars**: Example values for input variables.

## Inputs

Add the following variables to `terraform.tfvars`:

```hcl
master_ssh_username       = "master_user"
worker_ssh_username       = "worker_user"
master_private_key_path   = "/path/to/master/private/key"
worker_private_key_path   = "/path/to/worker/private/key"
master_ip_address         = "<master-ip>"
worker_ip_address         = "<worker-ip>"
```

## Usage

1. Initialize the Terraform project:
   ```bash
   terraform init
   ```

2. Preview the infrastructure changes:
   ```bash
   terraform plan -var-file="terraform.tfvars"
   ```

3. Apply the configuration:
   ```bash
   terraform apply -var-file="terraform.tfvars"
   ```

4. Access the Kubernetes configuration:
   ```bash
   kubectl --kubeconfig=kubeconfig.yml get nodes
   ```

## Cleanup

To destroy the provisioned resources:
```bash
terraform destroy -var-file="terraform.tfvars"
```
