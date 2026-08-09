/* Terraform Associate (004) — Domain 6: Terraform State Management (~14% of exam) */
window.TF_DOMAIN6 = [
  {
    id: "t6-01", domain: 6, type: "single",
    stem: "By default, without any backend configuration, where does Terraform store its state file?",
    options: [
      "In a local file named terraform.tfstate in the working directory.",
      "In the Terraform Registry.",
      "In a hidden system directory shared across all projects on the machine.",
      "State is not stored anywhere unless a remote backend is configured."
    ],
    correct: [0],
    explanation: "With no backend block specified, Terraform uses the local backend, writing state to terraform.tfstate in the current working directory (and keeping a terraform.tfstate.backup of the previous version). This is fine for solo experimentation but unsuitable for team collaboration."
  },
  {
    id: "t6-02", domain: 6, type: "single",
    stem: "Why is using a remote backend (such as an S3 bucket or HCP Terraform) generally recommended over the local backend for a team working on the same infrastructure?",
    options: [
      "It provides a shared, centralized location for state so team members don't work from conflicting local copies, and it typically supports state locking to prevent concurrent, conflicting operations.",
      "Remote backends are required for Terraform to support any provider other than AWS.",
      "Remote backends automatically write the configuration's HCL files for you.",
      "The local backend cannot store more than one resource."
    ],
    correct: [0],
    explanation: "Local state works for a single practitioner but breaks down for teams: everyone needs the current state, and simultaneous applies from different laptops could corrupt it. Remote backends centralize state and, in most implementations, provide locking so only one operation can modify state at a time."
  },
  {
    id: "t6-03", domain: 6, type: "single",
    stem: "What is the purpose of state locking?",
    options: [
      "It prevents two Terraform operations from writing to the same state simultaneously, avoiding corruption from concurrent runs.",
      "It permanently prevents any future modification of the infrastructure.",
      "It encrypts the contents of the state file at rest.",
      "It restricts which IAM users can authenticate to the cloud provider."
    ],
    correct: [0],
    explanation: "State locking ensures that only one terraform plan or apply can modify a given state at a time, preventing race conditions that could corrupt state if two operations ran concurrently. It does not itself provide encryption or manage cloud IAM permissions, and locks are released after each operation, not permanent."
  },
  {
    id: "t6-04", domain: 6, type: "single",
    stem: "A team configures an S3 bucket as their Terraform backend for state storage in a self-managed (non-HCP Terraform) setup and wants state locking as well.\n\nWhat additional resource has traditionally been required for the S3 backend to provide locking?",
    options: [
      "A DynamoDB table used to store lock information during operations.",
      "A second S3 bucket dedicated exclusively to locks.",
      "An SQS queue that serializes all Terraform commands.",
      "No additional resource; S3 has always provided native locking on its own."
    ],
    correct: [0],
    explanation: "Historically, the S3 backend implements state locking by writing a lock record to a companion DynamoDB table during operations, since S3 itself did not natively support locking. (Newer Terraform/S3 backend versions can alternatively use S3's own conditional writes for locking, but DynamoDB-based locking remains the classic and widely tested approach.) SQS and a second bucket are not part of this mechanism."
  },
  {
    id: "t6-05", domain: 6, type: "single",
    stem: "Which block is used to configure which backend Terraform uses to store its state?",
    options: [
      "A backend block nested inside the terraform block.",
      "A backend resource block at the top level of the configuration.",
      "A provider block named \"backend\".",
      "An output block with a special backend attribute."
    ],
    correct: [0],
    explanation: "Backend configuration is declared with a backend block nested inside the top-level terraform {} block, e.g. terraform { backend \"s3\" { ... } }. It is not a resource, provider, or output block."
  },
  {
    id: "t6-06", domain: 6, type: "single",
    stem: "A team wants to avoid hard-coding backend credentials or bucket names directly into version-controlled configuration files, supplying them instead at init time (e.g., per environment).\n\nWhich approach supports this?",
    options: [
      "Partial backend configuration, supplying the remaining settings via terraform init -backend-config=... or a separate file.",
      "Backend blocks do not support any values being supplied outside the .tf file; everything must be hard-coded.",
      "Store backend credentials as a Terraform output value instead.",
      "Use a locals block to inject backend settings at plan time."
    ],
    correct: [0],
    explanation: "A backend block can be left partially configured, with the remaining arguments (like bucket name, key, or credentials) supplied at terraform init time via -backend-config flags or a config file — useful for keeping environment-specific or sensitive values out of version control. Backend configuration cannot come from outputs or locals, since those aren't evaluated until after the backend is already initialized."
  },
  {
    id: "t6-07", domain: 6, type: "single",
    stem: "A team decides to move their state from the local backend to an S3 backend. After adding the backend block to their configuration, which command performs the migration?",
    options: [
      "terraform init, which detects the new backend configuration and offers to migrate the existing state.",
      "terraform state push, run without any prior init.",
      "terraform import, targeting the new backend.",
      "terraform apply -migrate."
    ],
    correct: [0],
    explanation: "Running terraform init after changing or adding a backend configuration causes Terraform to detect the change and prompt to copy existing state into the new backend. terraform state push is a lower-level command for direct manual state manipulation, terraform import brings unmanaged resources under management (unrelated to backends), and there is no -migrate flag on apply."
  },
  {
    id: "t6-08", domain: 6, type: "single",
    stem: "Which command lists all resource addresses currently tracked in the Terraform state?",
    options: [
      "terraform state list",
      "terraform state show",
      "terraform show -addresses",
      "terraform plan -list"
    ],
    correct: [0],
    explanation: "terraform state list prints every resource address tracked in state. terraform state show <address> prints detailed attributes for one specific resource. The other two commands/flags do not exist."
  },
  {
    id: "t6-09", domain: 6, type: "single",
    stem: "An engineer renamed a resource block from aws_instance.web to aws_instance.app in the configuration, with no other changes. Without any additional action, what will terraform plan show?",
    options: [
      "It will plan to destroy aws_instance.web and create aws_instance.app, because Terraform sees them as unrelated resource addresses even though the underlying infrastructure is unchanged.",
      "Terraform automatically detects the rename and shows no changes.",
      "Terraform will refuse to plan until the old resource name is restored.",
      "Terraform will silently update the state file without showing anything in the plan."
    ],
    correct: [0],
    explanation: "Terraform identifies resources by their address in configuration; a rename with no other mechanism to signal continuity looks like deleting one resource and creating a new one. To rename safely without destroying/recreating the real infrastructure, use terraform state mv (or a moved block) to tell Terraform the old and new addresses refer to the same object."
  },
  {
    id: "t6-10", domain: 6, type: "single",
    stem: "Which mechanism lets Terraform know that a resource address change in configuration (e.g., due to a rename or a move into a module) refers to the same real-world object, avoiding an unwanted destroy/recreate?",
    options: [
      "A moved block (or equivalently, the terraform state mv command).",
      "A lifecycle ignore_changes argument.",
      "An import block.",
      "A depends_on argument."
    ],
    correct: [0],
    explanation: "A moved block declares that a resource previously known by one address is now referred to by another, so Terraform updates its record instead of planning a destroy/create. terraform state mv achieves the same result imperatively from the CLI. ignore_changes ignores attribute drift (not address changes), import brings unmanaged infrastructure in, and depends_on expresses ordering."
  },
  {
    id: "t6-11", domain: 6, type: "single",
    stem: "What does \"configuration drift\" mean in the context of Terraform-managed infrastructure?",
    options: [
      "The real infrastructure has been changed outside of Terraform (e.g., via the console or another tool), so it no longer matches the last-known state.",
      "The Terraform configuration files have syntax errors.",
      "A provider plugin version has changed since the last apply.",
      "The state file has become corrupted and unreadable."
    ],
    correct: [0],
    explanation: "Drift occurs when someone or something modifies real infrastructure outside of Terraform's workflow — for example, manually changing an instance's tag in the console. terraform plan (or a refresh-only plan) detects this by comparing the refreshed real state against the recorded state and configuration."
  },
  {
    id: "t6-12", domain: 6, type: "single",
    stem: "A separate Terraform configuration (managed by another team) needs to reference the VPC ID created by this configuration's state, without duplicating that resource definition.\n\nWhich approach is designed for this?",
    options: [
      "The terraform_remote_state data source, pointing at the other configuration's state backend.",
      "Copy-pasting the VPC resource block into the second configuration.",
      "A local-exec provisioner that reads the first configuration's .tf files.",
      "The terraform import command."
    ],
    correct: [0],
    explanation: "The terraform_remote_state data source reads outputs from another configuration's state file (local or remote), letting separate configurations share information such as a VPC ID without duplicating resource definitions or manually importing anything. Copy-pasting the resource would create a second, conflicting copy of the same real infrastructure under two separate states."
  },
  {
    id: "t6-13", domain: 6, type: "multiple",
    stem: "A storage bucket already exists in a cloud account, created manually outside of Terraform, and the team now wants Terraform to manage it going forward.\n\nWhich TWO approaches can bring it under Terraform management? (Choose two.)",
    options: [
      "The terraform import command, given a resource address and the bucket's existing ID.",
      "A declarative import block in configuration, optionally combined with terraform plan -generate-config-out to scaffold the resource configuration.",
      "Renaming the bucket in the cloud console so Terraform recognizes it automatically.",
      "Adding a data block that references the bucket, which automatically converts it into a managed resource.",
      "Running terraform destroy and then terraform apply to recreate the bucket."
    ],
    correct: [0, 1],
    explanation: "Existing infrastructure can be imported either imperatively with terraform import <address> <id>, or declaratively with an import block (Terraform 1.5+), which can be paired with -generate-config-out to auto-generate a starting resource configuration. Renaming in the console does nothing for Terraform, a data block only reads a resource without managing it, and destroying/recreating would lose the original object entirely."
  },
  {
    id: "t6-14", domain: 6, type: "single",
    stem: "What is a key difference between terraform import and a declarative import block?",
    options: [
      "An import block is part of the configuration and its effect appears in terraform plan for review before being applied, while terraform import is a one-time imperative CLI command that updates state immediately.",
      "terraform import can only be used with AWS resources, while import blocks work with any provider.",
      "Import blocks are executed automatically on every terraform plan without ever appearing in the plan output.",
      "There is no difference; they are two names for the same mechanism."
    ],
    correct: [0],
    explanation: "The import block is persistent, version-controlled configuration: running terraform plan shows the proposed import as part of the plan, so it can be reviewed (and even combined with config generation) before terraform apply executes it. terraform import instead performs the state update immediately from the command line, without a corresponding plan review step, and works across any provider — not just AWS."
  },
  {
    id: "t6-15", domain: 6, type: "single",
    stem: "Which command outputs the full, human-readable contents of the current state, including every resource's attributes?",
    options: [
      "terraform show",
      "terraform state list",
      "terraform output",
      "terraform graph"
    ],
    correct: [0],
    explanation: "terraform show prints a human-readable rendering of the current state (or a saved plan file, if given one). terraform state list only prints addresses, terraform output prints only declared output values, and terraform graph visualizes the dependency graph rather than showing resource attributes."
  },
  {
    id: "t6-16", domain: 6, type: "single",
    stem: "A resource needs to be removed from Terraform's state and management, but the actual infrastructure object should remain running untouched in the cloud.\n\nWhich command (or block) achieves this without destroying the real resource?",
    options: [
      "terraform state rm (or a removed block with no accompanying destroy action).",
      "terraform destroy -target, scoped to just that resource.",
      "terraform apply, after deleting the resource block from configuration.",
      "terraform taint, followed by terraform apply."
    ],
    correct: [0],
    explanation: "terraform state rm removes a resource from state bookkeeping without touching the real object; a removed block does the same thing declaratively in configuration. In contrast, both terraform destroy -target and applying after simply deleting the resource block from configuration would actually delete the real infrastructure — the opposite of what's needed here."
  },
  {
    id: "t6-17", domain: 6, type: "single",
    stem: "Since state can contain sensitive plaintext data such as database passwords, which practice is MOST important for protecting a remote state backend like an S3 bucket?",
    options: [
      "Enable encryption at rest and enforce strict access controls (bucket policies/IAM) so only authorized principals can read the state.",
      "Make the state bucket publicly readable so any team member can access it without authentication.",
      "Store the state bucket name inside the state file itself for easy reference.",
      "Disable versioning on the bucket to reduce storage costs."
    ],
    correct: [0],
    explanation: "Because state can contain secrets in plain text, the backend storing it needs encryption at rest and tight access controls limited to those who need it — the opposite of making it publicly readable. Versioning on the state bucket is actually a recommended safety net (enabling recovery from accidental corruption), not something to disable."
  }
];
