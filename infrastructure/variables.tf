variable "master_ssh_username" {
  description = "SSH username for master node"
  type        = string
}

variable "worker_ssh_username" {
  description = "SSH username for worker node"
  type        = string
}

variable "master_private_key_path" {
  description = "Path to the private key for master node"
  type        = string
}

variable "worker_private_key_path" {
  description = "Path to the private key for worker node"
  type        = string
}

variable "master_ip_address" {
  description = "IP address for master node"
  type        = string
}

variable "worker_ip_address" {
  description = "IP address for worker node"
  type        = string
}
