/* Terraform Associate (004) — Domain 1: IaC Concepts (~9% of exam) */
window.TF_DOMAIN1 = [
  {
    id: "t1-01", domain: 1, type: "single",
    stem: "Which statement BEST describes Infrastructure as Code (IaC)?",
    options: [
      "The practice of managing and provisioning infrastructure through machine-readable definition files, rather than through manual processes or interactive configuration tools.",
      "The practice of writing application source code that runs on cloud infrastructure.",
      "A method for monitoring infrastructure performance using dashboards.",
      "A type of virtual machine image used to boot cloud servers."
    ],
    correct: [0],
    explanation: "IaC means defining and managing infrastructure using configuration files that can be versioned, reviewed, and reused, instead of manually clicking through a console or running one-off commands. It is not about application code, monitoring, or VM images — those are separate concerns."
  },
  {
    id: "t1-02", domain: 1, type: "multiple",
    stem: "Which of the following are advantages of using an Infrastructure as Code approach over manual infrastructure management? (Choose two.)",
    options: [
      "Infrastructure changes can be reviewed and version-controlled the same way application code is.",
      "The same configuration can be reused to provision identical environments consistently.",
      "It guarantees zero downtime for every deployment.",
      "It eliminates the need to ever test infrastructure changes.",
      "It removes the need for cloud provider credentials."
    ],
    correct: [0, 1],
    explanation: "IaC brings software engineering practices to infrastructure: version control, code review, and consistent, repeatable provisioning across environments. It does not guarantee zero downtime, does not remove the need for testing, and you still need valid provider credentials to authenticate against the target platform."
  },
  {
    id: "t1-03", domain: 1, type: "single",
    stem: "A team currently provisions servers by logging into the cloud console and clicking through forms. Different engineers configure servers slightly differently, causing configuration drift between environments.\n\nHow does adopting Terraform address this problem?",
    options: [
      "Terraform configuration files become the single source of truth for infrastructure, so the same declarative definition produces consistent results every time it is applied.",
      "Terraform automatically fixes any manual changes made in the console without any action from the user.",
      "Terraform prevents anyone from ever using the cloud console again.",
      "Terraform only works if every engineer uses the exact same operating system."
    ],
    correct: [0],
    explanation: "Because the desired state is defined in code, applying the same configuration produces the same result regardless of who runs it, eliminating drift caused by inconsistent manual steps. Terraform does not silently auto-correct out-of-band changes (it reports drift on the next plan), does not block console access, and is OS-independent for the practitioner running it."
  },
  {
    id: "t1-04", domain: 1, type: "single",
    stem: "What does it mean for an Infrastructure as Code tool to be \"declarative\"?",
    options: [
      "The user describes the desired end state of the infrastructure, and the tool determines the steps needed to reach that state.",
      "The user writes a step-by-step script specifying every command to execute, in order.",
      "The tool only supports read-only operations and cannot create resources.",
      "The configuration must be written in a general-purpose programming language like Python."
    ],
    correct: [0],
    explanation: "Terraform's HCL is declarative: you describe what the infrastructure should look like, and Terraform's engine computes an execution plan to get there. This differs from an imperative approach, where you would script the exact sequence of API calls needed to reach that state."
  },
  {
    id: "t1-05", domain: 1, type: "single",
    stem: "A company runs workloads across AWS, Azure, and an on-premises VMware environment. They want to manage all of this infrastructure using one consistent workflow and language.\n\nWhich characteristic of Terraform makes it well suited to this requirement?",
    options: [
      "Terraform uses a provider model, so the same core workflow and HCL language can target many different platforms through provider plugins.",
      "Terraform can only manage infrastructure within a single cloud provider account.",
      "Terraform requires a separate, provider-specific language for each platform it manages.",
      "Terraform automatically migrates on-premises servers into the cloud."
    ],
    correct: [0],
    explanation: "Terraform's provider architecture lets a single configuration language and workflow (init, plan, apply) manage resources across many providers — AWS, Azure, VMware, Kubernetes, SaaS platforms, and more — through provider plugins that translate HCL into provider API calls. It does not migrate workloads on its own and is not restricted to one account or platform."
  },
  {
    id: "t1-06", domain: 1, type: "single",
    stem: "Which best describes the difference between mutable and immutable infrastructure provisioning?",
    options: [
      "In immutable provisioning, servers are replaced with new instances built from an updated definition rather than being changed in place; in mutable provisioning, existing servers are updated directly.",
      "Immutable infrastructure can never be deleted once created.",
      "Mutable infrastructure only applies to serverless functions.",
      "There is no practical difference between the two approaches."
    ],
    correct: [0],
    explanation: "Immutable infrastructure replaces resources instead of patching them in place, reducing configuration drift and making rollbacks predictable. Terraform's plan/apply model often favors this pattern (e.g., replacing an instance when an AMI changes) but can also perform in-place updates when a provider supports them."
  },
  {
    id: "t1-07", domain: 1, type: "single",
    stem: "Why is idempotency an important property of an Infrastructure as Code workflow?",
    options: [
      "Applying the same configuration multiple times produces the same end state, so re-running a deployment does not create duplicate resources or unintended changes.",
      "It guarantees that infrastructure costs remain constant over time.",
      "It means the configuration file can only be applied exactly once, ever.",
      "It ensures that all resources are created in alphabetical order."
    ],
    correct: [0],
    explanation: "Idempotent operations can be safely repeated: if nothing changed in the configuration, running terraform apply again results in no changes. This predictability is central to reliable automation and CI/CD pipelines for infrastructure."
  },
  {
    id: "t1-08", domain: 1, type: "single",
    stem: "Which scenario is the BEST example of using Terraform to manage a hybrid cloud workflow?",
    options: [
      "A single set of Terraform configurations provisions a virtual network in Azure and a matching VPN connection to an on-premises data center, applied through the same workflow.",
      "A team manually configures on-premises servers and separately uses Terraform only for cloud resources, with no relationship between the two.",
      "A company uses Terraform exclusively to manage its GitHub repository settings.",
      "A team writes a shell script that calls the AWS CLI directly instead of using Terraform."
    ],
    correct: [0],
    explanation: "A hybrid cloud workflow in Terraform means using providers to coordinate resources that span on-premises and cloud environments within the same configuration and apply cycle, so dependencies between them (like a VPN connecting the two) are managed consistently. The other options describe fragmented or unrelated use cases."
  },
  {
    id: "t1-09", domain: 1, type: "single",
    stem: "A new engineer asks why the team stores Terraform configuration files in a Git repository instead of keeping them only on individual laptops.\n\nWhat is the PRIMARY benefit of version-controlling IaC configurations?",
    options: [
      "It provides a history of changes, enables peer review through pull requests, and lets the team collaborate on and roll back infrastructure changes safely.",
      "It automatically encrypts all cloud credentials used by Terraform.",
      "It is required for Terraform to parse HCL syntax correctly.",
      "It removes the need to run terraform plan before applying changes."
    ],
    correct: [0],
    explanation: "Version control brings the same collaboration and auditability benefits to infrastructure code as it does to application code: change history, code review, branching, and the ability to revert to a known-good configuration. It has no bearing on HCL parsing or credential encryption, and does not replace the plan/apply workflow."
  }
];
