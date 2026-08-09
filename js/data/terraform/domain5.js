/* Terraform Associate (004) — Domain 5: Terraform Modules (~11% of exam) */
window.TF_DOMAIN5 = [
  {
    id: "t5-01", domain: 5, type: "single",
    stem: "What is a Terraform \"root module\"?",
    options: [
      "The configuration in the main working directory where terraform commands like plan and apply are run, which may call other modules.",
      "The very first module ever published to the Terraform Registry.",
      "A module that has no input variables.",
      "A module that can only be used by AWS resources."
    ],
    correct: [0],
    explanation: "The root module is simply the configuration files in the directory Terraform is invoked from. It can stand alone or call other (child) modules to compose more complex infrastructure. The other definitions do not describe any real Terraform concept."
  },
  {
    id: "t5-02", domain: 5, type: "single",
    stem: "A module block includes the following source argument:\n\nsource = \"terraform-aws-modules/vpc/aws\"\n\nWhere will Terraform look for this module by default?",
    options: [
      "The public Terraform Registry, resolving the shorthand as namespace/name/provider.",
      "A local relative path on the filesystem.",
      "A private module registry configured in required_providers.",
      "An S3 bucket named terraform-aws-modules."
    ],
    correct: [0],
    explanation: "A source string without a leading ./ or ../ and matching the <NAMESPACE>/<NAME>/<PROVIDER> pattern is resolved against the public Terraform Registry by default (or a private registry if a hostname is prefixed, e.g. app.terraform.io/namespace/name/provider). Local paths must begin with ./ or ../ to be recognized as filesystem sources."
  },
  {
    id: "t5-03", domain: 5, type: "single",
    stem: "Which module source prefix tells Terraform to treat the source as a path on the local filesystem rather than a registry address?",
    options: [
      "A leading ./ or ../",
      "A leading http://",
      "A leading git::",
      "A leading registry://"
    ],
    correct: [0],
    explanation: "Local paths must start with ./ or ../ — this is what distinguishes a filesystem module from a registry shorthand address. git::, generic HTTP URLs, and registry-style addresses are all valid alternative module source types, but a bare path without ./ is interpreted as a registry address, not a local path."
  },
  {
    id: "t5-04", domain: 5, type: "multiple",
    stem: "Which of the following are valid ways to source a Terraform module? (Choose two.)",
    options: [
      "A local relative path, such as \"./modules/network\"",
      "A Terraform Registry address, such as \"hashicorp/consul/aws\"",
      "A JSON schema file",
      "An environment variable containing HCL",
      "A compiled provider binary"
    ],
    correct: [0, 1],
    explanation: "Terraform can source modules from local paths, the public or a private Terraform Registry, generic Git repositories, Mercurial repositories, HTTP URLs, and cloud storage buckets (S3, GCS). JSON schema files, environment variables, and provider binaries are not valid module sources."
  },
  {
    id: "t5-05", domain: 5, type: "single",
    stem: "A root module calls a child module and needs to use a value the child module computed internally.\n\nHow does the root module access that value?",
    options: [
      "The child module must expose the value through an output block, and the root module references it as module.<module_name>.<output_name>.",
      "The root module can reference any local value inside the child module directly, without the child exposing anything.",
      "Values automatically flow from child modules to the root module without any configuration.",
      "The root module must use a data source to query the child module's internal state."
    ],
    correct: [0],
    explanation: "A module's outputs form its public interface for returning values to its caller. Locals and resource attributes inside a child module are not accessible from outside unless the module author explicitly exposes them via output blocks, referenced from the caller as module.name.output_name."
  },
  {
    id: "t5-06", domain: 5, type: "single",
    stem: "Which statement about variable scope in Terraform modules is correct?",
    options: [
      "A child module cannot see the root module's local values or variables unless the root module explicitly passes them in as the child module's own input variables.",
      "All locals and variables in the root module are automatically visible inside every child module.",
      "Variables defined in a child module are automatically visible in the root module without being declared as outputs.",
      "Modules share a single global variable namespace across the entire configuration."
    ],
    correct: [0],
    explanation: "Each module has its own local namespace. A child module only receives what the caller explicitly passes as arguments matching its declared input variables — there is no implicit visibility into the caller's locals or variables, and no shared global namespace across modules."
  },
  {
    id: "t5-07", domain: 5, type: "single",
    stem: "A configuration calls a module sourced from the public Terraform Registry and wants to pin it to a specific, tested release, while allowing patch-level upgrades automatically.\n\nWhich module block argument and value accomplish this?",
    options: [
      "version = \"~> 2.1.0\"",
      "source_version = \"2.1.0\"",
      "release = \"latest\"",
      "Modules sourced from the registry cannot be version-pinned."
    ],
    correct: [0],
    explanation: "The version argument on a module block accepts the same constraint syntax as provider versions. \"~> 2.1.0\" allows patch upgrades (2.1.1, 2.1.2...) but not 2.2.0. Note that version constraints only apply to registry-sourced modules — modules sourced via a local path or a direct Git URL are pinned by path or Git ref instead, not by a version argument."
  },
  {
    id: "t5-08", domain: 5, type: "single",
    stem: "A module is sourced directly from a Git repository, rather than the Terraform Registry:\n\nsource = \"git::https://example.com/modules/network.git?ref=v1.2.0\"\n\nHow is this module version pinned?",
    options: [
      "By the ref query parameter, which points to a specific Git tag, branch, or commit — the module block's version argument is not used for Git sources.",
      "By adding a version argument alongside the source argument.",
      "Git-sourced modules cannot be pinned to a specific revision.",
      "By the .terraform.lock.hcl file, exactly as with providers."
    ],
    correct: [0],
    explanation: "For non-registry sources like Git, HTTP, or S3, there is no module registry versioning — instead, you pin to a specific revision using source-specific mechanisms, such as the ref query parameter for Git. The version argument is only meaningful for registry module sources."
  },
  {
    id: "t5-09", domain: 5, type: "single",
    stem: "According to Terraform Registry naming conventions, what is the required GitHub repository naming pattern for a publicly published module?",
    options: [
      "terraform-<PROVIDER>-<NAME>",
      "<NAME>-terraform-<PROVIDER>",
      "tf_<PROVIDER>_<NAME>_module",
      "module-<NAME>-<PROVIDER>"
    ],
    correct: [0],
    explanation: "The public Terraform Registry requires module repositories to follow the terraform-<PROVIDER>-<NAME> naming pattern (for example, terraform-aws-vpc) in order to be automatically discovered and published. Any other naming pattern will not be recognized by the registry's publishing flow."
  },
  {
    id: "t5-10", domain: 5, type: "single",
    stem: "Why is breaking infrastructure configuration into small, focused, reusable modules generally considered a best practice?",
    options: [
      "It improves reusability and maintainability, letting teams compose well-tested building blocks instead of duplicating similar configuration across many projects.",
      "It is required by Terraform; configurations with more than one resource must use a module.",
      "It eliminates the need to ever run terraform plan.",
      "It automatically improves the performance of provider API calls."
    ],
    correct: [0],
    explanation: "Modules encapsulate a piece of infrastructure behind a clear input/output interface, allowing teams to reuse and version proven patterns (like a standard VPC or a standard web app deployment) instead of copy-pasting configuration. Module use is a best practice, not a hard requirement, and has no effect on API call performance or the need to plan."
  },
  {
    id: "t5-11", domain: 5, type: "single",
    stem: "By default, how does a provider configuration in the root module relate to providers used within a child module?",
    options: [
      "Provider configurations are implicitly inherited by child modules that do not declare their own, as long as they don't require a specific alias.",
      "Every child module must always declare and configure its own separate copy of every provider it uses.",
      "Child modules cannot use any provider that isn't hard-coded directly inside the child module itself.",
      "Provider inheritance was removed entirely starting in Terraform 0.12."
    ],
    correct: [0],
    explanation: "By default, a child module inherits the default (unaliased) provider configuration from its caller, so it does not need to declare its own provider block for straightforward cases. When a module needs to use a specific aliased provider configuration, the caller must explicitly pass it using the module's providers argument, and the module must declare configuration_aliases in its required_providers block."
  },
  {
    id: "t5-12", domain: 5, type: "single",
    stem: "A child module needs to use a specific aliased provider configuration (for example, a second AWS region) that the caller supplies, rather than only the default provider.\n\nWhich mechanism enables this?",
    options: [
      "The module declares configuration_aliases in its required_providers block, and the caller passes the aliased provider explicitly via the module's providers argument.",
      "The child module automatically detects and uses every aliased provider defined anywhere in the root module.",
      "Aliased providers can never be used inside child modules, only in the root module.",
      "The child module hard-codes the alias name directly inside a resource block's provider argument, with no coordination needed from the caller."
    ],
    correct: [0],
    explanation: "To use a specific provider alias inside a module, the module author must declare configuration_aliases for that provider in required_providers, and the caller must explicitly map the alias using the providers argument on the module block. This explicit passing is required — modules do not automatically discover every alias defined in the root."
  },
  {
    id: "t5-13", domain: 5, type: "single",
    stem: "What happens if a required input variable of a child module is not given a value by the calling configuration and has no default value in the module's variable block?",
    options: [
      "Terraform reports an error indicating the required variable is missing before any plan can be generated.",
      "Terraform silently sets the variable to null and proceeds without error.",
      "Terraform automatically prompts the module's original author for a value.",
      "The module simply skips any resource that references the missing variable."
    ],
    correct: [0],
    explanation: "A variable with no default is required; Terraform will error out during initialization/plan if the caller does not supply a value for it. This is a deliberate safeguard against accidentally omitting configuration that the module depends on."
  }
];
