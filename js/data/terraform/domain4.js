/* Terraform Associate (004) — Domain 4: Terraform Configuration (~21% of exam) */
window.TF_DOMAIN4 = [
  {
    id: "t4-01", domain: 4, type: "single",
    stem: "What is the key difference between a resource block and a data block in Terraform?",
    options: [
      "A resource block creates and manages the lifecycle of an infrastructure object, while a data block only reads existing information without managing it.",
      "A resource block is read-only, while a data block creates infrastructure.",
      "Resource blocks can only be used with AWS, while data blocks work with any provider.",
      "There is no functional difference; the keywords are interchangeable."
    ],
    correct: [0],
    explanation: "resource blocks declare infrastructure objects that Terraform creates, updates, and destroys. data blocks fetch information about existing objects (managed by Terraform or not) so that information can be referenced elsewhere in the configuration, without Terraform taking ownership of that object's lifecycle."
  },
  {
    id: "t4-02", domain: 4, type: "single",
    stem: "A subnet resource must reference the ID of a VPC resource defined earlier in the same configuration.\n\nWhich approach is correct, and what side effect does it have?",
    options: [
      "Reference aws_vpc.main.id directly in the subnet's vpc_id argument; Terraform automatically infers an implicit dependency and creates the VPC first.",
      "Hard-code the VPC's ID as a literal string; Terraform will still detect the dependency automatically.",
      "Use a depends_on argument exclusively; direct attribute references are not supported between resources.",
      "Reference aws_vpc.main.id; this creates no dependency, so both resources are created in parallel."
    ],
    correct: [0],
    explanation: "Referencing another resource's attribute (resource_type.name.attribute) is the standard way to pass values between resources, and it automatically creates an implicit dependency, ensuring correct ordering. Hard-coding a literal ID would remove that dependency information. depends_on is reserved for dependencies Terraform cannot infer automatically, such as those without a direct attribute reference."
  },
  {
    id: "t4-03", domain: 4, type: "single",
    stem: "A resource creation order must be enforced even though no attribute of one resource is referenced by the other — the dependency exists purely due to external side effects (e.g., IAM policy propagation).\n\nWhich meta-argument should be used?",
    options: [
      "depends_on",
      "count",
      "for_each",
      "lifecycle"
    ],
    correct: [0],
    explanation: "depends_on explicitly declares a dependency that Terraform cannot infer from configuration references alone, forcing the correct creation/destruction order. count and for_each control how many instances of a resource are created, and lifecycle configures behaviors like create_before_destroy — neither expresses ordering between unrelated resources."
  },
  {
    id: "t4-04", domain: 4, type: "single",
    stem: "Given the following variable declarations and no other input, what is the effective value of instance_count?\n\n1. Default in the variable block: 1\n2. terraform.tfvars file: instance_count = 2\n3. example.auto.tfvars file: instance_count = 3\n4. Command line: terraform apply -var=\"instance_count=4\"",
    options: [
      "4, because command-line -var flags have the highest precedence.",
      "1, because the variable's default always wins.",
      "2, because terraform.tfvars is loaded last.",
      "3, because *.auto.tfvars files always override the command line."
    ],
    correct: [0],
    explanation: "Terraform's variable precedence (highest to lowest) is: command-line -var/-var-file flags, then *.auto.tfvars files (alphabetical order), then terraform.tfvars, then environment variables (TF_VAR_*), then the variable's default. The explicit -var flag on the command line wins over every file-based source."
  },
  {
    id: "t4-05", domain: 4, type: "single",
    stem: "Which environment variable naming convention allows setting the Terraform input variable named region from the shell?",
    options: [
      "TF_VAR_region",
      "TERRAFORM_region",
      "TF_region",
      "VAR_TF_region"
    ],
    correct: [0],
    explanation: "Terraform reads environment variables prefixed with TF_VAR_ followed by the variable name (e.g., TF_VAR_region) as a source of input variable values. This sits below CLI flags and tfvars files, but above the variable's own default, in the precedence order."
  },
  {
    id: "t4-06", domain: 4, type: "single",
    stem: "A team wants an input variable to only accept the strings \"dev\", \"staging\", or \"prod\", and to fail terraform plan with a clear error message if any other value is provided.\n\nWhich feature should they use?",
    options: [
      "A validation block inside the variable declaration, using a condition and error_message.",
      "A lifecycle precondition inside the resource that consumes the variable.",
      "A count expression on the variable block.",
      "Terraform variables cannot be restricted to a specific set of values."
    ],
    correct: [0],
    explanation: "Custom variable validation lets you attach a condition (e.g., contains([\"dev\",\"staging\",\"prod\"], var.environment)) and a custom error_message directly to a variable block, so invalid input is rejected early with a clear message. lifecycle pre/postconditions validate resource state, not raw input variables, and count does not apply to variable blocks."
  },
  {
    id: "t4-07", domain: 4, type: "single",
    stem: "Which output configuration ensures a value (such as a generated database password) is hidden from normal terraform plan and apply console output?",
    options: [
      "Set sensitive = true on the output block.",
      "Set private = true on the output block.",
      "Prefix the output name with an underscore.",
      "Store the output in a separate .tfvars file."
    ],
    correct: [0],
    explanation: "sensitive = true on an output (or variable) block redacts the value from CLI output, showing \"(sensitive value)\" instead. It is still stored in plaintext within the state file, so protecting the state backend remains necessary. private = true is not valid Terraform syntax, and naming conventions have no effect on output visibility."
  },
  {
    id: "t4-08", domain: 4, type: "single",
    stem: "What is the primary purpose of a locals block in Terraform configuration?",
    options: [
      "To define named, reusable expressions computed from variables or other data, reducing repetition within the configuration.",
      "To declare input values that must be supplied by the user at apply time.",
      "To expose values for other configurations or modules to consume as outputs.",
      "To define provider-specific authentication credentials."
    ],
    correct: [0],
    explanation: "Local values (locals) let you name an expression once and reuse it throughout a configuration, improving readability and reducing duplication. Unlike variables, locals are not set by the user at apply time; unlike outputs, they are not directly exposed outside the module unless explicitly wrapped in an output block."
  },
  {
    id: "t4-09", domain: 4, type: "single",
    stem: "A configuration needs to create three EC2 instances with different, individually meaningful names (\"web\", \"api\", \"worker\"), each with potentially different instance types.\n\nWhich meta-argument is the BEST fit, and why?",
    options: [
      "for_each with a map, because each instance is uniquely identified by a stable key rather than a numeric position.",
      "count = 3, because it is always preferred whenever multiple instances of a resource are needed.",
      "depends_on, because it is designed for creating multiple named resources.",
      "A dynamic block, because it repeats nested blocks within a single resource."
    ],
    correct: [0],
    explanation: "for_each over a map (or set of strings) gives each resource instance a stable, meaningful key (web, api, worker) instead of a numeric index, so adding or removing an entry doesn't shift the identity of unrelated instances. count is better suited to near-identical resources where only the quantity matters, since removing a middle element shifts every subsequent index."
  },
  {
    id: "t4-10", domain: 4, type: "single",
    stem: "A team originally provisioned three servers using count and later removed the middle element from the input list.\n\nWhat problem does this commonly cause?",
    options: [
      "Terraform shifts the index-based identity of the remaining resources, causing it to plan destroying and recreating resources that did not conceptually change.",
      "Terraform automatically converts the count block into a for_each block to fix the issue.",
      "Nothing — count-based resources are always identified by name, not index, so no resources are affected.",
      "Terraform refuses to plan until the list is restored to its original length."
    ],
    correct: [0],
    explanation: "With count, each instance's address includes a numeric index (e.g., aws_instance.web[1]). Removing an element from the middle of the list shifts every subsequent index, so Terraform sees those as different resource instances — proposing destroy/recreate even though conceptually only one server should be removed. Switching to for_each with a map avoids this because keys are stable regardless of ordering."
  },
  {
    id: "t4-11", domain: 4, type: "single",
    stem: "Inside a resource block using for_each over a map of objects, which expression accesses the current iteration's map key?",
    options: [
      "each.key",
      "each.value",
      "count.index",
      "self.key"
    ],
    correct: [0],
    explanation: "Within a for_each loop, each.key holds the current map key (or, for a set, the element value itself) and each.value holds the corresponding value. count.index is the analogous concept for the count meta-argument, and self is used only in provisioner connection blocks — not for iteration."
  },
  {
    id: "t4-12", domain: 4, type: "single",
    stem: "Which syntax correctly uses a conditional expression to set an instance_type variable to \"t3.large\" in production and \"t3.micro\" otherwise?",
    options: [
      "var.environment == \"prod\" ? \"t3.large\" : \"t3.micro\"",
      "if var.environment == \"prod\" then \"t3.large\" else \"t3.micro\"",
      "switch(var.environment, \"prod\", \"t3.large\", \"t3.micro\")",
      "var.environment == \"prod\" -> \"t3.large\" | \"t3.micro\""
    ],
    correct: [0],
    explanation: "HCL supports the standard ternary conditional syntax condition ? true_val : false_val. Terraform does not support an if/then/else keyword statement, a switch() function, or arrow syntax for conditionals within expressions."
  },
  {
    id: "t4-13", domain: 4, type: "single",
    stem: "Which expression correctly produces a list containing only the id attribute from each element of a list of resource instances created with count, using splat syntax?",
    options: [
      "aws_instance.web[*].id",
      "aws_instance.web.*.list.id",
      "aws_instance.web{*}.id",
      "list(aws_instance.web.id)"
    ],
    correct: [0],
    explanation: "The splat expression resource[*].attribute returns a list of that attribute's value across every instance of a resource created with count or for_each. The other forms are not valid HCL splat syntax."
  },
  {
    id: "t4-14", domain: 4, type: "single",
    stem: "A resource block needs to repeat a nested configuration block (such as multiple ingress rules in a security group) a variable number of times, based on a list provided as input.\n\nWhich feature is designed for this?",
    options: [
      "A dynamic block.",
      "The for_each meta-argument at the resource level.",
      "The depends_on meta-argument.",
      "A module block."
    ],
    correct: [0],
    explanation: "dynamic blocks generate repeated nested configuration blocks (like ingress or tag blocks) inside a resource, based on iterating over a list or map — something a simple resource-level for_each or count cannot do, since those operate on entire resource instances, not on nested blocks within a single resource."
  },
  {
    id: "t4-15", domain: 4, type: "single",
    stem: "Which built-in function merges two maps together, with values from the second map overriding matching keys from the first?",
    options: [
      "merge(map1, map2)",
      "concat(map1, map2)",
      "join(map1, map2)",
      "zipmap(map1, map2)"
    ],
    correct: [0],
    explanation: "merge() combines multiple maps (or objects) into one, with later arguments taking precedence on key conflicts. concat() combines lists (not maps), join() combines a list of strings into a single string with a separator, and zipmap() constructs a map from a list of keys and a list of values."
  },
  {
    id: "t4-16", domain: 4, type: "single",
    stem: "Which function renders a template file, substituting variables defined within it, and is commonly used to generate cloud-init or startup scripts?",
    options: [
      "templatefile(path, vars)",
      "file(path)",
      "jsonencode(value)",
      "format(spec, values)"
    ],
    correct: [0],
    explanation: "templatefile() reads a file and renders it as a template, interpolating the variables passed in the second argument — ideal for generating startup scripts with dynamic values. file() only reads raw file contents with no templating, jsonencode() converts a value to a JSON string, and format() does string formatting from a format specifier."
  },
  {
    id: "t4-17", domain: 4, type: "single",
    stem: "What is the purpose of the create_before_destroy lifecycle setting?",
    options: [
      "It instructs Terraform to create the replacement resource before destroying the old one, reducing downtime during a forced replacement.",
      "It prevents a resource from ever being destroyed under any circumstance.",
      "It ensures resources are always created in alphabetical order.",
      "It disables the need to run terraform apply for that resource."
    ],
    correct: [0],
    explanation: "create_before_destroy reverses the default destroy-then-create order during a forced replacement, which is useful for minimizing downtime (for example, so a load balancer target is never briefly missing an instance). prevent_destroy — a different lifecycle argument — is the one that blocks destruction entirely."
  },
  {
    id: "t4-18", domain: 4, type: "single",
    stem: "A team wants Terraform to error out and refuse to destroy a specific production database resource, even if a future configuration change or terraform destroy would otherwise remove it.\n\nWhich lifecycle argument enforces this?",
    options: [
      "prevent_destroy = true",
      "create_before_destroy = true",
      "ignore_changes = all",
      "replace_triggered_by = [\"aws_db_instance.main\"]"
    ],
    correct: [0],
    explanation: "prevent_destroy = true causes Terraform to reject any plan that would destroy that resource, acting as a safety guardrail for critical infrastructure. create_before_destroy changes replacement ordering (not whether destruction happens), ignore_changes tells Terraform to disregard drift in specific attributes, and replace_triggered_by forces replacement when a referenced value changes."
  },
  {
    id: "t4-19", domain: 4, type: "single",
    stem: "A resource's tags attribute is frequently modified outside of Terraform by an internal tagging automation tool, and the team wants terraform plan to stop reporting drift on that specific attribute.\n\nWhich lifecycle argument addresses this?",
    options: [
      "ignore_changes = [tags]",
      "prevent_destroy = true",
      "create_before_destroy = true",
      "depends_on = [\"tags\"]"
    ],
    correct: [0],
    explanation: "ignore_changes tells Terraform to disregard drift in the listed attributes when planning, useful when an external process legitimately manages certain fields. prevent_destroy blocks deletion, create_before_destroy changes replacement ordering, and depends_on does not take attribute names — it takes resource or module references."
  },
  {
    id: "t4-20", domain: 4, type: "single",
    stem: "A resource must be replaced whenever the value of a specific, unrelated resource attribute changes (e.g., an instance should be recreated whenever a referenced AMI data source's ID changes), even though that value isn't otherwise used to force replacement.\n\nWhich lifecycle argument supports this?",
    options: [
      "replace_triggered_by",
      "ignore_changes",
      "prevent_destroy",
      "create_before_destroy"
    ],
    correct: [0],
    explanation: "replace_triggered_by forces a resource to be replaced whenever a referenced value (a resource attribute or another resource entirely) changes, even if that value isn't otherwise part of the resource's own arguments. The other lifecycle arguments serve different purposes: ignoring drift, blocking deletion, and changing replacement order, respectively."
  },
  {
    id: "t4-21", domain: 4, type: "single",
    stem: "A resource block includes:\n\nlifecycle {\n  postcondition {\n    condition     = self.id != \"\"\n    error_message = \"Resource ID must not be empty.\"\n  }\n}\n\nWhen is this condition evaluated?",
    options: [
      "After the resource has been created or updated, to validate an assumption about the resulting state.",
      "Before the resource is created, to validate the input configuration only.",
      "Only during terraform destroy operations.",
      "Only when running terraform validate, never during apply."
    ],
    correct: [0],
    explanation: "A postcondition inside a resource's lifecycle block is checked after the action (create/update), validating an assumption about the resulting object using self to refer to the resource's own new attributes. A precondition, by contrast, is checked beforehand and typically validates inputs or other resources' state before the action is taken."
  },
  {
    id: "t4-22", domain: 4, type: "single",
    stem: "A team wants to pass a database password to a provider only at apply time, ensuring the raw password value is never written into the plan file or the state file.\n\nWhich Terraform feature is designed for this?",
    options: [
      "A write-only argument (write_only = true), supported by providers that implement it for sensitive inputs like passwords.",
      "A sensitive = true argument, which fully removes the value from state as well as CLI output.",
      "A locals block, which never gets persisted anywhere.",
      "The terraform console command."
    ],
    correct: [0],
    explanation: "Write-only arguments let a value be used during an operation (such as setting a password) without Terraform persisting that value into the state or plan file at all. This is a stronger guarantee than sensitive = true, which only redacts the value from CLI output but still stores it in the state file in plain text."
  },
  {
    id: "t4-23", domain: 4, type: "single",
    stem: "A configuration needs to read a rotating token from an external secrets manager at plan/apply time, use it to authenticate a single API call, and ensure the token value itself is never written to the state file.\n\nWhich relatively recent Terraform feature is designed for this use case?",
    options: [
      "Ephemeral resources and ephemeral values, which exist only during a Terraform operation and are never persisted to state or plan files.",
      "Data sources, which are always stored in full within the state file.",
      "Output values marked as sensitive, which are stored encrypted in state.",
      "The terraform import command."
    ],
    correct: [0],
    explanation: "Ephemeral resources/values (introduced in Terraform 1.10+) exist only for the duration of an operation and are deliberately excluded from state and plan storage — ideal for short-lived credentials or tokens. Regular data sources ARE persisted to state; sensitive outputs are redacted from CLI display but still stored in plaintext in state (not encrypted); and terraform import brings existing infrastructure under management, unrelated to ephemeral secrets."
  },
  {
    id: "t4-24", domain: 4, type: "multiple",
    stem: "Which of the following are valid primitive or complex type constraints that can be used in a Terraform variable's type argument? (Choose two.)",
    options: [
      "list(string)",
      "map(number)",
      "table(string)",
      "array(bool)",
      "dictionary(string)"
    ],
    correct: [0, 1],
    explanation: "Terraform supports primitive types (string, number, bool) and complex types built from them: list(...), set(...), map(...), object({...}), and tuple([...]). \"table\", \"array\", and \"dictionary\" are not Terraform type constraint keywords."
  },
  {
    id: "t4-25", domain: 4, type: "single",
    stem: "What does the following for expression produce?\n\n[for name in [\"web\", \"api\", \"db\"] : upper(name)]",
    options: [
      "A new list: [\"WEB\", \"API\", \"DB\"]",
      "A single string: \"WEBAPIDB\"",
      "A map from each name to its uppercase version",
      "An error, because for expressions cannot call functions"
    ],
    correct: [0],
    explanation: "A for expression enclosed in square brackets produces a list, applying the expression after the colon to each element of the source collection — here, upper(name) applied to each string. Wrapping the expression in curly braces with a => would instead produce a map."
  },
  {
    id: "t4-26", domain: 4, type: "single",
    stem: "Which command opens an interactive session for testing and evaluating Terraform expressions against the current state, without applying any changes?",
    options: [
      "terraform console",
      "terraform plan -interactive",
      "terraform validate -eval",
      "terraform state eval"
    ],
    correct: [0],
    explanation: "terraform console launches an interactive read-only REPL where you can evaluate expressions and functions using the current configuration and state — a useful way to experiment with a for expression or function before adding it to a configuration file. None of the other listed commands or flags exist."
  }
];
