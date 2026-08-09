/* Terraform Associate (004) — Domain 7: Maintain Infrastructure with Terraform (~9% of exam) */
window.TF_DOMAIN7 = [
  {
    id: "t7-01", domain: 7, type: "single",
    stem: "Which environment variable enables verbose logging output from Terraform, useful for troubleshooting provider or core issues?",
    options: [
      "TF_LOG",
      "TF_DEBUG",
      "TF_VERBOSE",
      "TF_TRACE_LEVEL"
    ],
    correct: [0],
    explanation: "Setting TF_LOG to a level such as TRACE, DEBUG, INFO, WARN, or ERROR enables Terraform's internal logging at that level of detail. TRACE is the most verbose and is typically used when filing a bug report or diagnosing a provider issue. The other variable names listed are not real Terraform environment variables."
  },
  {
    id: "t7-02", domain: 7, type: "single",
    stem: "A team wants Terraform's verbose logs written to a file instead of printed to the terminal, so they can attach the file to a support ticket.\n\nWhich environment variable accomplishes this, alongside TF_LOG?",
    options: [
      "TF_LOG_PATH",
      "TF_LOG_FILE",
      "TF_OUTPUT_PATH",
      "TF_LOG_DIR"
    ],
    correct: [0],
    explanation: "TF_LOG_PATH specifies a file path where log output is written when TF_LOG is also set. TF_LOG_FILE, TF_OUTPUT_PATH, and TF_LOG_DIR are not real Terraform environment variables."
  },
  {
    id: "t7-03", domain: 7, type: "single",
    stem: "Ordering the TF_LOG levels from LEAST to MOST verbose, which sequence is correct?",
    options: [
      "ERROR, WARN, INFO, DEBUG, TRACE",
      "TRACE, DEBUG, INFO, WARN, ERROR",
      "INFO, ERROR, WARN, TRACE, DEBUG",
      "DEBUG, ERROR, TRACE, INFO, WARN"
    ],
    correct: [0],
    explanation: "Terraform's log levels, from least to most detailed, are ERROR, WARN, INFO, DEBUG, and TRACE. TRACE includes the most internal detail (useful for deep debugging), while ERROR shows only critical failures."
  },
  {
    id: "t7-04", domain: 7, type: "single",
    stem: "If Terraform crashes unexpectedly during an operation, what does it typically produce to aid troubleshooting?",
    options: [
      "A crash.log file in the working directory containing a stack trace, which is useful when reporting the issue.",
      "An automatic rollback of all infrastructure to its previous state.",
      "A locked state file that can never be unlocked.",
      "An email sent automatically to HashiCorp support."
    ],
    correct: [0],
    explanation: "On a panic or crash, Terraform writes crash.log with debugging information (a stack trace) to help diagnose and report the issue. It does not automatically roll back infrastructure, permanently lock state, or notify HashiCorp on its own."
  },
  {
    id: "t7-05", domain: 7, type: "single",
    stem: "Which command visualizes the dependency graph of resources, modules, and providers in a configuration, typically piped into a tool like Graphviz for rendering?",
    options: [
      "terraform graph",
      "terraform show -graph",
      "terraform plan -graph",
      "terraform state graph"
    ],
    correct: [0],
    explanation: "terraform graph outputs the dependency graph in DOT format, which can be rendered visually with Graphviz or similar tools — helpful for understanding complex ordering and dependencies. There is no -graph flag on show or plan, and terraform state graph is not a real subcommand."
  },
  {
    id: "t7-06", domain: 7, type: "single",
    stem: "An engineer needs to inspect the current attribute values of a single resource already tracked in state, without printing the entire state file.\n\nWhich command should they use?",
    options: [
      "terraform state show <resource_address>",
      "terraform state list",
      "terraform output <resource_address>",
      "terraform plan -target=<resource_address>"
    ],
    correct: [0],
    explanation: "terraform state show <address> prints the detailed attributes of one specific resource instance from state. terraform state list only prints addresses (no attributes), terraform output only returns declared output values, and terraform plan -target computes a plan rather than displaying current attribute values."
  },
  {
    id: "t7-07", domain: 7, type: "single",
    stem: "Historically, terraform taint was used to mark a resource for forced recreation on the next apply. What is the currently recommended way to achieve the same result?",
    options: [
      "terraform apply -replace=<resource_address>",
      "terraform destroy -target followed by a manual re-import",
      "Manually editing the resource's id field in the state file",
      "terraform state rm followed immediately by terraform apply with no other changes"
    ],
    correct: [0],
    explanation: "terraform taint is deprecated in favor of the -replace flag on plan or apply, which explicitly forces replacement of a specific resource as part of a reviewable plan, without needing a separate state-mutating command beforehand. Editing state by hand or removing/reapplying resources are unsupported, risky workarounds."
  },
  {
    id: "t7-08", domain: 7, type: "single",
    stem: "A configuration's provider is misbehaving in a way that only appears during the apply phase (not during plan). Which logging approach specifically targets provider-level communication, separate from Terraform Core's own logs?",
    options: [
      "Setting TF_LOG_PROVIDER, in addition to or instead of TF_LOG, to scope verbose logging to provider plugin communication.",
      "Deleting the provider plugin and reinstalling it always fixes provider-specific bugs.",
      "There is no way to isolate provider logs from core logs.",
      "Running terraform plan -provider-debug."
    ],
    correct: [0],
    explanation: "TF_LOG_CORE and TF_LOG_PROVIDER let you scope verbose logging independently to Terraform's core engine versus the provider plugin's own communication, which helps narrow down whether an issue originates in core logic or in a specific provider. There is no -provider-debug flag on plan, and reinstalling a provider is not a guaranteed fix for a logic bug."
  },
  {
    id: "t7-09", domain: 7, type: "single",
    stem: "When should an engineer generally prefer terraform state commands (like state mv or state rm) over modifying the configuration and running a full apply?",
    options: [
      "When the goal is only to correct Terraform's bookkeeping (state) to match reality — such as a rename or removing a resource from management — without any change intended to the real infrastructure itself.",
      "Whenever any change at all is needed, since terraform apply should never be used for infrastructure changes.",
      "Only when the team has disabled remote state locking.",
      "state commands should never be used; only configuration changes followed by apply are supported."
    ],
    correct: [0],
    explanation: "terraform state subcommands are for surgical bookkeeping corrections — reconciling what Terraform believes about a resource's address or management status — without touching real infrastructure. Ordinary infrastructure changes (create, update, destroy) should go through the standard plan/apply workflow so they're reviewed and reflect an intentional change to configuration."
  },
  {
    id: "t7-10", domain: 7, type: "single",
    stem: "A resource was accidentally deleted outside of Terraform (for example, manually in the cloud console). What will terraform plan report on the next run, assuming no configuration changes were made?",
    options: [
      "Terraform will detect that the resource no longer exists during refresh and propose creating it again to match the configuration.",
      "Terraform will silently remove the resource from state with no other action.",
      "Terraform will crash because the resource cannot be found.",
      "Terraform will ignore the missing resource entirely until the next terraform destroy."
    ],
    correct: [0],
    explanation: "During the refresh step, Terraform detects that a previously tracked resource no longer exists and will typically plan to recreate it, since the configuration still declares it should exist. This is a common and expected way that drift caused by external deletion surfaces during the normal plan/apply workflow."
  }
];
