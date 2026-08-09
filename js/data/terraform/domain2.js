/* Terraform Associate (004) — Domain 2: Terraform Fundamentals (~12% of exam) */
window.TF_DOMAIN2 = [
  {
    id: "t2-01", domain: 2, type: "single",
    stem: "What is the role of a Terraform provider?",
    options: [
      "A plugin that lets Terraform communicate with a specific platform's API to create, read, update, and delete that platform's resources.",
      "A file that stores the current state of managed infrastructure.",
      "A remote server that hosts Terraform's execution history.",
      "A block that defines the desired count of a resource."
    ],
    correct: [0],
    explanation: "Providers are plugins (such as `aws`, `azurerm`, `google`, or `kubernetes`) that translate Terraform's resource and data source blocks into calls against a specific platform's API. State files, execution logs, and the `count` meta-argument are unrelated concepts."
  },
  {
    id: "t2-02", domain: 2, type: "single",
    stem: "Which command downloads the provider plugins referenced in a configuration and prepares the working directory for use?",
    options: [
      "terraform init",
      "terraform plan",
      "terraform validate",
      "terraform apply"
    ],
    correct: [0],
    explanation: "terraform init initializes a working directory: it downloads required provider plugins and modules, and configures the backend. terraform plan and apply require initialization to have already happened, and terraform validate only checks configuration syntax and internal consistency."
  },
  {
    id: "t2-03", domain: 2, type: "single",
    stem: "A configuration block reads:\n\nterraform {\n  required_providers {\n    aws = {\n      source  = \"hashicorp/aws\"\n      version = \"~> 5.0\"\n    }\n  }\n}\n\nWhat does the version constraint \"~> 5.0\" allow?",
    options: [
      "Any 5.x version, such as 5.1 or 5.42, but not 6.0.",
      "Only exactly version 5.0 and no other version.",
      "Any version greater than or equal to 5.0, including 6.0 and beyond.",
      "Any version less than 5.0."
    ],
    correct: [0],
    explanation: "The pessimistic constraint operator ~> locks the leftmost specified component: \"~> 5.0\" allows the rightmost segment to increase (5.1, 5.2, ...) but forbids incrementing the major version (no 6.0). \"~> 5\" (without the .0) would instead allow any 5.x or later minor/major within 5.x up to but not including 6."
  },
  {
    id: "t2-04", domain: 2, type: "single",
    stem: "What is the primary purpose of Terraform's state file?",
    options: [
      "It maps real-world resources to the configuration, tracks resource metadata, and lets Terraform determine what changes are needed to reach the desired state.",
      "It stores a copy of every provider plugin used in the configuration.",
      "It contains the compiled binary that Terraform executes during apply.",
      "It stores the Git commit history of the configuration files."
    ],
    correct: [0],
    explanation: "The state file (terraform.tfstate) records which real resources correspond to which configuration blocks, along with metadata and resource dependencies. Terraform uses it to calculate the difference between desired and current state during plan/apply. It has nothing to do with provider binaries or Git history."
  },
  {
    id: "t2-05", domain: 2, type: "single",
    stem: "Why does HashiCorp recommend against manually editing a Terraform state file with a text editor?",
    options: [
      "The state file has a specific internal structure and hand-editing it risks corrupting it or creating a mismatch between state and real infrastructure that Terraform cannot safely reconcile.",
      "State files are stored in an encrypted binary format that cannot be opened in a text editor.",
      "Text editors are physically unable to open JSON files.",
      "Manually editing state automatically updates the real infrastructure to match."
    ],
    correct: [0],
    explanation: "State files use an internal JSON schema that Terraform depends on for consistency; a manual edit can easily produce an invalid or inconsistent file. Terraform provides the terraform state family of commands (mv, rm, list, show) specifically to make safe, supported modifications instead."
  },
  {
    id: "t2-06", domain: 2, type: "single",
    stem: "A configuration needs to manage AWS resources in two different regions using the same aws provider.\n\nWhich feature allows this within a single configuration?",
    options: [
      "Provider aliases, defined with the alias argument, referenced with provider = aws.alias_name on individual resources.",
      "Declaring the aws provider block twice with the same name and no distinguishing argument.",
      "Using two separate required_providers blocks in the same file.",
      "Setting a count of 2 on the provider block."
    ],
    correct: [0],
    explanation: "Provider aliasing lets you configure multiple instances of the same provider (for example, one per AWS region) and reference the specific instance a resource should use via the provider meta-argument. Providers cannot be duplicated without an alias, and count does not apply to provider blocks."
  },
  {
    id: "t2-07", domain: 2, type: "single",
    stem: "What is the purpose of the .terraform.lock.hcl file?",
    options: [
      "It records the exact provider versions and checksums selected during the last terraform init, ensuring consistent provider versions across team members and CI runs.",
      "It stores the current values of all input variables.",
      "It locks the state file so only one person can ever run Terraform against it.",
      "It contains cached copies of every past execution plan."
    ],
    correct: [0],
    explanation: "The dependency lock file pins the specific provider versions (and their checksums) that satisfy the version constraints in the configuration, so everyone on the team gets the same provider versions until the lock file is deliberately updated (e.g., via terraform init -upgrade). It is unrelated to state locking, which is a separate mechanism."
  },
  {
    id: "t2-08", domain: 2, type: "single",
    stem: "By default, where does Terraform download provider plugins from when a required_providers source is not fully qualified with a custom registry hostname?",
    options: [
      "The public Terraform Registry (registry.terraform.io).",
      "The user's local file system only.",
      "A random public GitHub repository.",
      "The AWS Systems Manager Parameter Store."
    ],
    correct: [0],
    explanation: "Unless a different registry hostname is specified in the provider source address (e.g., a private registry), Terraform resolves providers such as hashicorp/aws against the public Terraform Registry. Providers can also be sourced from local filesystem mirrors when explicitly configured, but that is not the default."
  },
  {
    id: "t2-09", domain: 2, type: "multiple",
    stem: "Which of the following are valid version constraint operators that can be used in a required_providers or module version argument? (Choose two.)",
    options: [
      ">=",
      "~>",
      "<<",
      "=/=",
      "??"
    ],
    correct: [0, 1],
    explanation: "Terraform supports comparison operators (=, !=, >, <, >=, <=) and the pessimistic constraint operator (~>) for version constraints. \"<<\", \"=/=\", and \"??\" are not valid Terraform version constraint syntax."
  },
  {
    id: "t2-10", domain: 2, type: "single",
    stem: "A team wants every engineer and every CI pipeline to use the exact same provider plugin versions until someone deliberately decides to upgrade.\n\nWhich practice ensures this?",
    options: [
      "Commit the .terraform.lock.hcl file to version control alongside the configuration.",
      "Delete the .terraform.lock.hcl file before every apply.",
      "Add the .terraform.lock.hcl file to .gitignore so it is never shared.",
      "Set a random version constraint on every provider."
    ],
    correct: [0],
    explanation: "Committing the lock file ensures terraform init resolves the same provider versions everywhere, preventing unexpected behavior changes from an unnoticed provider upgrade. Deleting or ignoring the lock file defeats its purpose and can lead to inconsistent provider versions between environments."
  },
  {
    id: "t2-11", domain: 2, type: "single",
    stem: "Which statement correctly distinguishes Terraform Core from a Terraform provider?",
    options: [
      "Terraform Core reads configuration, builds the dependency graph, and manages state, while providers implement the logic to communicate with a specific platform's API.",
      "Terraform Core and providers are the same binary with no distinction.",
      "Providers manage state files, while Terraform Core communicates with cloud APIs.",
      "Terraform Core only works with AWS, while providers add support for other clouds through paid add-ons."
    ],
    correct: [0],
    explanation: "Terraform's architecture separates the core engine (parsing HCL, building the resource graph, managing state and the plan/apply workflow) from providers, which are separate plugins responsible for translating resource operations into calls against a specific API. Providers are free and open, not paid add-ons."
  },
  {
    id: "t2-12", domain: 2, type: "single",
    stem: "A junior engineer asks whether Terraform state can contain sensitive information, such as database passwords generated by a resource.\n\nWhat is the correct answer?",
    options: [
      "Yes — state can contain sensitive values in plain text, so it must be protected with encryption at rest and strict access controls, regardless of whether outputs are marked sensitive.",
      "No — Terraform automatically encrypts all sensitive fields inside the state file so plaintext secrets are never stored.",
      "No — state files never contain resource attribute values, only resource names.",
      "Yes, but only if the provider is AWS."
    ],
    correct: [0],
    explanation: "State stores full resource attributes, including ones a provider or configuration may consider sensitive (like generated passwords), in plain text by default. Marking a variable or output as sensitive only redacts it from CLI output — it does not encrypt or remove it from the state file, so protecting the state storage backend itself is essential."
  },
  {
    id: "t2-13", domain: 2, type: "single",
    stem: "Which of the following is installed into the local .terraform directory after running terraform init in a project that uses one provider and one module from the public registry?",
    options: [
      "The downloaded provider plugin binary and a local copy of the referenced module's source code.",
      "A full backup of the target cloud account's existing infrastructure.",
      "A compiled version of the .tf configuration files.",
      "The Terraform CLI binary itself."
    ],
    correct: [0],
    explanation: "terraform init populates the .terraform directory with provider plugins and downloaded module source code so subsequent commands can run offline against those cached copies. It does not back up cloud infrastructure, compile .tf files into a binary, or install the Terraform CLI (which must already be installed to run init)."
  },
  {
    id: "t2-14", domain: 2, type: "single",
    stem: "A configuration references a module sourced from a Git repository and a provider sourced from the public Terraform Registry. The team wants to upgrade to the latest provider version that still satisfies the existing version constraint.\n\nWhich command accomplishes this?",
    options: [
      "terraform init -upgrade",
      "terraform plan -upgrade",
      "terraform validate -upgrade",
      "terraform fmt -upgrade"
    ],
    correct: [0],
    explanation: "terraform init -upgrade re-resolves provider and module version constraints, installing the newest versions that still satisfy the constraints in the configuration, and updates the lock file accordingly. plan, validate, and fmt do not accept an -upgrade flag."
  }
];
