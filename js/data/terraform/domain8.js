/* Terraform Associate (004) — Domain 8: HCP Terraform (~11% of exam) */
window.TF_DOMAIN8 = [
  {
    id: "t8-01", domain: 8, type: "single",
    stem: "What is HCP Terraform (formerly known as Terraform Cloud)?",
    options: [
      "HashiCorp's managed SaaS platform that runs Terraform operations remotely, stores state, and adds collaboration and governance features on top of the open-source CLI.",
      "A command-line-only tool with no web interface, used exclusively for local development.",
      "A replacement for the HCL configuration language.",
      "A Kubernetes distribution maintained by HashiCorp."
    ],
    correct: [0],
    explanation: "HCP Terraform is a hosted service that executes Terraform runs remotely, manages state centrally, and layers on team collaboration, policy enforcement, and a private registry — while configurations still use standard HCL and the same core workflow. It is not a CLI replacement, a language, or a Kubernetes product."
  },
  {
    id: "t8-02", domain: 8, type: "single",
    stem: "In HCP Terraform, what does a \"workspace\" represent?",
    options: [
      "A distinct working directory with its own state, variables, and run history — analogous to running Terraform against one specific configuration and state file.",
      "A folder used only to organize documentation, with no functional effect on Terraform runs.",
      "A single, shared state file used across all of an organization's projects at once.",
      "A billing account used to pay for HCP Terraform."
    ],
    correct: [0],
    explanation: "An HCP Terraform workspace groups everything needed for one deployment: configuration source, variables, state, and run history — similar in spirit to a working directory with a backend in the open-source CLI, but managed centrally with its own access controls and settings."
  },
  {
    id: "t8-03", domain: 8, type: "single",
    stem: "How does an HCP Terraform workspace differ from a CLI-based \"terraform workspace\" (created with terraform workspace new)?",
    options: [
      "An HCP Terraform workspace is a fully separate entity with its own state, variables, and permissions, while a CLI workspace is a named state file within the SAME backend and configuration, sharing variables and settings.",
      "They are exactly the same feature, just accessed through different interfaces.",
      "CLI workspaces support remote execution, while HCP Terraform workspaces only support local execution.",
      "HCP Terraform workspaces are only used for testing and cannot manage real infrastructure."
    ],
    correct: [0],
    explanation: "This is a common point of confusion: CLI workspaces (terraform workspace new/select) let one configuration manage multiple named state files (e.g., dev/staging) using the same backend and variable definitions. HCP Terraform workspaces are a much heavier-weight concept — each is essentially an independent unit with its own state, variable sets, and permissions, more like a separate project than a lightweight state file switch."
  },
  {
    id: "t8-04", domain: 8, type: "single",
    stem: "In a VCS-driven HCP Terraform workflow, what typically triggers a new run?",
    options: [
      "A commit or merge to the branch configured for the workspace, which HCP Terraform detects via its VCS integration and automatically queues a plan.",
      "An engineer must always manually click \"Run\" for every single change, with no automatic triggers available.",
      "HCP Terraform polls the cloud provider's API every hour looking for drift, regardless of the VCS.",
      "A run can only be started by editing variables directly in the HCP Terraform UI."
    ],
    correct: [0],
    explanation: "In the VCS-driven workflow, HCP Terraform connects directly to a repository (GitHub, GitLab, etc.) and automatically triggers a plan (and, depending on settings, an apply) whenever relevant commits land on the tracked branch — enabling a GitOps-style workflow without manual CLI invocation."
  },
  {
    id: "t8-05", domain: 8, type: "single",
    stem: "Besides the VCS-driven workflow, which other run workflows does HCP Terraform support for triggering plans and applies?",
    options: [
      "The CLI-driven workflow (using the cloud block for remote execution) and the API-driven workflow.",
      "Only the VCS-driven workflow is supported; no alternatives exist.",
      "Only a workflow triggered by AWS CloudWatch events.",
      "Only manual state file uploads through email."
    ],
    correct: [0],
    explanation: "HCP Terraform supports three workflows: VCS-driven (triggered by repository commits), CLI-driven (using the cloud block so terraform plan/apply run locally-initiated but execute remotely in HCP Terraform), and API-driven (runs triggered programmatically via the HCP Terraform API for custom automation)."
  },
  {
    id: "t8-06", domain: 8, type: "single",
    stem: "What does it mean for HCP Terraform to perform \"remote operations\"?",
    options: [
      "terraform plan and apply execute on HCP Terraform's own infrastructure rather than on the engineer's local machine or a self-hosted CI runner.",
      "It means Terraform automatically deploys infrastructure to remote, distant geographic regions only.",
      "It means state files are stored exclusively offline.",
      "It means all provider API calls are proxied through a VPN by default."
    ],
    correct: [0],
    explanation: "With remote operations, the actual plan/apply execution happens on HCP Terraform's runners, giving consistent execution environments, centralized logs, and avoiding the need for every engineer's laptop or every CI system to have direct provider credentials. It has nothing to do with geographic deployment regions or VPN proxying by default."
  },
  {
    id: "t8-07", domain: 8, type: "single",
    stem: "A platform team wants to enforce that no workspace can provision a publicly accessible S3 bucket, blocking any plan that would violate this rule before it can be applied.\n\nWhich HCP Terraform feature is designed for this kind of policy enforcement?",
    options: [
      "Sentinel (or OPA) policy as code, evaluated as part of the run pipeline before apply is allowed.",
      "A lifecycle prevent_destroy argument added to every resource.",
      "A required_providers version constraint.",
      "A workspace-level Terraform version pin."
    ],
    correct: [0],
    explanation: "Policy as code (Sentinel, HashiCorp's own policy language, or OPA support) lets an organization define rules that run checks are evaluated against, blocking or warning on non-compliant plans before they can be applied — exactly the kind of centralized guardrail described. prevent_destroy only stops deletion of a specific resource, and version constraints/pins don't enforce security policy."
  },
  {
    id: "t8-08", domain: 8, type: "single",
    stem: "What is the purpose of a \"run trigger\" in HCP Terraform?",
    options: [
      "It automatically queues a new run in one workspace whenever a run successfully completes in another, specified source workspace — useful for chaining dependent infrastructure layers.",
      "It sends a Slack message whenever any workspace is created.",
      "It permanently locks a workspace after its first successful apply.",
      "It converts a CLI-driven workspace into a VCS-driven workspace."
    ],
    correct: [0],
    explanation: "Run triggers connect workspaces so that a successful apply in an upstream workspace (e.g., a shared network layer) automatically starts a new run in a downstream workspace that depends on it (e.g., an application layer) — useful for coordinating layered infrastructure without manual intervention."
  },
  {
    id: "t8-09", domain: 8, type: "single",
    stem: "Which HCP Terraform construct groups related workspaces together and can be used to apply consistent team permissions across all of them at once?",
    options: [
      "Projects",
      "Run triggers",
      "Sentinel policies",
      "Provider aliases"
    ],
    correct: [0],
    explanation: "Projects organize a set of related workspaces (for example, all workspaces belonging to one product or team) and allow assigning team access permissions at the project level rather than configuring each workspace individually. Run triggers chain runs between workspaces, Sentinel enforces policy, and provider aliases are an unrelated HCL concept for multiple provider configurations."
  },
  {
    id: "t8-10", domain: 8, type: "multiple",
    stem: "Which two categories of variables can typically be set on an HCP Terraform workspace? (Choose two.)",
    options: [
      "Terraform variables, which populate input variables declared in the configuration.",
      "Environment variables, which are set as shell environment variables during the run (such as cloud credentials).",
      "SQL variables, used to query the state database directly.",
      "DNS variables, used to configure the workspace's custom domain.",
      "Backend variables, used to select which storage backend the workspace uses."
    ],
    correct: [0, 1],
    explanation: "HCP Terraform workspaces distinguish Terraform variables (mapped to input variables in the configuration) from environment variables (exposed as shell environment variables to the run, commonly used for provider credentials like AWS_ACCESS_KEY_ID). \"SQL variables\", \"DNS variables\", and \"backend variables\" are not real HCP Terraform variable categories — HCP Terraform manages its own state storage, so a workspace has no separate backend to select."
  },
  {
    id: "t8-11", domain: 8, type: "single",
    stem: "A workspace variable containing a cloud provider secret access key should not be visible in the HCP Terraform UI or API responses after it is saved.\n\nWhich workspace variable setting should be enabled?",
    options: [
      "Marking the variable as \"sensitive\".",
      "Marking the variable as \"HCL\".",
      "Marking the variable as \"environment\" only, with no other setting.",
      "There is no way to hide a variable's value in HCP Terraform."
    ],
    correct: [0],
    explanation: "Marking a workspace variable as sensitive hides its value from the UI and API after it is saved (write-only), similar in spirit to a sensitive Terraform variable, but enforced at the platform level. The \"HCL\" toggle controls whether the value is parsed as an HCL expression, not its visibility, and being an environment variable alone does not hide the value."
  },
  {
    id: "t8-12", domain: 8, type: "single",
    stem: "What is a private registry within HCP Terraform used for?",
    options: [
      "Sharing internally authored modules and providers within an organization, with discovery, versioning, and documentation similar to the public Terraform Registry.",
      "Storing Docker container images for application deployments.",
      "Hosting the organization's DNS records.",
      "Caching Terraform's own binary releases for offline installs."
    ],
    correct: [0],
    explanation: "A private registry lets an organization publish and version its own modules (and, in some setups, providers) internally, giving teams the same discoverability and documentation experience as the public Terraform Registry, without exposing anything publicly. It is unrelated to container images, DNS, or CLI binary distribution."
  },
  {
    id: "t8-13", domain: 8, type: "single",
    stem: "In a VCS-driven workflow, what is a \"speculative plan\"?",
    options: [
      "A plan automatically run against a pull request to preview proposed changes, without the ability to be applied, letting reviewers see the impact before merging.",
      "A plan that randomly guesses infrastructure changes without reading the configuration.",
      "A plan that is always automatically applied without any review.",
      "A plan that only runs once per calendar month."
    ],
    correct: [0],
    explanation: "Speculative plans run against proposed changes (typically a pull request) to show reviewers what would happen if merged, but they cannot be applied directly — they exist purely for visibility during code review, encouraging informed approval before the change reaches the tracked branch."
  },
  {
    id: "t8-14", domain: 8, type: "single",
    stem: "Which HCP Terraform capability estimates the monthly cost impact of a proposed plan before it is applied, for supported providers?",
    options: [
      "Cost estimation",
      "Sentinel policy checks",
      "Run triggers",
      "State versioning"
    ],
    correct: [0],
    explanation: "Cost estimation analyzes a plan's proposed resource changes and estimates their monthly cost impact for supported providers, surfacing that information alongside the plan output to inform reviewers. Sentinel enforces policy compliance, run triggers chain workspaces together, and state versioning tracks the history of state snapshots — none of which estimate cost."
  }
];
