---
title: 'Power Automate'
subtitle: "The Operational Credential Conundrum"
author: 'Jacob McNeilly'
date: '2025-02-13'
draft: false
tags: [microsoft, power automate, credentials, service account]
images: ['/images/blog/robot-arm.jpg']
featuredImage: '/images/blog/robot-arm.jpg'
fontawesome: true
---
<!-- <p align="center">
  <img src="/images/blog/robot-arm.jpg" alt="Banner" width="60%">
</p>
<br><br><br> -->

# The Problem


## Pros

Power Automate (PA) is an incredibly powerful tool, yet it is often overlooked or underutilized in organizations. It enables automation of many manual tasks, such as:

 - Parsing webhooks and generating Microsoft Teams messages
 - Sending and receiving API requests/responses
 - Consolidating data from multiple Microsoft services for reporting and analysis
 - Creating custom workflows that mimic Microsoft Teams app functionalities


## Cons

However, PA has notable drawbacks. Managing flows centrally—like one would with Infrastructure as Code (IaC)—is challenging. There’s no straightforward way to deploy flows to production, and sharing flows across teams is cumbersome.


## The *Real* Problem: Credential Sharing

A critical issue with PA is credential management.

For example, Microsoft Teams previously supported webhook connectors, allowing third-party services to send data directly to Teams. However, in late 2024, Microsoft announced plans to deprecate these connectors, initially giving organizations only a few months to adapt. Following backlash, they postponed (but did not cancel) the deprecation.

With this change looming, I needed a way to maintain webhook functionality across multiple teams. Microsoft's recommendation? Use Power Automate. Setting up a simple PA flow to receive webhook payloads and post messages to Teams was easy. Microsoft even provides countless pre-built templates for this purpose.

However, once I tested my flow, I noticed an issue—every message was posted under my name. This raised critical concerns:
 - What would happen if I leave the organization? 
 - Would the flow stop working? 
 - How would a teammate gain access to these flows if my account was disabled?

A failure in production alerting due to a deactivated account could lead to major outages.

Power Automate does offer a credential-sharing feature, which allows users to share flows along with their credentials. However, this presents a new set of risks:
 - If shared, does the flow allow teammates to impersonate me?
 - Is there some sort of audit tracking to prevent a rogue employee from abusing my credentials?

The idea that PA's solution to this problem is sharing personal credentials felt fundamentally flawed—especially considering that the original Teams connectors were designed to be user-independent.

There must be a better way.

**The Core Issue: Workflows should not be tied to individual user credentials.**


# The Solution

**Service Accounts.**


## Cons

From a security standpoint, service accounts are not a perfect solution. They obscure which specific user performs an action, meaning that, in theory, a bad actor could misuse the account without a clear audit trail.

However, this is still preferable to tying critical workflows to a personal account. At least a service account prevents individual credential exposure and eliminates the risk of a flow breaking if a user leaves.

## Pros

By using service accounts, we:

 - Protect individual user credentials
 - Ensure workflows continue functioning even when employees leave
 - Reduce licensing costs for Power Automate
 - Maintain control over permissions granted to the service account


# The Implementation

You can still create and test flows using your personal account. However, before deploying them in a production environment, transition all workflows to use a service account.

While this is not a step-by-step guide—especially since Microsoft frequently changes UI elements—the general approach is:

 1. **Replace all user credentials** with the service account in every workflow action.
 2. **Ensure the service account has the necessary Microsoft licenses** (Power Automate, Teams, Excel, etc.). A service account without proper licensing is useless.
 3. **Verify connections.** The Power Automate flow page provides an overview of all active connections—ensure all user credentials are replaced with the service account.
 4. **Share the flow with the service account and at least one other trusted individual.** Despite using service account credentials, PA does not automatically grant ownership to the service account.
 5. **Consider setting the service account as the primary owner**, though leaving yourself as an owner can be beneficial for failure notifications.

# Conclusion

To mitigate Microsoft’s credential management issues in Power Automate, use service accounts for workflow connections.

Without them, workflows remain tied to personal accounts, exposing credentials to shared users and risking flow termination when employees leave.

While this approach isn’t perfect, it effectively mimics the functionality of deprecated Teams connectors and provides a more secure, maintainable solution. Hopefully, Microsoft will eventually introduce a native way to manage credentials more securely in Power Automate.


