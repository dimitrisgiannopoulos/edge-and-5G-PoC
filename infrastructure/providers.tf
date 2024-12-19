terraform {
  required_providers {
    rke = {
      source  = "rancher/rke"
      version = ">=1.6.0"
    }
  }
}

provider "rke" {}
