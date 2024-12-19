resource "rke_cluster" "k8s_cluster" {
  kubernetes_version = "v1.29.9-rancher1-1"
  enable_cri_dockerd = true
  ignore_docker_version = true

  # Master node
  nodes {
    address = var.master_ip_address
    user    = var.master_ssh_username
    ssh_key = file(var.master_private_key_path)
    role    = ["controlplane", "etcd", "worker"]
    labels = {
      "cell-tower" = "UoP-1"
    }
  }

  # Worker node
  nodes {
    address = var.worker_ip_address
    user    = var.worker_ssh_username
    ssh_key = file(var.worker_private_key_path)
    role    = ["worker"]
    labels = {
      "cell-tower" = "AWS"
    }
  }

  ssh_agent_auth = false

  addons_include = []
  ingress {
    provider      = "none"
    http_port     = 80
    https_port    = 443
    network_mode  = "hostPort"
  }

  network {
    plugin = "canal"
  }

  upgrade_strategy {
    drain = true

    drain_input {
      ignore_daemon_sets = true
      delete_local_data = true
    }
  }
}

resource "local_file" "kubeconfig_file" {
  filename = "${path.module}/kubeconfig.yml"
  content  = rke_cluster.k8s_cluster.kube_config_yaml
}
