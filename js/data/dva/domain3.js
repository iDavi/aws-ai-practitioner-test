/* AWS Certified Developer – Associate (DVA-C02)
 * Domain 3: Deployment (24% of the exam)
 * Artifact preparation, testing in dev environments, and deploying with
 * CloudFormation/SAM, CodeBuild, CodeDeploy, CodePipeline, and Elastic Beanstalk.
 */
window.DVA_DOMAIN3 = [
  {
    id: "dva3-01", domain: 3, type: "single",
    stem: "A CloudFormation template creates an EC2 instance and an Elastic IP address. The developer needs the template's Outputs section to expose the instance's public DNS name and the security group's group ID.\n\nWhich intrinsic functions are appropriate?",
    options: [
      "Fn::GetAtt for the instance's PublicDnsName, and Ref for the security group, since Ref on an AWS::EC2::SecurityGroup returns its group ID.",
      "Ref for both, since Ref always returns the physical resource identifier and all its attributes.",
      "Fn::GetAtt for both, since Ref can only be used inside the Parameters section.",
      "Fn::ImportValue for both, since Outputs must import values before exporting them."
    ],
    correct: [0],
    explanation: "Correct — Ref returns a single default value whose meaning depends on the resource type (for a security group it is the group ID; for an EC2 instance it is the instance ID; for a parameter it is the parameter's value). Anything beyond that default requires Fn::GetAtt, which is how you reach PublicDnsName.\n\nWhy the others are wrong:\n• \"Ref returns all attributes\": Ref returns exactly one value. The resource's documentation page lists what Ref returns and what GetAtt supports.\n• \"Ref only works in Parameters\": Ref works on both parameters and resources throughout the template.\n• Fn::ImportValue: this consumes a value another stack exported. It is for cross-stack references, not for reading attributes of a resource in the same template.\n\nRule to remember: when unsure, check the resource type's \"Return values\" documentation. The exam frequently tests whether a given piece of information comes from Ref or GetAtt."
  },
  {
    id: "dva3-02", domain: 3, type: "single",
    stem: "A CloudFormation stack containing a production RDS database must be deletable without losing data. The team wants a final backup taken automatically if the stack is deleted.\n\nWhich attribute should be set on the database resource?",
    options: [
      "DeletionPolicy with a value of Snapshot.",
      "DeletionPolicy with a value of Retain.",
      "UpdateReplacePolicy with a value of Snapshot.",
      "A Condition that prevents the resource from being deleted."
    ],
    correct: [0],
    explanation: "Correct — DeletionPolicy: Snapshot tells CloudFormation to take a final snapshot before deleting the resource. It is supported for resource types that have snapshots, including RDS DB instances and clusters, ElastiCache, Redshift, and EBS volumes.\n\nWhy the others are wrong:\n• Retain: this leaves the database running and removes it from the stack's management. That preserves data too, but it does not produce a backup and it leaves an orphaned resource still costing money — the question asks specifically for an automatic final backup.\n• UpdateReplacePolicy: Snapshot: this covers a different event. It applies when a stack update requires replacing the resource, not when the stack is deleted. Setting both is good practice, but alone it does not cover deletion.\n• A Condition: conditions decide whether a resource is created at all, based on parameters. They cannot block deletion.\n\nRule to remember: DeletionPolicy = stack deletion. UpdateReplacePolicy = replacement during an update. Values are Delete (default for most), Retain, and Snapshot where supported. For blanket protection, enable stack-level termination protection."
  },
  {
    id: "dva3-03", domain: 3, type: "single",
    stem: "A developer must preview exactly which resources a CloudFormation stack update will add, modify, or replace before applying it to production.\n\nWhich feature provides this?",
    options: [
      "Create a change set and review the proposed actions, including whether a modification requires replacement.",
      "Run drift detection on the stack to compare the template with actual resource state.",
      "Enable stack termination protection and update the stack in a test account first.",
      "Use the CloudFormation Designer to visualize the template's resource graph."
    ],
    correct: [0],
    explanation: "Correct — a change set is a dry run. CloudFormation compares the proposed template and parameters against the current stack and reports each action (Add, Modify, Remove) plus, critically, the Replacement field showing True, False, or Conditional. Seeing that a database is about to be replaced before executing the change is exactly what change sets are for.\n\nWhy the others are wrong:\n• Drift detection: this compares deployed resources against the stack's expected configuration to find out-of-band changes. It looks at the past, not at a proposed future update.\n• Termination protection plus a test account: testing elsewhere is good practice but does not preview this stack's update, and termination protection only guards against deletion.\n• Designer: a visual template editor. It shows structure, not the impact of an update.\n\nRule to remember: some property changes trigger replacement — a new physical resource is created and the old one deleted, meaning data loss and a new identifier. Always inspect the Replacement column of a change set before touching stateful resources."
  },
  {
    id: "dva3-04", domain: 3, type: "single",
    stem: "A CloudFormation template launches EC2 instances that run a lengthy bootstrap script. The stack reports CREATE_COMPLETE before the application is actually ready, causing dependent resources to fail.\n\nWhich mechanism makes CloudFormation wait for the application to signal readiness?",
    options: [
      "Add a CreationPolicy to the instance and have the bootstrap script call cfn-signal on success.",
      "Add a DependsOn attribute to the dependent resources so they wait for the instance.",
      "Increase the stack's timeout in the CloudFormation console settings.",
      "Add an UpdatePolicy to the instance so CloudFormation monitors the bootstrap process."
    ],
    correct: [0],
    explanation: "Correct — by default CloudFormation considers an EC2 instance created as soon as it launches, not when its software is running. A CreationPolicy with a ResourceSignal makes CloudFormation wait for a specific number of success signals within a timeout, and cfn-signal (run at the end of the bootstrap) sends them. Failure or timeout rolls the stack back.\n\nWhy the others are wrong:\n• DependsOn: it only orders resource creation. The dependent resource still starts as soon as the instance resource is CREATE_COMPLETE, which is precisely the moment that is too early.\n• Stack timeout: this bounds how long the whole operation may take. It does not add a readiness check.\n• UpdatePolicy: it governs how updates to Auto Scaling groups, Lambda aliases, and a few other resources are rolled out. It does not apply to initial creation.\n\nRule to remember: CreationPolicy with cfn-signal is the modern approach; the older WaitCondition plus WaitConditionHandle pair does the same thing and still appears in exam questions. For Auto Scaling groups, UpdatePolicy with AutoScalingRollingUpdate controls batch size and signal counts during updates."
  },
  {
    id: "dva3-05", domain: 3, type: "single",
    stem: "A team maintains a networking stack and several application stacks. The application stacks need the VPC ID and subnet IDs produced by the networking stack, and those values must be protected from accidental deletion while in use.\n\nWhich approach is appropriate?",
    options: [
      "Export the values from the networking stack's Outputs and consume them with Fn::ImportValue, which blocks deletion of an exported value while another stack imports it.",
      "Use nested stacks, making the networking stack a child of each application stack.",
      "Copy the VPC and subnet IDs into each application stack as parameter default values.",
      "Use StackSets to replicate the networking resources into each application stack."
    ],
    correct: [0],
    explanation: "Correct — cross-stack references are built for exactly this: independently managed stacks with different lifecycles sharing values. CloudFormation enforces the dependency, refusing to delete or modify an exported output while another stack imports it, which is the protection the question asks for.\n\nWhy the others are wrong:\n• Nested stacks: nesting means the child is owned by the parent and shares its lifecycle. Each application stack would create its own copy of the network, which is not what shared infrastructure means. Nested stacks are for reusable components (a standard bucket, a standard ALB), not for shared singletons.\n• Copying IDs as defaults: this is manual, silently goes stale, and CloudFormation cannot enforce any dependency.\n• StackSets: they deploy the same stack across multiple accounts and Regions. That is a distribution mechanism, not a way to share one VPC's outputs.\n\nRule to remember: nested stacks = composition and reuse within one lifecycle. Cross-stack exports = sharing across independent lifecycles. The trade-off with exports is rigidity — you cannot change an exported value while it is imported."
  },
  {
    id: "dva3-06", domain: 3, type: "single",
    stem: "A SAM template defines a Lambda function with AutoPublishAlias set to live and a DeploymentPreference of type Canary10Percent5Minutes.\n\nWhat happens on the next deployment?",
    options: [
      "SAM publishes a new version and uses CodeDeploy to shift 10% of the alias traffic to it for 5 minutes, then shifts the remaining 90%, rolling back automatically if an alarm triggers.",
      "SAM deploys the new code to $LATEST and keeps the alias pointing at the previous version until an operator promotes it manually.",
      "SAM creates a second Lambda function and configures API Gateway to split traffic between the two functions.",
      "SAM deploys the new version immediately and retains the old version for 5 minutes so it can be restored manually."
    ],
    correct: [0],
    explanation: "Correct — AutoPublishAlias makes SAM publish an immutable version on every deployment and point the named alias at it. DeploymentPreference hands the cutover to CodeDeploy, which shifts traffic using Lambda alias weighted routing on the configured schedule and rolls back if any alarm in the Alarms list enters ALARM state. You can also attach BeforeAllowTraffic and AfterAllowTraffic validation hooks.\n\nWhy the others are wrong:\n• Manual promotion: the whole point of the deployment preference is that the shift is automatic and gradual.\n• A second function with API Gateway splitting: traffic shifting happens at the Lambda alias level, not by duplicating functions. API Gateway keeps pointing at the same alias throughout.\n• Immediate deployment with a 5-minute retention window: this describes an all-at-once deployment. The canary configuration explicitly avoids that.\n\nRule to remember: the built-in configurations are Canary10Percent5Minutes / 10Minutes / 15Minutes / 30Minutes (two steps), Linear10PercentEvery1Minute through Every10Minutes (equal increments), and AllAtOnce. Canary = small taste then everything; Linear = steady equal steps."
  },
  {
    id: "dva3-07", domain: 3, type: "single",
    stem: "A developer wants to test a SAM application's API and Lambda functions locally before deploying, including the API Gateway routing behaviour.\n\nWhich command should be used?",
    options: [
      "sam local start-api, which runs a local HTTP server that emulates API Gateway and invokes the functions in Docker containers.",
      "sam deploy --guided with a local stack name, which provisions the application in a local emulator.",
      "sam validate, which executes the functions against the template's declared events.",
      "sam package, which builds a local container image that serves the API."
    ],
    correct: [0],
    explanation: "Correct — sam local start-api reads the template's API events, starts a local endpoint on port 3000, and invokes the corresponding function in a Docker container that mimics the Lambda runtime. Its siblings are sam local invoke (a single function with an event payload) and sam local start-lambda (a local Lambda service endpoint that the AWS SDK can call).\n\nWhy the others are wrong:\n• sam deploy --guided: this deploys to real AWS, prompting for stack name, Region, and confirmations. There is no local deployment target.\n• sam validate: it checks the template's syntax and structure against the SAM specification. It runs no code.\n• sam package: it uploads local artifacts to S3 and rewrites the template with the resulting URIs, preparing for deployment. In modern workflows sam deploy does this automatically.\n\nRule to remember: local emulation covers the runtime and basic event shape, not IAM, VPC networking, service quotas, or real service latency. Local testing catches logic bugs; integration testing in a real dev account catches everything else."
  },
  {
    id: "dva3-08", domain: 3, type: "single",
    stem: "A CodeDeploy deployment to EC2 instances must stop the currently running application before new files are copied onto the instance.\n\nIn which appspec.yml lifecycle hook should this script run?",
    options: [
      "ApplicationStop, which runs before the new revision is downloaded.",
      "BeforeInstall, which runs immediately before files are copied.",
      "DownloadBundle, which retrieves and unpacks the revision.",
      "BeforeBlockTraffic, which runs before the instance is deregistered from the load balancer."
    ],
    correct: [0],
    explanation: "Correct — ApplicationStop is the first hook in the EC2/on-premises lifecycle and runs before the new revision is even downloaded. Importantly, it executes the script from the previously deployed revision, which is why a broken ApplicationStop script can block future deployments until you fix it or force a deployment ignoring the failure.\n\nWhy the others are wrong:\n• BeforeInstall: it runs after DownloadBundle, so the new files are already staged on the instance. It is typically used for backups or decrypting files, not for stopping the app.\n• DownloadBundle: this is an agent-managed event, not a hook you can script. Install is likewise reserved for the agent.\n• BeforeBlockTraffic: it belongs to the load-balancer traffic-control hooks and runs before deregistration, which is about traffic rather than the application process.\n\nRule to remember: the EC2 order is ApplicationStop → DownloadBundle → BeforeInstall → Install → AfterInstall → ApplicationStart → ValidateService, with BeforeBlockTraffic/BlockTraffic/AfterBlockTraffic at the start and BeforeAllowTraffic/AllowTraffic/AfterAllowTraffic before ApplicationStart when a load balancer is involved. DownloadBundle and Install are agent-only."
  },
  {
    id: "dva3-09", domain: 3, type: "single",
    stem: "A CodeDeploy deployment to AWS Lambda must run an automated smoke test against the new version before any production traffic reaches it, and abort the deployment if the test fails.\n\nWhich hook should invoke the test?",
    options: [
      "BeforeAllowTraffic, which runs after the new version is deployed but before traffic is shifted to it.",
      "AfterAllowTraffic, which runs once traffic has been shifted.",
      "ValidateService, which is the standard validation hook for all CodeDeploy compute platforms.",
      "AfterInstall, which runs after the new version is registered with the alias."
    ],
    correct: [0],
    explanation: "Correct — the Lambda compute platform has exactly two hooks, BeforeAllowTraffic and AfterAllowTraffic. BeforeAllowTraffic runs while the alias still points entirely at the old version, so a failing validation function aborts the deployment before any customer is affected.\n\nWhy the others are wrong:\n• AfterAllowTraffic: it runs after the shift, so real traffic has already hit the new version. It is useful for post-deployment verification and can still trigger a rollback, but it does not satisfy \"before any production traffic\".\n• ValidateService: this hook exists only on the EC2/on-premises platform.\n• AfterInstall: this is an EC2/on-premises and ECS hook, not a Lambda one.\n\nRule to remember: the hooks differ per compute platform. Lambda has two; ECS has BeforeInstall, AfterInstall, AfterAllowTestTraffic, BeforeAllowTraffic, and AfterAllowTraffic; EC2/on-premises has the full seven-plus-traffic set. A hook function must report success or failure back to CodeDeploy with PutLifecycleEventHookExecutionStatus."
  },
  {
    id: "dva3-10", domain: 3, type: "single",
    stem: "An Elastic Beanstalk environment runs four EC2 instances behind a load balancer. A deployment must never reduce available capacity below four instances, and a failed deployment must be quick to reverse.\n\nWhich deployment policy BEST meets these requirements?",
    options: [
      "Immutable, which launches a full set of new instances in a temporary Auto Scaling group and swaps them in only after they pass health checks.",
      "Rolling, which updates instances in batches.",
      "All at once, which updates every instance simultaneously for the fastest deployment.",
      "Rolling with additional batch, which adds one batch of instances before updating."
    ],
    correct: [0],
    explanation: "Correct — immutable deployments build an entirely new set of instances alongside the existing ones. Capacity is never reduced, the old instances remain untouched and healthy throughout, and rollback is simply terminating the new Auto Scaling group. It is the safest policy, at the cost of temporarily doubling instance count and taking the longest.\n\nWhy the others are wrong:\n• Rolling: it takes instances out of service batch by batch, so capacity drops below four during the deployment. Rollback also requires redeploying the previous version batch by batch.\n• All at once: the fastest and the riskiest — total downtime, and a failed deployment leaves every instance broken.\n• Rolling with additional batch: it does maintain full capacity, which is a strong contender. But rollback still means another rolling deployment across mixed instances, whereas immutable gives a clean, instant reversal. When the stem stresses both full capacity and quick rollback, immutable is the intended answer.\n\nRule to remember: All at once (downtime, fastest) → Rolling (reduced capacity) → Rolling with additional batch (full capacity, longer) → Immutable (full capacity, safest rollback) → Traffic splitting (canary testing on a percentage of live traffic, ALB only)."
  },
  {
    id: "dva3-11", domain: 3, type: "single",
    stem: "A team wants to deploy a new Elastic Beanstalk application version to a completely separate environment, validate it, and then switch production traffic over with near-zero downtime and instant reversal.\n\nWhich technique should be used?",
    options: [
      "Blue/green deployment by cloning the environment, deploying to the clone, and performing a CNAME swap.",
      "The immutable deployment policy on the existing environment.",
      "The traffic splitting deployment policy with 100% of traffic sent to the new version.",
      "A rolling deployment with a batch size of 100%."
    ],
    correct: [0],
    explanation: "Correct — Beanstalk blue/green means two independent environments. You deploy and validate the green environment fully, then use Swap Environment URLs, which exchanges the CNAME records. Traffic moves as DNS propagates, and reverting is simply swapping back — the blue environment is still running and untouched.\n\nWhy the others are wrong:\n• Immutable: it replaces instances within the same environment. It is safe, but there is no second environment to validate against a separate URL before cutting over.\n• Traffic splitting at 100%: traffic splitting is a canary mechanism for sending a small percentage to new instances within one environment; setting it to 100% is effectively an all-at-once deployment.\n• Rolling at 100% batch size: that is just all at once, with downtime and no rollback path.\n\nRule to remember: the CNAME swap means DNS TTL governs how fast the switch takes effect, and in-flight connections to the old environment continue. Also remember that a database managed inside the Beanstalk environment is destroyed when that environment is terminated — a decoupled RDS instance outside the environment is the correct pattern for blue/green."
  },
  {
    id: "dva3-12", domain: 3, type: "single",
    stem: "A developer must install an operating system package and set a configuration file on every EC2 instance in an Elastic Beanstalk environment, using files stored in the application source bundle.\n\nWhere should this configuration be placed?",
    options: [
      "In a .config file inside the .ebextensions directory at the root of the source bundle.",
      "In the buildspec.yml file at the root of the source bundle.",
      "In a Dockerrun.aws.json file at the root of the source bundle.",
      "In the appspec.yml file at the root of the source bundle."
    ],
    correct: [0],
    explanation: "Correct — .ebextensions holds YAML or JSON configuration files (which must end in .config) that Beanstalk applies during environment creation and deployment. Their keys include packages, files, commands, container_commands, option_settings, and Resources for adding raw CloudFormation to the environment's stack.\n\nWhy the others are wrong:\n• buildspec.yml: that is CodeBuild's build definition. Beanstalk does not read it.\n• Dockerrun.aws.json: it describes the container configuration for Docker platforms — image, ports, volumes. It does not configure the host.\n• appspec.yml: that belongs to CodeDeploy, a different deployment service with its own lifecycle hooks.\n\nRule to remember: on Amazon Linux 2 and later platforms, .platform/hooks (prebuild, predeploy, postdeploy) is the modern mechanism and runs actual shell scripts, while .ebextensions remains supported and is still what the exam usually asks about. Also note commands run before the application is set up, whereas container_commands run after."
  },
  {
    id: "dva3-13", domain: 3, type: "single",
    stem: "A CodeBuild project must produce a build artifact and cache downloaded dependencies between builds to reduce build time.\n\nWhich buildspec sections handle these?",
    options: [
      "The artifacts section defines what to upload as the build output, and the cache section lists paths to preserve between builds.",
      "The artifacts section defines both, using its files and cache subsections.",
      "The phases section's post_build commands, which copy files to S3 manually.",
      "The env section, which declares artifact and cache locations as variables."
    ],
    correct: [0],
    explanation: "Correct — buildspec.yml has distinct top-level sections. artifacts declares which files CodeBuild packages and uploads to the output location, and cache declares directories (such as a dependency folder) that CodeBuild saves to S3 or preserves locally and restores on the next build.\n\nWhy the others are wrong:\n• A cache subsection inside artifacts: no such nesting exists; cache is its own top-level key.\n• Manual copying in post_build: it works, but you lose CodePipeline's artifact handoff between stages and you write and maintain the plumbing yourself.\n• env: it defines environment variables, including parameter-store and secrets-manager references. It does not define artifacts or cache.\n\nRule to remember: the buildspec top-level sections are version, run-as, env, proxy, phases (install, pre_build, build, post_build), reports, artifacts, and cache. Note that post_build runs even when the build phase fails, so guard cleanup logic accordingly."
  },
  {
    id: "dva3-14", domain: 3, type: "single",
    stem: "A CodeBuild project needs to build a Docker image and push it to Amazon ECR. The build fails with \"Cannot connect to the Docker daemon\".\n\nWhat is required?",
    options: [
      "Enable privileged mode on the build project so the Docker daemon can run inside the build container.",
      "Attach an IAM policy granting ecr:PutImage to the build project's service role.",
      "Use a build image based on Amazon Linux instead of Ubuntu.",
      "Add a VPC configuration so the build container can reach the ECR endpoint."
    ],
    correct: [0],
    explanation: "Correct — CodeBuild builds run inside a container. To run Docker itself (docker build, docker push), the build container needs elevated privileges, which is what the privileged mode flag grants. Without it, there is no Docker daemon to connect to, producing exactly this error.\n\nWhy the others are wrong:\n• ecr:PutImage permission: the role certainly needs ECR permissions (including ecr:GetAuthorizationToken for docker login), but a missing permission produces an authorization error at push time, not a daemon connection error at build time.\n• Changing the base image: both AWS-managed Ubuntu and Amazon Linux images support Docker builds when privileged mode is on. The OS is not the issue.\n• VPC configuration: attaching a build to a VPC restricts its networking and, without a NAT gateway or endpoints, usually makes connectivity worse. The error is local to the container, not a network failure.\n\nRule to remember: match the error to the layer. \"Cannot connect to the Docker daemon\" = the daemon is not running (privileged mode). \"no basic auth credentials\" = you skipped docker login with aws ecr get-login-password. \"denied: not authorized\" = the service role lacks ECR permissions."
  },
  {
    id: "dva3-15", domain: 3, type: "single",
    stem: "A CodePipeline pipeline currently detects changes in a CodeCommit repository by polling every minute. The team wants faster reaction time and lower API usage.\n\nWhich change achieves this?",
    options: [
      "Switch the source action to event-based change detection using an Amazon EventBridge rule that starts the pipeline on a repository state change.",
      "Reduce the polling interval to 10 seconds in the pipeline settings.",
      "Add a webhook from CodeCommit directly to the pipeline's execution endpoint.",
      "Enable pipeline caching so the source stage skips unchanged commits."
    ],
    correct: [0],
    explanation: "Correct — EventBridge-based detection is the recommended default. A rule matches the repository state change event and starts the pipeline execution within seconds, with no polling loop at all. The console configures this automatically when you create a CodeCommit source action.\n\nWhy the others are wrong:\n• A shorter polling interval: the interval is not user-configurable to seconds, and polling more often increases API usage rather than reducing it — the opposite of the goal.\n• A manual webhook to an execution endpoint: webhooks are how third-party sources like GitHub notify CodePipeline, and CodePipeline manages that registration for you. There is no raw execution endpoint to point CodeCommit at.\n• Pipeline caching: CodePipeline has no such feature. Caching exists in CodeBuild for dependencies.\n\nRule to remember: prefer event-driven triggers over polling everywhere in AWS. For GitHub and Bitbucket sources, CodePipeline uses a CodeConnections (formerly CodeStar Connections) connection with webhooks; for S3 sources, EventBridge with CloudTrail data events."
  },
  {
    id: "dva3-16", domain: 3, type: "single",
    stem: "A pipeline builds an application in a Build stage and deploys it in a Deploy stage. The deploy action reports that the input artifact cannot be found.\n\nWhat is the MOST likely misconfiguration?",
    options: [
      "The Deploy action's input artifact name does not match the Build action's output artifact name.",
      "The pipeline's artifact store S3 bucket has versioning disabled.",
      "The Build stage and Deploy stage are in different AWS Regions, which CodePipeline does not support.",
      "The Deploy action is missing an explicit DependsOn reference to the Build action."
    ],
    correct: [0],
    explanation: "Correct — CodePipeline passes artifacts between actions by name through the artifact store bucket. The producing action declares an output artifact name and the consuming action must reference that exact name as its input. A mismatch is the classic cause of \"artifact not found\".\n\nWhy the others are wrong:\n• Versioning disabled: the artifact bucket does require versioning, and CodePipeline will not function correctly without it — but that surfaces when creating the pipeline or as a different error, not as a per-action artifact name failure.\n• Cross-Region stages: CodePipeline explicitly supports cross-Region actions, replicating artifacts into a bucket in the target Region.\n• DependsOn: that is CloudFormation syntax. CodePipeline orders execution by stage, and actions within a stage by runOrder.\n\nRule to remember: stages run sequentially; actions inside a stage run in parallel unless you set runOrder. Artifacts flow only forward, and every consumer must name its input explicitly."
  },
  {
    id: "dva3-17", domain: 3, type: "single",
    stem: "A pipeline must pause before the production deploy stage until a release manager reviews the staging environment.\n\nWhich configuration accomplishes this?",
    options: [
      "Add a manual approval action before the production deploy stage, optionally with an SNS topic to notify reviewers.",
      "Add a Lambda invoke action that sleeps until an operator updates a DynamoDB flag.",
      "Disable the transition into the production stage permanently and enable it by hand for each release.",
      "Set the production deploy action's runOrder higher than the other actions so it executes last."
    ],
    correct: [0],
    explanation: "Correct — the manual approval action type is built for exactly this. The pipeline halts, optionally publishes to an SNS topic with a review URL and comments, and waits for someone with codepipeline:PutApprovalResult permission to approve or reject. Approvals time out after seven days if nobody responds.\n\nWhy the others are wrong:\n• A Lambda that polls a flag: this reinvents approvals, burns invocation time (against Lambda's 15-minute ceiling), and provides no audit record of who approved.\n• Permanently disabling the transition: this does stop the pipeline, but it is a global toggle rather than a per-execution gate, and it records no approver or reason.\n• runOrder: it sequences actions within a single stage. It introduces no pause and no human decision point.\n\nRule to remember: an approval action records who approved and any comment they left, which is often exactly what an audit requires. Grant approval rights narrowly, since the permission effectively controls production releases."
  },
  {
    id: "dva3-18", domain: 3, type: "single",
    stem: "A Lambda function's deployment package is 180 MB unzipped because of a large dependency shared by six functions.\n\nWhat is the recommended way to reduce duplication across the functions?",
    options: [
      "Move the shared dependency into a Lambda layer and attach it to all six functions, keeping each function's own package small.",
      "Store the dependency in S3 and download it into /tmp during each function's INIT phase.",
      "Package all six functions into a single Lambda function with an internal router.",
      "Increase each function's ephemeral storage so the larger package fits."
    ],
    correct: [0],
    explanation: "Correct — layers exist to share code and dependencies. The layer content is extracted to /opt in the execution environment, deployment of each function becomes fast and small, and updating the shared dependency means publishing a new layer version rather than rebuilding six packages.\n\nWhy the others are wrong:\n• Downloading to /tmp each time: this adds latency to every cold start and pays for the same transfer repeatedly. It is the right answer only for assets too big for layers.\n• Merging into one function: a monolith couples six independent deployments, forces one memory and timeout setting for all, and makes permissions coarser. It reduces duplication by eliminating separation.\n• Ephemeral storage: /tmp is unrelated to package size. Deployment package limits are enforced separately.\n\nRule to remember: the 250 MB unzipped limit covers the function package plus all attached layers combined, and a function can attach at most 5 layers. If a layer will not fit, container images (up to 10 GB) are the next step."
  },
  {
    id: "dva3-19", domain: 3, type: "single",
    stem: "A team wants a Lambda function's new version to receive 5% of invocations while the previous version handles 95%, without using CodeDeploy.\n\nWhich Lambda feature provides this?",
    options: [
      "Alias weighted routing, which splits invocations between two versions based on configured weights.",
      "Provisioned concurrency configured separately on each version.",
      "Reserved concurrency set to 5% of the account limit on the new version.",
      "An event source mapping filter that routes 5% of events to the new version."
    ],
    correct: [0],
    explanation: "Correct — an alias can point at two versions with an additional version weight. Lambda routes invocations probabilistically according to those weights, so setting 0.05 on the new version gives it roughly 5% of traffic. This is the primitive CodeDeploy drives during a canary deployment, and you can use it directly.\n\nWhy the others are wrong:\n• Provisioned concurrency: it controls how many pre-initialized environments exist. It does not decide which version an invocation reaches.\n• Reserved concurrency: it caps concurrent executions. Once the cap is reached the function is throttled — invocations are rejected, not redirected to the other version.\n• Event source mapping filters: filter criteria decide which events invoke the function based on content. They do not perform percentage-based splitting.\n\nRule to remember: weighted aliases work for most invocation paths, but note the caveats — traffic shifting does not apply to $LATEST, and some event sources and features (such as provisioned concurrency behaviour during a shift) require care. Combine weights with CloudWatch alarms to catch regressions early."
  },
  {
    id: "dva3-20", domain: 3, type: "single",
    stem: "A developer runs sam deploy and receives an error stating that the S3 URI for the function's code is invalid because it points to a local directory.\n\nWhat step was skipped?",
    options: [
      "The local artifacts were never uploaded to S3 and the template rewritten to reference them — the job of sam build followed by sam deploy (or the older sam package).",
      "The template's Transform declaration for AWS::Serverless-2016-10-31 is missing.",
      "The CloudFormation stack was not created with a change set.",
      "The IAM capability CAPABILITY_IAM was not acknowledged."
    ],
    correct: [0],
    explanation: "Correct — CloudFormation cannot read your laptop. A raw SAM template references local paths in CodeUri, and those must be zipped, uploaded to S3, and replaced with the resulting S3 URI before CloudFormation sees the template. sam build compiles dependencies and sam deploy performs the upload and transformation automatically; sam package was the explicit older step.\n\nWhy the others are wrong:\n• Missing Transform: without it CloudFormation would reject AWS::Serverless::Function as an unknown resource type, a different and very explicit error.\n• No change set: sam deploy uses change sets internally by default. Their absence does not produce a code URI error.\n• Missing CAPABILITY_IAM: that error names the capability and appears when the template creates IAM resources. It is unrelated to artifact location.\n\nRule to remember: the SAM workflow is build → deploy, with package folded into deploy in current versions. The same pattern applies to plain CloudFormation via aws cloudformation package for Lambda code, nested stack templates, and other local references."
  },
  {
    id: "dva3-21", domain: 3, type: "single",
    stem: "A developer must roll out a change to an API Gateway REST API and expose it to only 10% of production traffic for validation, keeping the remaining 90% on the current deployment.\n\nWhich feature supports this?",
    options: [
      "A canary release on the stage, which sends a configured percentage of requests to a canary deployment with its own stage variables.",
      "A separate stage named canary with 10% of API keys assigned to it.",
      "A usage plan with a 10% quota applied to the new deployment.",
      "A Lambda alias with weighted routing on the backend function."
    ],
    correct: [0],
    explanation: "Correct — API Gateway canary releases operate within a single stage. You promote a deployment to the canary, set a percentage, and API Gateway splits requests between the canary and the main deployment. The canary can carry its own stage variables (to hit a different backend) and its metrics and logs are reported separately.\n\nWhy the others are wrong:\n• A separate stage with reassigned API keys: this changes the URL, so clients would have to be reconfigured — not a transparent canary, and not percentage-based.\n• A usage plan quota: quotas limit how many requests a key may make. They do not split traffic between deployments.\n• Lambda alias weighted routing: a genuinely valid canary technique, but it shifts traffic at the function level. The question specifies rolling out an API change, which may include mapping templates, authorizers, or method settings that live in API Gateway, not in Lambda.\n\nRule to remember: after validating, promote the canary to become the main deployment. Canary settings include stage variables and whether to use the stage cache, which matters when the canary's backend differs."
  },
  {
    id: "dva3-22", domain: 3, type: "single",
    stem: "A CloudFormation stack update fails midway. The team wants the stack to return to its previous working state automatically.\n\nWhat does CloudFormation do by default, and what should the developer check if it does not complete?",
    options: [
      "CloudFormation automatically rolls back to the previous state; if a resource cannot be rolled back the stack enters UPDATE_ROLLBACK_FAILED and requires ContinueUpdateRollback, potentially skipping the problem resource.",
      "CloudFormation leaves the stack in UPDATE_IN_PROGRESS until the developer manually triggers a rollback.",
      "CloudFormation deletes the stack and all its resources to guarantee a clean state.",
      "CloudFormation retries the failed resource indefinitely until it succeeds or the stack timeout expires."
    ],
    correct: [0],
    explanation: "Correct — automatic rollback on failure is the default behaviour. When rollback itself cannot complete (a resource is in an inconsistent state, a dependency was deleted out of band, or a script never signals), the stack lands in UPDATE_ROLLBACK_FAILED. From there ContinueUpdateRollback resumes it, optionally with ResourcesToSkip for resources that cannot be restored.\n\nWhy the others are wrong:\n• Waiting in UPDATE_IN_PROGRESS: rollback is automatic unless you explicitly disable it.\n• Deleting the whole stack: rollback restores the previous configuration; it never deletes resources that existed before the update.\n• Infinite retries: CloudFormation fails the resource and begins rollback rather than retrying forever.\n\nRule to remember: the common causes of a failed rollback are manual out-of-band changes to stack resources and a cfn-signal that never arrives. Disabling rollback (or setting DisableRollback) is useful when debugging, because it leaves the failed resources in place for inspection."
  },
  {
    id: "dva3-23", domain: 3, type: "single",
    stem: "A team must deploy the same application stack to 12 AWS accounts across 3 Regions, keeping them consistent as the template evolves.\n\nWhich CloudFormation capability is designed for this?",
    options: [
      "StackSets, which deploy and update a single template across multiple accounts and Regions from an administrator account.",
      "Nested stacks, which allow one template to create stacks in other accounts.",
      "Cross-stack references using Fn::ImportValue across account boundaries.",
      "Change sets executed sequentially in each target account."
    ],
    correct: [0],
    explanation: "Correct — StackSets exist for multi-account, multi-Region deployment. An administrator account manages the stack set, and stack instances are created in each target account and Region. Updating the stack set propagates to all instances with configurable failure tolerance and concurrency, and integration with AWS Organizations enables automatic deployment to new accounts in an OU.\n\nWhy the others are wrong:\n• Nested stacks: they create child stacks within the same account and Region as the parent. There is no cross-account nesting.\n• Cross-stack references: exports and imports are scoped to a single account and Region. They cannot cross either boundary.\n• Change sets in each account: change sets are a preview mechanism for one stack. Running them 36 times by hand is the manual process StackSets replace.\n\nRule to remember: StackSets need a trust relationship — either self-managed permissions (an administration role in the admin account and an execution role in each target) or service-managed permissions through AWS Organizations, which handles the roles for you."
  },
  {
    id: "dva3-24", domain: 3, type: "single",
    stem: "A CloudFormation template must provision a resource type that CloudFormation does not natively support, by calling a third-party API during stack creation.\n\nWhich mechanism enables this?",
    options: [
      "A custom resource backed by a Lambda function, which CloudFormation invokes with Create, Update, and Delete requests and which must send a response to a pre-signed URL.",
      "A CloudFormation macro, which transforms the template before deployment.",
      "The Fn::Transform intrinsic function with the AWS::Include macro.",
      "A wait condition that pauses the stack while an external process provisions the resource."
    ],
    correct: [0],
    explanation: "Correct — custom resources let you run arbitrary logic as part of a stack's lifecycle. CloudFormation sends a request (RequestType Create, Update, or Delete) to your Lambda function or SNS topic, and the function must POST a SUCCESS or FAILED response to the pre-signed ResponseURL. Forgetting to respond is why stacks hang for an hour before timing out.\n\nWhy the others are wrong:\n• Macros: they rewrite template content before deployment (generating boilerplate, expanding shorthand). They run at transform time, not as a resource with a lifecycle, and cannot call an external API to provision something.\n• Fn::Transform with AWS::Include: this splices a template snippet from S3 into the template. It is text inclusion, not provisioning.\n• Wait condition: it pauses for an external signal, but nothing provisions the resource and nothing handles updates or deletes.\n\nRule to remember: for a reusable, well-typed integration, the modern alternative is a CloudFormation resource type registered in the CloudFormation registry, or an AWS::CloudFormation::CustomResource for one-off cases. Always handle the Delete request — otherwise stack deletion hangs."
  },
  {
    id: "dva3-25", domain: 3, type: "single",
    stem: "A container image must be pushed to Amazon ECR from a CI job. The push fails with \"no basic auth credentials\".\n\nWhich step is missing?",
    options: [
      "Authenticating the Docker client to the registry using aws ecr get-login-password piped into docker login.",
      "Creating the repository with immutable tags enabled.",
      "Tagging the image with the repository's short name rather than its full URI.",
      "Enabling scan-on-push on the repository."
    ],
    correct: [0],
    explanation: "Correct — ECR is a private registry that requires an authorization token. The token is obtained with aws ecr get-login-password and piped into docker login against the registry URI (accountid.dkr.ecr.region.amazonaws.com). Without it, Docker has no credentials and reports exactly this error. Tokens are valid for 12 hours.\n\nWhy the others are wrong:\n• Tag immutability: it prevents overwriting an existing tag. Violating it produces an ImageTagAlreadyExists error, not an auth error.\n• Using the short name: the image must be tagged with the full repository URI, so the reverse of this option is true — but a wrong tag produces a repository-not-found or push-to-Docker-Hub failure, not a basic auth error.\n• Scan on push: this runs vulnerability scanning after a successful push and has no bearing on authentication.\n\nRule to remember: the caller also needs ecr:GetAuthorizationToken (a registry-level permission) plus repository-level permissions such as ecr:BatchCheckLayerAvailability, ecr:PutImage, and ecr:InitiateLayerUpload. On ECS, the task execution role needs the pull-side equivalents."
  },
  {
    id: "dva3-26", domain: 3, type: "single",
    stem: "A team wants to turn a new feature on for 5% of users and increase the rollout gradually, without redeploying the application for each change.\n\nWhich AWS service is purpose-built for this?",
    options: [
      "AWS AppConfig, which manages feature flags and configuration with validation and gradual deployment strategies.",
      "AWS Systems Manager Parameter Store with a boolean parameter read on each request.",
      "AWS CodeDeploy with a linear deployment configuration.",
      "Amazon CloudWatch Evidently experiments attached to a CodeDeploy hook."
    ],
    correct: [0],
    explanation: "Correct — AppConfig manages configuration and feature flags as a deployable artifact. It validates changes (with a JSON schema or a Lambda validator), rolls them out on a deployment strategy with bake time, and monitors CloudWatch alarms to roll back automatically. The application polls for configuration, so no redeployment is needed.\n\nWhy the others are wrong:\n• A Parameter Store boolean: it stores the value but offers no gradual rollout, no validation, no bake time, and no automatic rollback. You would build all of that yourself.\n• CodeDeploy linear: it shifts traffic between application versions. A feature flag exists precisely so you can ship code once and control behaviour separately.\n• Evidently attached to a CodeDeploy hook: CloudWatch Evidently did offer feature launches and A/B testing, but the described coupling is not how it works, and AppConfig is the service the exam associates with feature flags.\n\nRule to remember: feature flags decouple deployment from release — code ships dark, then activates by configuration. AppConfig's caching extension for Lambda avoids an API call on every invocation."
  },
  {
    id: "dva3-27", domain: 3, type: "multiple",
    stem: "A developer is configuring a CodeDeploy blue/green deployment on EC2 behind an Application Load Balancer.\n\nWhich TWO statements are accurate? (Choose two.)",
    options: [
      "CodeDeploy provisions a replacement set of instances, deploys to them, and reroutes the load balancer to the new instances once they pass health checks.",
      "The original instances can be kept running for a configured period, allowing an immediate rollback by rerouting traffic back to them.",
      "Blue/green deployments on EC2 require no load balancer, since CodeDeploy updates DNS records directly.",
      "Blue/green is the only deployment type that supports lifecycle hooks on the EC2 platform.",
      "Blue/green deployments cost the same as in-place deployments because instances are replaced one at a time."
    ],
    correct: [0, 1],
    explanation: "Correct — blue/green on EC2 works by standing up a replacement environment (a new Auto Scaling group or a specified set of instances), deploying there, and then shifting the load balancer's target registration. You choose what happens to the original instances: terminate them after a wait period, or keep them, which is what makes rollback nearly instantaneous.\n\nWhy the others are wrong:\n• No load balancer needed: a load balancer is required for EC2 blue/green, because rerouting traffic is exactly what it does. CodeDeploy does not manipulate DNS.\n• \"Only blue/green supports hooks\": in-place deployments use the same lifecycle hooks. Blue/green simply adds the traffic-control hooks around them.\n• Same cost: blue/green runs two full environments simultaneously during the deployment, so it costs more, and it is not one-at-a-time replacement.\n\nRule to remember: in-place = fastest and cheapest, with reduced capacity and slower rollback. Blue/green = no capacity reduction, near-instant rollback, higher temporary cost. On Lambda and ECS, CodeDeploy deployments are always blue/green in nature."
  },
  {
    id: "dva3-28", domain: 3, type: "single",
    stem: "A developer must ensure a CloudFormation template's Lambda function code is updated when the source code changes, but repeated deployments with identical code should not create unnecessary new versions.\n\nWhat does CloudFormation use to detect that the code changed?",
    options: [
      "The S3 object key or object version referenced in the function's Code property — CloudFormation compares template values, not the contents of the bucket.",
      "A checksum CloudFormation computes by downloading and hashing the S3 object on every deployment.",
      "The LastModified timestamp of the S3 object, which CloudFormation queries during the update.",
      "The Lambda function's own code SHA-256, which CloudFormation reads from the Lambda API."
    ],
    correct: [0],
    explanation: "Correct — CloudFormation performs a template-level diff. If S3Bucket and S3Key are identical to the previous deployment, it sees no change and does not update the function, even if you overwrote the object in S3. This is the notorious \"I deployed but my code did not change\" problem.\n\nWhy the others are wrong:\n• Downloading and hashing: CloudFormation does not inspect object contents. It compares the template properties you supplied.\n• LastModified timestamp: not consulted. Overwriting the same key updates the timestamp and still produces no stack change.\n• Reading the deployed function's SHA-256: CloudFormation compares desired state against previous desired state, not against the live resource. (Drift detection does compare against live state, but that is a separate, on-demand operation.)\n\nRule to remember: this is why sam build and sam deploy generate a content-hashed S3 key for each build, and why S3ObjectVersion exists. Always publish artifacts under a unique key — a hash or a build ID — never a fixed name like latest.zip."
  },
  {
    id: "dva3-29", domain: 3, type: "single",
    stem: "A CodeBuild build must run integration tests against resources in a private VPC subnet, such as an RDS database with no public endpoint.\n\nWhat configuration is required?",
    options: [
      "Configure the CodeBuild project with a VPC, subnets, and a security group, and ensure the subnets have a route to the internet through a NAT gateway if the build downloads dependencies.",
      "Add the CodeBuild service's published IP ranges to the RDS security group.",
      "Enable privileged mode so the build container can create its own network interface.",
      "Configure a VPC interface endpoint for CodeBuild in the application's VPC."
    ],
    correct: [0],
    explanation: "Correct — a VPC-configured CodeBuild project creates an ENI in the subnets you specify, so builds can reach private resources using the attached security group. The important side effect is that the build loses default internet access, so any dependency downloads (npm, pip, Maven, Docker Hub) require a NAT gateway or VPC endpoints.\n\nWhy the others are wrong:\n• Allowlisting CodeBuild IP ranges: builds outside a VPC come from AWS-managed addresses that change, and the private RDS endpoint is not reachable from outside the VPC in the first place.\n• Privileged mode: this enables Docker-in-Docker, not VPC networking.\n• A CodeBuild interface endpoint: that lets resources inside a VPC call the CodeBuild API privately. It does not put the build itself into the VPC.\n\nRule to remember: the same trade-off applies to Lambda. Attaching compute to a VPC gives private access and takes away default internet access. Plan for NAT gateways or interface endpoints for the AWS services the build calls (S3 via a gateway endpoint, plus ECR, CloudWatch Logs, Secrets Manager)."
  },
  {
    id: "dva3-30", domain: 3, type: "single",
    stem: "A team needs their CI pipeline to fail a build when unit test coverage drops below a threshold, and to display test results in the AWS console.\n\nWhich CodeBuild feature should be used?",
    options: [
      "The reports section of the buildspec, configuring a test report group and a code coverage report group.",
      "The artifacts section, uploading the coverage HTML report to S3 for manual review.",
      "A CloudWatch metric filter on the build log group that alarms on coverage output.",
      "The cache section, storing coverage history between builds for comparison."
    ],
    correct: [0],
    explanation: "Correct — CodeBuild test reporting parses standard formats (JUnit XML, NUnit, Cucumber JSON, TestNG) and code coverage formats (JaCoCo XML, Clover, Cobertura, SimpleCov). Results appear in the console with pass/fail counts, trends over time, and per-test detail, and coverage thresholds can fail the build.\n\nWhy the others are wrong:\n• Uploading HTML to S3: this preserves the report but provides no console integration, no trend history, and no automatic build failure.\n• A metric filter on logs: scraping coverage percentages out of log text is fragile, and an alarm fires after the build finished rather than failing it.\n• Cache: it speeds up builds by preserving dependencies. It is not a reporting mechanism.\n\nRule to remember: report groups are defined in the buildspec under reports, with file-format and files keys. The build's service role needs codebuild:CreateReport, codebuild:CreateReportGroup, and codebuild:BatchPutTestCases."
  },
  {
    id: "dva3-31", domain: 3, type: "single",
    stem: "A stack must create an S3 bucket only when the environment parameter is set to prod, and skip it otherwise.\n\nWhich template section makes this possible?",
    options: [
      "The Conditions section, with a condition referenced by the resource's Condition attribute.",
      "The Mappings section, which selects resources based on a parameter value.",
      "The Rules section, which validates parameter combinations before deployment.",
      "The Metadata section, with a conditional block interpreted at deploy time."
    ],
    correct: [0],
    explanation: "Correct — Conditions define named boolean expressions built from Fn::Equals, Fn::And, Fn::Or, Fn::Not, and Fn::If, usually evaluating parameters or pseudo parameters. Attaching a condition to a resource with the Condition attribute makes CloudFormation create it only when the condition is true. Conditions can also gate outputs and individual property values via Fn::If.\n\nWhy the others are wrong:\n• Mappings: they are lookup tables (for example, Region to AMI ID). They return values; they cannot omit a resource.\n• Rules: they validate parameter values at deployment time and reject invalid combinations. They gate the whole deployment, not individual resources.\n• Metadata: arbitrary structured data attached to the template or resources, used by tools such as cfn-init and the Designer. It has no effect on which resources are created.\n\nRule to remember: a common pattern is a CreateProdResources condition driven by an Environment parameter, then Fn::If inside properties to vary instance size or capacity between environments without maintaining separate templates."
  },
  {
    id: "dva3-32", domain: 3, type: "single",
    stem: "An ECS service must be updated to a new task definition with zero downtime, running the new tasks alongside the old ones and only shifting traffic after they pass health checks.\n\nWhich deployment approach is appropriate?",
    options: [
      "A CodeDeploy blue/green deployment for ECS, using two target groups and the AfterAllowTestTraffic hook for validation.",
      "An ECS rolling update with minimumHealthyPercent set to 0 and maximumPercent set to 100.",
      "Stopping the service, updating the task definition, and starting it again.",
      "Creating a second ECS cluster and moving the load balancer to it manually."
    ],
    correct: [0],
    explanation: "Correct — the CodeDeploy blue/green deployment type for ECS uses two target groups behind the load balancer. New tasks register with the replacement target group, optional test traffic is sent to a test listener for validation (the AfterAllowTestTraffic hook), and production traffic shifts only when everything passes. Rollback is a reroute back to the original target group.\n\nWhy the others are wrong:\n• Rolling update with minimum 0 and maximum 100: those values allow the service to stop all old tasks before new ones are healthy, which produces downtime. For a zero-downtime rolling update you want minimumHealthyPercent at 100 and maximumPercent above 100 — but a rolling update still mixes versions and offers no test-traffic step.\n• Stop and restart: guaranteed downtime.\n• A second cluster with manual load balancer moves: this is blue/green done by hand, without health gating, hooks, or automatic rollback.\n\nRule to remember: ECS supports rolling updates (built into the service scheduler), blue/green via CodeDeploy, and external deployment controllers. Blue/green is the answer whenever validation before traffic shift or instant rollback is required."
  },
  {
    id: "dva3-33", domain: 3, type: "single",
    stem: "A developer must ensure a CloudFormation stack's IAM role changes are applied, but the deployment fails with \"Requires capabilities: [CAPABILITY_NAMED_IAM]\".\n\nWhat does this indicate?",
    options: [
      "The template creates IAM resources with explicit custom names, so the deployer must explicitly acknowledge the elevated capability.",
      "The deploying principal lacks iam:CreateRole permission and must be granted it.",
      "The template exceeds the maximum number of IAM resources allowed in a single stack.",
      "The IAM resources reference a service principal that does not exist in the current Region."
    ],
    correct: [0],
    explanation: "Correct — CloudFormation requires explicit acknowledgement before creating IAM resources, because a template can grant permissions. CAPABILITY_IAM covers IAM resources with generated names; CAPABILITY_NAMED_IAM is required when the template assigns explicit names (a RoleName, UserName, or PolicyName), since a named role could collide with or replace an existing one.\n\nWhy the others are wrong:\n• Missing iam:CreateRole: that produces an AccessDenied error naming the action, not a capabilities error. The capability requirement is a separate confirmation step that applies even to an administrator.\n• Too many IAM resources: no such limit produces this message.\n• Nonexistent service principal: that would fail at resource creation with a malformed policy error.\n\nRule to remember: the third capability is CAPABILITY_AUTO_EXPAND, required when a template contains macros or nested transforms such as AWS::Serverless. Pass capabilities with --capabilities on the CLI or the equivalent in your pipeline's deploy action configuration."
  },
  {
    id: "dva3-34", domain: 3, type: "single",
    stem: "A developer needs to update a running Lambda function's code from a CI job and guarantee that the alias used by production is only repointed after a successful smoke test.\n\nWhich sequence is correct?",
    options: [
      "Call UpdateFunctionCode, then PublishVersion to create an immutable version, run the smoke test against that version's qualified ARN, then call UpdateAlias to point the alias at it.",
      "Call UpdateAlias first so the alias tracks $LATEST, run the smoke test, then call UpdateFunctionCode.",
      "Call UpdateFunctionCode and rely on the alias automatically tracking the newest code.",
      "Call PublishVersion first, then UpdateFunctionCode so the published version receives the new code."
    ],
    correct: [0],
    explanation: "Correct — this is the safe ordering. UpdateFunctionCode changes $LATEST only. PublishVersion snapshots $LATEST into a numbered, immutable version you can invoke by qualified ARN. Testing that specific version proves what you are about to release, and only then does UpdateAlias move production traffic.\n\nWhy the others are wrong:\n• Pointing the alias at $LATEST first: production would immediately pick up the new code the moment UpdateFunctionCode runs, before any test. Aliases should never point at $LATEST in production for this exact reason.\n• Relying on automatic tracking: aliases point at a specific version and do not follow new code. That is the property that makes them useful.\n• PublishVersion before UpdateFunctionCode: versions are immutable snapshots taken at publish time, so this would publish the old code and the new code would sit unreleased in $LATEST.\n\nRule to remember: $LATEST is mutable and unversioned. Versions are immutable. Aliases are movable pointers to versions, and they are what every stable client should invoke."
  },
  {
    id: "dva3-35", domain: 3, type: "single",
    stem: "A deployment pipeline must be able to reproduce any past release exactly, including third-party dependencies, months after the original build.\n\nWhich practice BEST supports this?",
    options: [
      "Pin dependency versions with a lockfile committed to source control, and store immutable build artifacts (versioned S3 objects or ECR images tagged by commit SHA).",
      "Rebuild from the tagged source commit whenever a rollback is needed, resolving dependencies at build time.",
      "Keep the last five build artifacts in the CodeBuild cache for fast retrieval.",
      "Enable versioning on the pipeline's artifact bucket and rely on CodePipeline's execution history."
    ],
    correct: [0],
    explanation: "Correct — reproducibility requires pinning both halves. A lockfile fixes the dependency graph so a rebuild resolves the same versions, and storing the built artifact immutably means you can redeploy the exact bytes that were tested, without rebuilding at all.\n\nWhy the others are wrong:\n• Rebuilding from a tagged commit: the source is identical but the dependency resolution is not. A transitive dependency published since then, or a yanked package, produces a different artifact — the classic \"it built fine in March\" failure.\n• The CodeBuild cache: it is a build-time optimization that can be invalidated or evicted at any point. It is not a durable artifact store.\n• Bucket versioning plus pipeline history: versioning is necessary for CodePipeline to function, and execution history is useful, but neither guarantees the artifact for a specific release is identifiable and retained under a stable identity.\n\nRule to remember: build once, deploy many. The same artifact should move through dev, staging, and production — rebuilding per environment reintroduces the variability the pipeline is meant to eliminate."
  },
  {
    id: "dva3-36", domain: 3, type: "single",
    stem: "An application deployed to Elastic Beanstalk needs an RDS database that must survive the environment being terminated and rebuilt.\n\nWhich approach is correct?",
    options: [
      "Provision the RDS instance outside the Beanstalk environment and pass its endpoint to the application through environment properties.",
      "Add the RDS instance to the Beanstalk environment and enable deletion protection on the database.",
      "Add the RDS instance to the Beanstalk environment and set its DeletionPolicy to Retain in an .ebextensions resource block.",
      "Use the Beanstalk environment's saved configuration to recreate the database automatically after termination."
    ],
    correct: [0],
    explanation: "Correct — a database created inside a Beanstalk environment is part of that environment's CloudFormation stack, so terminating the environment destroys it. Decoupling means the database has an independent lifecycle: environments can be rebuilt, blue/green swapped, or terminated without touching the data. The endpoint and credentials are supplied as environment properties.\n\nWhy the others are wrong:\n• Deletion protection on a coupled database: it prevents deletion, which means environment termination now fails or leaves an orphaned resource the environment no longer manages. It converts a data-loss problem into an operational one.\n• DeletionPolicy: Retain via .ebextensions: the database survives, but it is orphaned and detached from any management. It also blocks the clean blue/green story, since the new environment cannot adopt it.\n• Saved configuration: it stores environment settings for reuse, not data. Recreating a database from configuration produces an empty one.\n\nRule to remember: this generalizes beyond Beanstalk — keep stateful resources in a separate stack from stateless compute. It is what makes environments disposable, which is the whole point of infrastructure as code."
  },
  {
    id: "dva3-37", domain: 3, type: "multiple",
    stem: "A team is establishing a release process built on Lambda versions and aliases.\n\nWhich TWO statements are correct? (Choose two.)",
    options: [
      "$LATEST is mutable and changes with every code update, whereas a published version is an immutable snapshot identified by a number.",
      "An alias can reference two versions with configured weights, so a percentage of invocations is routed to the newer version.",
      "An alias can be configured to point at $LATEST so that it always tracks the newest code automatically.",
      "Publishing a new version creates an independent copy of the function's execution role and environment variables that can be edited separately.",
      "Deleting an alias also deletes the function version it points to."
    ],
    correct: [0, 1],
    explanation: "Correct — this pair is the foundation of safe Lambda releases. $LATEST is the mutable working copy; PublishVersion freezes it into a numbered version whose code and configuration cannot change. Aliases are named pointers to versions, and an alias can carry an additional version with a weight, which is exactly the primitive CodeDeploy drives during canary and linear deployments.\n\nWhy the others are wrong:\n• An alias pointing at $LATEST: Lambda does not allow this. An alias must point to a published version, which is what makes a release deterministic.\n• Versions with independently editable configuration: a version captures the code and configuration at publish time and is immutable. You cannot edit a published version's environment variables; you publish a new version instead. (Some settings, such as provisioned concurrency, are configured per version or alias rather than baked in.)\n• Deleting an alias deleting the version: aliases and versions have independent lifecycles. Removing a pointer does not remove what it pointed at.\n\nRule to remember: production clients should invoke a qualified ARN ending in an alias, never $LATEST. That way a rollback is a single UpdateAlias call rather than a redeploy."
  }
];
