---
date: '2025-08-28'
title: 'Using CDKTF to Provision Talos Linux'
author: 'Jacob McNeilly'
draft: false
tags: [cdktf, terraform, python, talos linux, kubernetes]
featuredImage: '/images/blog/cdktf_py_banner.png'
code:
    copy: true
---
## Purpose

Learn how to use CDKTF to configure a homelab Kubernetes cluster on bare metal with Talos Linux. Along the way, you'll discover how bare-metal Kubernetes is provisioned, how CDKTF maintains state, and why you may or may not regret choosing CDKTF over vanilla Terraform. Spoiler: CDKTF is verbose. Like, really verbose. But hey---you're here for the challenge.

>Disclaimer: This is my first real dive into CDKTF. My background is mostly Terraform proper, so consider this equal parts tutorial and cautionary tale. Copy/paste at your own risk.

## What to Expect

This post documents my experience setting up a Talos Linux cluster with CDKTF. Expect some trial and error, random side notes, and hints at future projects (GitLab runners, State Backend Management, etc.). The guide will be both informative and campy---so buckle up.

---
## 1. Procuring / Planning

First things first: hardware. For this guide I used four [Lenovo Thinkcentre m715q](https://www.lenovo.com/us/en/p/desktops/thinkcentre/m-series-tiny/thinkcentre-m715q-tiny/11tc1mt715q) (thanks, eBay) tied together with a [TP-Link 8 Port Gigabit Ethernet Network Switch](https://www.amazon.com/dp/B00A121WN6?ref=ppx_yo2ov_dt_b_fed_asin_title) and some [POWERLINE](https://www.tp-link.com/us/powerline/) adapters! Yes, powerline. Yes, it works. Yes, you're allowed to judge me.

Here's a list of everything I used:

| **Item**                                       | **Quantity**              | **Image**                            | **Link**                                                                                             |
| ---------------------------------------------- | ------------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| Lenovo Thinkcentre m715q                       | 4                         | ![lenovos.png](/images/blog/lenovos.png) | https://www.lenovo.com/us/en/p/desktops/thinkcentre/m-series-tiny/thinkcentre-m715q-tiny/11tc1mt715q |
| TP-Link 8 Port Gigabit Ethernet Network Switch | 1                         | ![switch](/images/blog/switch.png) | https://www.amazon.com/dp/B00A121WN6?ref=ppx_yo2ov_dt_b_fed_asin_title                               |
| Ethernet Cables                                | 6 (extra one for my NAS!) | ![ethernet](/images/blog/ethernet.png) | Anywhere                                                                                             |
| Powerline Adapters                             | 1 receiver & 1 sender     | ![powerline](/images/blog/powerline.png) | https://a.co/d/68itm5H                                                                               |
| USB Stick 32GB                                 | 1                         | ![usb_stick](/images/blog/thumb_drive.png) | Anywhere                                                                                             |
| Logitech K400 Plus Wireless                    | 1                         | ![wireless_kb](/images/blog/wireless_kb.png) | https://a.co/d/4qnOiU7                                                                               |

#### Lenovo Thinkcentre m715q Specs

| Hardware | Spec                   |
| -------- | ---------------------- |
| CPU      | AMD Ryzen 5 PRO 2400GE |
| Memory   | 16GB DDR4              |
| Storage  | 500GB SSD              |
| Network  | 1GBe                   |

#### Network Diagram

![Network Diagram Cluster](/images/blog/Network%20Diagram%20Cluster.png)

#### Cluster Diagram

![Cluster Diagram](/images/blog/Cluster%20Diagram.png)

---
## 2.  Prepping For Image

Now that all your components are together you will need to create a bootable image for talos. Following talos linux's [Getting Started guide](www.talos.dev/v1.10/introduction/getting-started/) is a great resource for doing this, but I'll still walk you through a quick setup. In my case, I used the image factory to build out my image. 

1. Hardware Type: Bare Metal
2. Version: 1.10.6
3. Machine Architecture: amd64 (left secureboot off)
4. System Extensions
	1. amd-ucode
	2. util-linux-tools
	3. iscsi-tools
5. Customization: left blank

The ISO link I received was: https://factory.talos.dev/image/743d53d3c9cc1942e0a3fc7167565665ea25823e6261d82bf022e9a9e50ed84d/v1.10.6/metal-amd64.iso

>Pro tip: Note down the image link from Image Factory---you'll need it for configs later.

After downloading the ISO, we now need to load it onto a flash drive. I'm on a Mac, so I used [balenaEtcher](https://etcher.balena.io/)

Run balenaEtcher, insert the USB stick and select `From File`, navigate to your ISO and image your usb stick.

Congrats, you are ready to start building out your configs!

---
## 3.  Laying the Foundation

Here's where we strap ourselves to CDKTF. Is it more verbose than  
Terraform? Absolutely. Will I complain about it the whole time? Also  
yes. But it's powerful, and you'll learn something.

#### Prerequisites
- cli [cdktf](https://developer.hashicorp.com/terraform/tutorials/cdktf/cdktf-install)
- node.js v16+
- terraform (I prefer to use [tfswitch](https://tfswitch.warrensbox.com/))
- Python3

Now that we have our hardware in order, we can move on to setting up our project.

Create a directory for our project
```sh 
mkdir cdktf_talos_project && cd cdktf_talos_project
```

Create the initial files for the project specifying the provider and language details. In this guide, I'll be using python and talos version 0.8.1

```sh
cdktf init --template="python" --providers="siderolabs/talos@~>0.8.1"
```

Say "no" to Terraform Cloud (unless you're a masochist), give your  
project a name, and let CDKTF vomit boilerplate files into your repo.

Add the `local` provider in `cdktf.json`:
```json
"terraformProviders": [
    "siderolabs/talos@~>0.8.1",
    "hashicorp/local@~>2.1"
  ],
```

Run `cdktf get` to pull in providers. Then set up a virtual environment:

```bash
python3 -m venv .venv
```

This will create a .venv directory where we will install the packages we need.
```sh
source .venv/bin/activate
pip install cdktf
pip install constructs
```


From here, I would recommend brushing up on the [Talos Linux Terraform Provider](https://registry.terraform.io/providers/siderolabs/talos/latest/docs). CDKTF will slice those Terraform resources into even smaller chunks,  
just to test your patience.

---
## 4.  Configure the Control Plane

Now that we are all setup with our project, let's get some disks spinning! First, slap that newly imaged USB stick into your control plane computer. You'll want to boot into the bios and set the USB as the first storage device to start up.

Let the computer roll into `Stage Maintenance`. *Talos stares at you expectantly.*

>**ATTENTION**
>*Once it is up, pull the USB*

Note down your IP address on your control plane. Should show top right once booted. I like to set the ip address in my router so my DHCP server doesn't keep swapping it around. (Especially helpful if you constantly need to start over your cluster build 🙃 ) I'll be using `192.168.0.11` for my control plane.

### Imports & Provider Setup

`main.py`
```python
#!/usr/bin/env python
from constructs import Construct
from pathlib import Path
from cdktf import App, TerraformStack, TerraformOutput
from imports.talos import (provider, machine_secrets, data_talos_machine_disks,
                           data_talos_client_configuration, data_talos_machine_configuration,
                           machine_configuration_apply, machine_bootstrap, cluster_kubeconfig)

from imports.local.provider import LocalProvider
from imports.local.file import File


class MyStack(TerraformStack):
    def __init__(self, scope: Construct, id: str):
        super().__init__(scope, id)

        # Configure the Talos Provider
        talosprovider=provider.TalosProvider(
            scope=self, 
            id="talos", 
            image_factory_url="factory.talos.dev/metal-installer/743d53d3c9cc1942e0a3fc7167565665ea25823e6261d82bf022e9a9e50ed84d:v1.10.6" 
        ) 

app = App()
MyStack(app, "cdktf_talos_project")

app.synth()

```

Already feeling the verbosity? Get used to it.

### Machine Secrets & Client Configuration

Generate secrets and client configs (Cluster name = SpongeBob-themed,  
obviously)

`main.py`
```python
#........ Beginning Code ................#

# Configure the Talos Provider
        talosprovider=provider.TalosProvider(
            scope=self, 
            id="talos", 
            image_factory_url="factory.talos.dev/metal-installer/743d53d3c9cc1942e0a3fc7167565665ea25823e6261d82bf022e9a9e50ed84d:v1.10.6" 
        ) 

        # Create Secrets
        secrets = machine_secrets.MachineSecrets(
            self, 
            "this", 
            talos_version="1.10.6"
        )

        # Create Client Configuration
        client_configuration = data_talos_client_configuration.DataTalosClientConfiguration(
            self,
            "clientConfiguration",
            cluster_name="clusterbob",
            client_configuration={
                "ca_certificate": secrets.client_configuration.ca_certificate,
                "client_certificate": secrets.client_configuration.client_certificate,
                "client_key": secrets.client_configuration.client_key,
            },
            nodes=["192.168.0.11"],
            endpoints=["192.168.0.11"]
        )

#........ Rest of code ..............#
```

### Disk Data Resource & Terraform Output

Next, we need to figure out what kind of storage disks there are so we can target the install to the correct drive.

`main.py`
```python
#........ Existing Code ................#

# Fetch Machine Disks
        disks=data_talos_machine_disks.DataTalosMachineDisks(
            self,
            "disks",
            client_configuration={
                "ca_certificate": secrets.client_configuration.ca_certificate,
                "client_certificate": secrets.client_configuration.client_certificate,
                "client_key": secrets.client_configuration.client_key,
            },

            node_attribute = "192.168.0.11",
        )

        TerraformOutput(
            self,
            "disks_output",
            value=disks.disks,
        )
        
app = App()
MyStack(app, "cdktf_talos_project")

app.synth()


#........ Rest of code ..............#
```

Time to run your first deploy! Run `cdktf deploy`

This will output a terraform plan. Review it and make sure it all looks good. The `TerraformOutput` we made won't show up until we approve.

If it looks good, select approve. After hitting approve you'll see the `disks_ouptut`. Note down the disk you wish to target. In my case, it is `/dev/sdb`
```json
 {
      "bus_path": "/pci0000:00/0000:00:08.2/0000:04:00.0/ata1/host1/target1:0:0/1:0:0:0",
      "modalias": "scsi:t-0x00",
      "model": "SAMSUNG SSD PM87",
      "name": "/dev/sdb",
      "serial": "",
      "size": "512 GB",
      "type": "ssd",
      "uuid": "",
      "wwid": "naa.5002538d409fad08"
}
```

### Control Plane Machine Configuration and Apply

Now, it's time to create our control plane machine config and apply it! First, we have some patches we need to configure. Let's create a new `patches` directory:
```sh
mkdir patches
cd patches
touch config_patch_controlplane.yaml
```

In this patch we want to setup longhorn isci settings, where to install, what image, disable kube-proxy and disable cni. We are going to configure our own cni that will replace kube proxy. More on that later.

If you do anything, ensure the `disk: /dev/sdb` is targeting the right disk.

`config_patch_controlplan.yaml`
```yaml
machine:
  kubelet:
    extraMounts:
          - destination: /var/lib/longhorn
            type: bind
            source: /var/lib/longhorn
            options:
            - bind
            - rshared
            - rw
  install:
    disk: /dev/sdb
    image: factory.talos.dev/metal-installer/743d53d3c9cc1942e0a3fc7167565665ea25823e6261d82bf022e9a9e50ed84d:v1.10.6 
cluster:
  proxy:
    disabled: true
  network:
    cni:
      name: none
```

Now we need to configure out control plane machine config and apply. Replace te cluster_endpoint and node_attribute ips with your control plane.

`main.py`
```python
#........ Existing Code ................#

# Output the disks information
        TerraformOutput(
            self,
            "disks_output",
            value=disks.disks,
        )

        # Control Plane Machine Configuration
        controlplane_machine_configuration = data_talos_machine_configuration.DataTalosMachineConfiguration(
            self,
            "controlPlaneConfig",
            cluster_name="clusterbob",
            machine_type="controlplane",
            cluster_endpoint="https://192.168.0.11:6443",
            machine_secrets={
                "cluster": {
                    "id": secrets.machine_secrets.cluster.id,
                    "secret": secrets.machine_secrets.cluster.secret, 
                },
                "certs": {
                    "etcd": {
                        "cert": secrets.machine_secrets.certs.etcd.cert,
                        "key":  secrets.machine_secrets.certs.etcd.key,
                    },
                    "k8_s": {
                        "cert": secrets.machine_secrets.certs.k8_s.cert,
                        "key":  secrets.machine_secrets.certs.k8_s.key,
                    },
                    "k8_s_aggregator": {
                        "cert": secrets.machine_secrets.certs.k8_s_aggregator.cert,
                        "key":  secrets.machine_secrets.certs.k8_s_aggregator.key,
                    },
                    "k8_s_serviceaccount": {
                        "key": secrets.machine_secrets.certs.k8_s_serviceaccount.key,
                    },
                    "os": {
                        "cert": secrets.machine_secrets.certs.os.cert,
                        "key":  secrets.machine_secrets.certs.os.key,
                    },
                },
                "secrets": {
                    "bootstrap_token": secrets.machine_secrets.secrets.bootstrap_token,
                    "secretbox_encryption_secret": secrets.machine_secrets.secrets.secretbox_encryption_secret,
                },
                "trustdinfo": {
                    "token": secrets.machine_secrets.trustdinfo.token,
                },
            },
        )

        # Apply Control Plane Configuration to the node
        control_plane_config_apply = machine_configuration_apply.MachineConfigurationApply(

            self,
            "controlPlaneConfigApply",
            client_configuration={
                "ca_certificate": secrets.client_configuration.ca_certificate,
                "client_certificate": secrets.client_configuration.client_certificate,
                "client_key": secrets.client_configuration.client_key,
            },
            machine_configuration_input=controlplane_machine_configuration.machine_configuration,
            node_attribute="192.168.0.11",
            config_patches=[Path("patches/config_patch_controlplane.yaml").read_text()]
        )

#........ Rest of code ..............#
```

Finally, let's bootstrap the cluster and output a [Kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) so we can see if our cluster is working.

main.py
```python


        # Bootstrap the machine
        bootstrap = machine_bootstrap.MachineBootstrap(
            self,
            "bootstrap",
            depends_on=[control_plane_config_apply],
            node_attribute="192.168.0.11",
            client_configuration={
                "ca_certificate": secrets.client_configuration.ca_certificate,
                "client_certificate": secrets.client_configuration.client_certificate,
                "client_key": secrets.client_configuration.client_key,
            },
        )

        # Generate Kubeconfig for the cluster
        kubeconfig = cluster_kubeconfig.ClusterKubeconfig(
            self,
            "kubeconfig",
            depends_on=[bootstrap],
            client_configuration={
                "ca_certificate": secrets.client_configuration.ca_certificate,
                "client_certificate": secrets.client_configuration.client_certificate,
                "client_key": secrets.client_configuration.client_key,
            },
            node_attribute="192.168.0.11",
        )

        LocalProvider(self, "local")

        # Output Kubeconfig and Talos configuration files
        File(self, "kubeconfig_file",
             content=kubeconfig.kubeconfig_raw,
             filename="kubeconfig"
        )
        File(self, "talosconfig_file",
             content=client_configuration.talos_config,
             filename="talosconfig")


app = App()
MyStack(app, "cdktf_talos_project")

app.synth()
```

...and so on. Each block adds 30 lines of Python for what Terraform could do in 10. But it works.

## 5. Deploy Control Plane

Run:

```sh
cdktf deploy
```

Approve the plan, grab coffee, and wait for Talos to spin up.

What we are looking for:

| Object             | Status  |
| ------------------ | ------- |
| Stage              | Running |
| Ready              | False   |
| Secureboot         | False   |
| Kubelet            | Healthy |
| Apiserver          | Healthy |
| Controller-Manager | Healthy |
| Scheduler          | Healthy |
If that all matches, congrats! Your conrol plane is built. Check your cdktf.out directory for your talosconfig and kubeconfig. My pathing is `cdktf.out/stacks/cdktf_talos_project/<kubeconfig or talosconfig>`

## 6. Verify Cluster Connectivity

Funny, The title says Verify "Cluster" Connectivity. Is it really a cluster if it is just one machine? Food for thought for later.

Export your kubeconfig. I typically move my kubeconfigs to ~/.kube/

So my command looks like:
```sh
export KUBECONFIG=~/.kube/kubeconfig
```

Now run `kubectl get nodes`, below is my output:
```
NAME             STATUS     ROLES           AGE     VERSION
squidmaster-01   NotReady   control-plane   8m58s   v1.33.0
```

The hostname is coming from my router DHCP settings, you'll most likely see whatever your machine host defaults too. 

>You can patch the hostname in with network options. Below is an example of that:
>```
>machine:
>	network:
>		hostname: squidmaster-01
>```

If you get an output, congrats! You've configured your control plane!

Now you may have noticed when you jumped ahead and ran `kubectl get pods -A` coredns is in a weird state. Well, that's because we don't have a Container Network Interface (CNI) configured. I recommend setting up [Cilium](https://cilium.io/)

>Note this is also the reason why you see READY false in your control plane statuses

But anyways, having a control plane is cool and all, but I want to run some workloads. Let's get our workers added. 

## 7. Adding our Workers

In my instance, I'm running with 3 workers and 1 control plane. So let's wire up the 3 workers. More lines of CDKTF code, more verbosity, more sarcasm.

First, let's make a patch file, exactly the same as our control plane one

`patch_config_workers.yaml`
```yaml
machine:
  kubelet:
    extraMounts:
          - destination: /var/lib/longhorn
            type: bind
            source: /var/lib/longhorn
            options:
            - bind
            - rshared
            - rw
  install:
    disk: /dev/sdb
    image: factory.talos.dev/metal-installer/743d53d3c9cc1942e0a3fc7167565665ea25823e6261d82bf022e9a9e50ed84d:v1.10.6 
cluster:
  proxy:
    disabled: true
  network:
    cni:
      name: none

```

They reason why i did this is because you can patch specific things that are dedicated to workers. I like just having the option there if needed. 

Now, let's get the machine config and applies squared away.

`main.py`
```python
machine_configuration_worker = data_talos_machine_configuration.DataTalosMachineConfiguration(
            self,
            "workerConfig",
            cluster_name="clusterbob",
            machine_type="worker",
            cluster_endpoint="https://192.168.0.11:6443",
            machine_secrets={
                "cluster": {
                    "id": secrets.machine_secrets.cluster.id,
                    "secret": secrets.machine_secrets.cluster.secret, 
                },
                "certs": {
                    "etcd": {
                        "cert": secrets.machine_secrets.certs.etcd.cert,
                        "key":  secrets.machine_secrets.certs.etcd.key,
                    },
                    "k8_s": {
                        "cert": secrets.machine_secrets.certs.k8_s.cert,
                        "key":  secrets.machine_secrets.certs.k8_s.key,
                    },
                    "k8_s_aggregator": {
                        "cert": secrets.machine_secrets.certs.k8_s_aggregator.cert,
                        "key":  secrets.machine_secrets.certs.k8_s_aggregator.key,
                    },
                    "k8_s_serviceaccount": {
                        "key": secrets.machine_secrets.certs.k8_s_serviceaccount.key,
                    },
                    "os": {
                        "cert": secrets.machine_secrets.certs.os.cert,
                        "key":  secrets.machine_secrets.certs.os.key,
                    },
                },
                "secrets": {
                    "bootstrap_token": secrets.machine_secrets.secrets.bootstrap_token,
                    "secretbox_encryption_secret": secrets.machine_secrets.secrets.secretbox_encryption_secret,
                },
                "trustdinfo": {
                    "token": secrets.machine_secrets.trustdinfo.token,
                },
            },
        )

        w1_config_apply = machine_configuration_apply.MachineConfigurationApply(
            self,
            "worker1ConfigApply",
            client_configuration={
                "ca_certificate": secrets.client_configuration.ca_certificate,
                "client_certificate": secrets.client_configuration.client_certificate,
                "client_key": secrets.client_configuration.client_key,
            },
            machine_configuration_input=machine_configuration_worker.machine_configuration,
            node_attribute="192.168.0.12",
            config_patches=[Path("patches/config_patch_workers.yaml").read_text()],
            provider=talosprovider # needed after bootstrapping cluster
        )

        w2_config_apply = machine_configuration_apply.MachineConfigurationApply(
            self,
            "worker2ConfigApply",
            client_configuration={
                "ca_certificate": secrets.client_configuration.ca_certificate,
                "client_certificate": secrets.client_configuration.client_certificate,
                "client_key": secrets.client_configuration.client_key,
            },
            machine_configuration_input=machine_configuration_worker.machine_configuration,
            node_attribute="192.168.0.13",
            config_patches=[Path("patches/config_patch_workers.yaml").read_text()],
            provider=talosprovider # needed after bootstrapping cluster
        )

        w3_config_apply = machine_configuration_apply.MachineConfigurationApply(
            self,
            "worker3ConfigApply",
            client_configuration={
                "ca_certificate": secrets.client_configuration.ca_certificate,
                "client_certificate": secrets.client_configuration.client_certificate,
                "client_key": secrets.client_configuration.client_key,
            },
            machine_configuration_input=machine_configuration_worker.machine_configuration,
            node_attribute="192.168.0.14",
            config_patches=[Path("patches/config_patch_workers.yaml").read_text()],
            provider=talosprovider # needed after bootstrapping cluster
        )
```

Awesome, now that the code is squared away, we need to boot up our workers! Take that USB you have and boot up each machine one by one (or if you have 3 extra usb's image those with the same image as before). Once one boots, you can pull the usb and move on to the next.

Once all three are in maintenance mode and awaiting orders, run `cdktf deploy` then `Approve` if all looks well.

After approving, go refill that coffee cup, it will be a few minutes. Feel free to run `kubectl get nodes --watch` to let it update automatically

Result:
```sh
kubectl get nodes

NAME             STATUS     ROLES           AGE     VERSION
krustygrunt-01   NotReady   <none>          2m57s   v1.33.0
krustygrunt-02   NotReady   <none>          77s     v1.33.0
krustygrunt-03   NotReady   <none>          2m5s    v1.33.0
squidmaster-01   NotReady   control-plane   56m     v1.33.0
```

>Note: Status is NotReady because there is no CNI set. It is out-of-scope for this guide, but look out for my other blogs on how to get that configured.

Once you see 4 nodes,  congrats! You have configured a Kuberentes cluster using cdktf to provision Talos Linux on 4 machines. 

## 7. Reflections

- CDKTF is powerful, but verbose. Terraform would've been leaner.
- You now understand how Talos, CDKTF, and Terraform all play together.
- You did it the hard way, but that's the fun of homelab life


## Conclusion

You survived CDKTF, Talos, and bare-metal Kubernetes. Your cluster is  
up, your configs are reproducible, and you've earned bragging rights.

Yes, it's verbose. Yes, it's sometimes unnecessary. But you learned  
something valuable, and you did it with style.

Look out for more of my guides for more cdktf and kuberentes configurations!
