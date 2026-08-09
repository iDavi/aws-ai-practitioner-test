/* Terraform Associate (004) — Domain 3: Core Terraform Workflow (~14% of exam) */
window.TF_DOMAIN3 = [
  {
    id: "t3-01", domain: 3, type: "single",
    stem: "What is the correct order of the core Terraform workflow for a brand-new configuration?",
    options: [
      "terraform init → terraform plan → terraform apply",
      "terraform apply → terraform init → terraform plan",
      "terraform plan → terraform init → terraform apply",
      "terraform validate → terraform apply → terraform init"
    ],
    correct: [0],
    explanation: "The standard workflow initializes the working directory first (downloading providers/modules and configuring the backend), then generates an execution plan, then applies it. Running plan or apply before init will fail because providers are not yet installed."
  },
  {
    id: "t3-02", domain: 3, type: "single",
    stem: "What does terraform validate check?",
    options: [
      "That the configuration is syntactically valid and internally consistent, such as correct argument types and referenced values that exist — without contacting any remote APIs.",
      "That the AWS credentials configured on the machine are valid and have sufficient permissions.",
      "That the real infrastructure matches the current state file.",
      "That the configuration will not incur any cloud costs when applied."
    ],
    correct: [0],
    explanation: "terraform validate performs a static, offline check for syntax errors and internal consistency (e.g., an argument that doesn't exist on a resource type). It does not verify cloud credentials, check drift against real infrastructure, or estimate cost — those require plan/apply or additional tooling."
  },
  {
    id: "t3-03", domain: 3, type: "single",
    stem: "In terraform plan output, what does a resource line prefixed with a tilde (~) indicate?",
    options: [
      "The resource will be updated in place.",
      "The resource will be created.",
      "The resource will be destroyed.",
      "The resource will be destroyed and then re-created."
    ],
    correct: [0],
    explanation: "Plan output uses symbols to summarize actions: + create, - destroy, ~ update in place, and -/+ destroy and re-create. A ~ means the provider can apply the change to the existing resource without replacing it."
  },
  {
    id: "t3-04", domain: 3, type: "single",
    stem: "In terraform plan output, what does the symbol combination -/+ next to a resource mean?",
    options: [
      "The resource will be destroyed and then re-created, because a changed argument cannot be updated in place.",
      "The resource will only be updated in place with no downtime.",
      "The resource is unchanged and will be skipped.",
      "The resource will be imported into state without any API calls."
    ],
    correct: [0],
    explanation: "-/+ indicates a forced replacement: the changed argument requires destroying the existing resource and creating a new one, because the provider does not support updating that attribute in place (this is defined per-attribute by the provider's schema)."
  },
  {
    id: "t3-05", domain: 3, type: "single",
    stem: "A team wants to guarantee that the exact set of changes reviewed in a plan is what gets applied, with no possibility of the plan changing between review and execution.\n\nWhich approach achieves this?",
    options: [
      "Run terraform plan -out=tfplan to save the plan to a file, then run terraform apply tfplan to apply that exact saved plan.",
      "Run terraform apply and manually type \"yes\" quickly after reviewing the output.",
      "Run terraform plan twice and compare the output visually.",
      "Run terraform apply -auto-approve immediately after terraform plan."
    ],
    correct: [0],
    explanation: "Saving a plan to a file with -out and applying that specific file guarantees Terraform executes exactly the reviewed changes, rather than re-computing a fresh plan at apply time (which could differ if the target infrastructure changed in the meantime). Typing \"yes\" quickly or using -auto-approve does not provide this guarantee."
  },
  {
    id: "t3-06", domain: 3, type: "single",
    stem: "What does running terraform apply without a previously saved plan file do?",
    options: [
      "It generates a new execution plan and, after interactive confirmation (unless -auto-approve is used), applies it.",
      "It refuses to run unless a plan file is explicitly provided.",
      "It always destroys all resources currently in state.",
      "It only updates the state file without contacting the provider APIs."
    ],
    correct: [0],
    explanation: "terraform apply can be run directly: it computes a plan on the fly and prompts for confirmation before making changes, unless -auto-approve skips that prompt. It is not required to reference a saved plan file, and it does not default to destroying resources."
  },
  {
    id: "t3-07", domain: 3, type: "single",
    stem: "Which command rewrites Terraform configuration files to follow the canonical formatting style (consistent indentation and alignment)?",
    options: [
      "terraform fmt",
      "terraform validate",
      "terraform plan",
      "terraform graph"
    ],
    correct: [0],
    explanation: "terraform fmt automatically reformats .tf files to HashiCorp's standard style. validate checks correctness (not style), plan computes changes, and graph visualizes the dependency graph — none of them rewrite file formatting."
  },
  {
    id: "t3-08", domain: 3, type: "single",
    stem: "A pipeline needs to run terraform apply without any interactive prompts, since no human is present to type \"yes\".\n\nWhich flag accomplishes this?",
    options: [
      "-auto-approve",
      "-no-color",
      "-input=false",
      "-refresh=false"
    ],
    correct: [0],
    explanation: "-auto-approve skips the interactive approval prompt, applying the plan immediately — essential for unattended CI/CD pipelines. -no-color only disables colored output, -input=false disables interactive prompts for missing variable values (a different kind of prompt), and -refresh=false skips refreshing state before planning."
  },
  {
    id: "t3-09", domain: 3, type: "single",
    stem: "What is the purpose of terraform destroy?",
    options: [
      "It destroys all resources currently tracked in the Terraform state for the working directory (or workspace).",
      "It deletes the local .tf configuration files from disk.",
      "It removes only the Terraform state file, leaving the real infrastructure untouched.",
      "It uninstalls the Terraform CLI from the machine."
    ],
    correct: [0],
    explanation: "terraform destroy plans and executes the deletion of every resource managed in the current state, after confirmation. It does not touch your local .tf files, does not merely delete the state file (that would orphan real resources), and has nothing to do with the CLI installation."
  },
  {
    id: "t3-10", domain: 3, type: "single",
    stem: "An engineer runs terraform plan -target=aws_instance.web to preview a change to just one resource.\n\nWhy does HashiCorp recommend against using -target as part of routine, everyday workflow?",
    options: [
      "It produces a partial plan that ignores the rest of the configuration's dependencies, which can leave the overall infrastructure in an inconsistent state relative to the full configuration.",
      "The -target flag has been completely removed from Terraform and no longer exists.",
      "-target automatically deletes all untargeted resources.",
      "-target can only be used with the terraform destroy command."
    ],
    correct: [0],
    explanation: "-target is meant as an exceptional tool for recovering from specific error scenarios, not routine use. Because it excludes the rest of the configuration from consideration, it can produce plans that don't reflect the true, full state of dependencies, potentially causing drift or later surprises. It still exists in current Terraform versions and works with both plan and apply, not just destroy."
  },
  {
    id: "t3-11", domain: 3, type: "single",
    stem: "What does a refresh-only plan (terraform plan -refresh-only) do?",
    options: [
      "It updates the state file to match real-world infrastructure without proposing any changes to that infrastructure, letting you review detected drift before deciding how to act on it.",
      "It creates any resources that are missing from the real infrastructure.",
      "It permanently disables state refreshing for all future plan and apply operations.",
      "It deletes resources that have drifted from their configuration."
    ],
    correct: [0],
    explanation: "A refresh-only plan reconciles the recorded state with the actual infrastructure and shows what drifted, without generating any create/update/destroy actions against the infrastructure itself. It is a safe way to inspect drift before deciding on a remediation approach (such as updating the configuration or reverting the drift manually)."
  },
  {
    id: "t3-12", domain: 3, type: "single",
    stem: "An engineer runs terraform apply twice in a row against the same configuration and target infrastructure, with no changes made to either in between.\n\nWhat should happen on the second run?",
    options: [
      "Terraform reports no changes needed, since the infrastructure already matches the desired state (idempotency).",
      "Terraform creates a duplicate copy of every resource.",
      "Terraform automatically destroys and recreates every resource to be safe.",
      "The second apply fails with an error because the resources already exist."
    ],
    correct: [0],
    explanation: "Because Terraform's workflow is idempotent, applying an unchanged configuration against infrastructure that already matches it results in \"No changes. Your infrastructure matches the configuration.\" It does not duplicate, forcibly recreate, or error out on resources it already manages."
  },
  {
    id: "t3-13", domain: 3, type: "single",
    stem: "Which environment variable, when set, causes Terraform to skip prompting for any input variable that lacks a default value and was not supplied another way?",
    options: [
      "TF_IN_AUTOMATION does not do this by itself; the correct mechanism is the CLI flag -input=false.",
      "TF_LOG=DEBUG",
      "TF_VAR_input",
      "TF_CLI_ARGS=-quiet"
    ],
    correct: [0],
    explanation: "The -input=false flag (or setting the equivalent behavior in automation) tells Terraform not to prompt interactively for missing variable values, which is required in non-interactive CI/CD contexts — a run should instead fail fast if a required variable is missing. TF_LOG controls logging verbosity, TF_VAR_ sets a specific variable's value, and TF_CLI_ARGS injects default CLI arguments but -quiet is not a real Terraform flag."
  },
  {
    id: "t3-14", domain: 3, type: "single",
    stem: "During terraform plan, Terraform normally performs an implicit refresh to compare real infrastructure against the last-known state before computing the diff.\n\nWhich flag skips this refresh step?",
    options: [
      "-refresh=false",
      "-refresh-only",
      "-lock=false",
      "-compact-warnings"
    ],
    correct: [0],
    explanation: "-refresh=false tells plan or apply to skip reconciling state with real infrastructure before computing changes, which can speed up runs when you're confident state is already current — though it risks planning against stale data. -refresh-only does the opposite (only refreshes, without proposing changes); -lock=false disables state locking; -compact-warnings only affects how warnings are displayed."
  },
  {
    id: "t3-15", domain: 3, type: "single",
    stem: "A configuration has been changed to remove a resource block entirely (not just modify it). What will terraform plan show for that resource?",
    options: [
      "The resource will be marked for destruction (-), since it is tracked in state but no longer exists in configuration.",
      "The resource will be marked for creation (+).",
      "Terraform will ignore the removed block and leave the resource untouched.",
      "Terraform will refuse to plan until the block is restored."
    ],
    correct: [0],
    explanation: "When a resource exists in state but its configuration block has been deleted, Terraform proposes destroying that resource to reconcile state with the (now smaller) configuration. To remove a resource from Terraform's management without destroying the real infrastructure, you would instead use a removed block or terraform state rm."
  },
  {
    id: "t3-16", domain: 3, type: "single",
    stem: "Which statement about terraform validate versus terraform plan is correct?",
    options: [
      "terraform validate only checks the configuration itself offline, while terraform plan additionally contacts provider APIs to compare configuration against real infrastructure.",
      "terraform validate and terraform plan are exactly equivalent and interchangeable.",
      "terraform validate requires valid cloud credentials, while terraform plan does not.",
      "terraform plan never requires the working directory to be initialized, while terraform validate does."
    ],
    correct: [0],
    explanation: "validate is a fast, local syntax and consistency check that does not need provider credentials. plan goes further: it refreshes state by querying the actual infrastructure (through provider APIs) and computes the full set of proposed changes — which does require valid credentials and an initialized working directory (as does validate, for provider schema information)."
  }
];
