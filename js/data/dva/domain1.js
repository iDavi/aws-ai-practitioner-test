/* AWS Certified Developer – Associate (DVA-C02)
 * Domain 1: Development with AWS Services (32% of the exam)
 * Tuned slightly above real-exam difficulty: distractors are plausible,
 * often true-but-irrelevant statements or the right service with the
 * wrong feature. Every explanation teaches the underlying rule.
 */
window.DVA_DOMAIN1 = [
  {
    id: "dva1-01", domain: 1, type: "single",
    stem: "A payment service invokes a Lambda function through an SQS queue. The function takes up to 90 seconds to finish and its timeout is set to 2 minutes. The queue's visibility timeout is left at the default 30 seconds.\n\nCustomers report being charged two or three times for a single order.\n\nWhat is the MOST likely cause?",
    options: [
      "The visibility timeout is shorter than the function timeout, so the message becomes visible again and is delivered to another consumer while the first invocation is still running.",
      "SQS standard queues guarantee exactly-once delivery, so the duplicate charges must come from the payment provider rather than from the queue.",
      "The Lambda function's reserved concurrency is too low, causing SQS to replay each batch until concurrency frees up.",
      "The message retention period is too short, so SQS re-enqueues messages that have not been deleted before they expire."
    ],
    correct: [0],
    explanation: "Correct — a message is hidden only for the visibility timeout. At 30 seconds the message reappears in the queue while the first invocation is still working (up to 90 s), so a second Lambda invocation picks up the same message and charges the customer again. AWS recommends setting the queue visibility timeout to at least 6x the function timeout — here, 12 minutes.\n\nWhy the others are wrong:\n• \"Standard queues guarantee exactly-once\": they do not. Standard queues are at-least-once delivery; FIFO queues offer exactly-once processing. Blaming the provider skips the real defect.\n• Reserved concurrency: throttling delays delivery and eventually sends messages to the DLQ, but it does not duplicate work that is already in flight.\n• Message retention: retention (4 days by default) controls when a message is deleted permanently, not when it becomes visible again.\n\nRule to remember: visibility timeout ≥ 6x Lambda timeout, and make the handler idempotent anyway — at-least-once delivery means duplicates are a design assumption, not a bug."
  },
  {
    id: "dva1-02", domain: 1, type: "single",
    stem: "A DynamoDB table stores orders with partition key orderId. A developer must write an item ONLY if no order with that ID already exists, and must never overwrite an existing order — even when two requests arrive at the same millisecond.\n\nWhich approach satisfies this requirement with a single request?",
    options: [
      "Call PutItem with a ConditionExpression of attribute_not_exists(orderId).",
      "Call GetItem first, and call PutItem only if the GetItem response contains no item.",
      "Call PutItem with ConsistentRead set to true.",
      "Call UpdateItem with a ReturnValues setting of ALL_OLD and check whether the returned attributes are empty."
    ],
    correct: [0],
    explanation: "Correct — a ConditionExpression is evaluated atomically inside DynamoDB at write time. If the item already exists, the write is rejected with ConditionalCheckFailedException and nothing is overwritten. attribute_not_exists on the partition key is the canonical \"insert if absent\" idiom.\n\nWhy the others are wrong:\n• Read-then-write: this is a classic race condition. Between the GetItem and the PutItem, another request can insert the same order, and both writers will believe the item was absent.\n• ConsistentRead: that parameter only applies to reads, and PutItem does not accept it. A consistent read still leaves the read-then-write gap.\n• ReturnValues ALL_OLD: this tells you what the item looked like before the update, but the overwrite has already happened by then. It detects the collision after the damage.\n\nRule to remember: any \"only if\" or \"unless\" requirement on a DynamoDB write belongs in a ConditionExpression, never in application logic around a separate read."
  },
  {
    id: "dva1-03", domain: 1, type: "single",
    stem: "A DynamoDB table is provisioned with 10 RCUs. The application performs eventually consistent reads of items that are 7 KB each.\n\nApproximately how many of these reads per second can the table sustain before throttling?",
    options: [
      "10 reads per second",
      "5 reads per second",
      "20 reads per second",
      "40 reads per second"
    ],
    correct: [0],
    explanation: "Correct — work the formula in two steps. First round the item size up to the next 4 KB boundary: 7 KB becomes 8 KB, which is 2 units of 4 KB. A strongly consistent read of 8 KB therefore costs 2 RCUs. Second, an eventually consistent read costs half as much: 1 RCU per read. With 10 RCUs, that is 10 reads per second.\n\nWhy the others are wrong:\n• 5 reads/second: that is the strongly consistent answer (2 RCUs each). The question specifies eventually consistent, which halves the cost.\n• 20 reads/second: this assumes the 7 KB item fits in a single 4 KB unit. DynamoDB always rounds up, never down.\n• 40 reads/second: this both ignores the rounding and double-applies the eventual-consistency discount.\n\nRule to remember: RCU = ceil(itemSize / 4 KB), halved for eventually consistent reads and doubled for transactional reads. WCU = ceil(itemSize / 1 KB), doubled for transactional writes."
  },
  {
    id: "dva1-04", domain: 1, type: "single",
    stem: "An existing DynamoDB table uses customerId as the partition key and orderDate as the sort key. Six months after launch, the team needs to query orders by status across all customers, and the query must return results within milliseconds.\n\nWhich change meets the requirement?",
    options: [
      "Create a global secondary index with status as the partition key.",
      "Create a local secondary index with status as the sort key.",
      "Run a Scan with a FilterExpression on status and enable parallel scan.",
      "Add a second sort key to the existing table for status."
    ],
    correct: [0],
    explanation: "Correct — a GSI can define a completely different partition key from the base table, so status becomes queryable on its own across every customer. GSIs can be added to a live table at any time.\n\nWhy the others are wrong:\n• LSI: an LSI must reuse the table's partition key (customerId), so it can only narrow results inside one customer — it can never span all customers. LSIs also have to be created at table creation time and cannot be added later, which alone disqualifies this option six months in.\n• Scan with a filter: a FilterExpression is applied after the data is read, so you pay RCUs for the entire table and latency grows with table size. Parallel scan makes it faster and more expensive, not efficient.\n• A second sort key: DynamoDB tables have at most one partition key and one optional sort key. There is no such thing as a second sort key.\n\nRule to remember: different partition key → GSI. Same partition key, alternate sort key → LSI, and only at table creation. If you find yourself scanning with a filter, you are missing an index."
  },
  {
    id: "dva1-05", domain: 1, type: "multiple",
    stem: "A Lambda function is configured with 128 MB of memory and takes 11 seconds to complete a CPU-bound image transformation. The team raises the memory setting to 1024 MB and the same job now finishes in 1.3 seconds, at almost identical cost.\n\nWhich TWO statements explain this result? (Choose two.)",
    options: [
      "Lambda allocates CPU proportionally to the memory setting, so more memory means more compute power for CPU-bound work.",
      "Lambda bills for GB-seconds, so an 8x memory increase paired with an ~8x duration decrease keeps the total roughly flat.",
      "Increasing memory enables multi-threading in the Lambda runtime, which is otherwise disabled.",
      "Lambda applies a volume discount once a function is configured above 512 MB of memory.",
      "The larger memory setting increases the /tmp ephemeral storage allocation, which speeds up disk-bound work."
    ],
    correct: [0, 1],
    explanation: "Correct — memory is the only performance dial in Lambda. vCPU is allocated in proportion to it (a function crosses roughly one full vCPU at 1,769 MB), so CPU-bound code gets dramatically faster as memory rises. Because billing is GB-seconds, doubling memory while halving duration is cost-neutral; here the duration dropped faster than the memory rose, so it is nearly free speed.\n\nWhy the others are wrong:\n• \"Enables multi-threading\": threading is always available in the runtime. What changes is how much CPU those threads actually get.\n• \"Volume discount above 512 MB\": no such pricing tier exists.\n• \"/tmp scales with memory\": ephemeral storage is configured independently (512 MB by default, up to 10,240 MB) and has nothing to do with the memory setting.\n\nRule to remember: for CPU-bound Lambda functions, raising memory often lowers cost. Use AWS Lambda Power Tuning to find the sweet spot rather than defaulting to 128 MB."
  },
  {
    id: "dva1-06", domain: 1, type: "single",
    stem: "A Lambda function in an account with the default 1,000 concurrent executions is given a reserved concurrency of 900. Other functions in the same account begin failing with throttling errors even though total account usage is far below 1,000.\n\nWhat is happening?",
    options: [
      "Reserved concurrency is carved out of the account pool, leaving only 100 concurrent executions to be shared by every other function in the account.",
      "Reserved concurrency guarantees capacity without removing it from the shared pool, so the failures must come from a regional service outage.",
      "Reserved concurrency applies only to provisioned concurrency, so the other functions are throttled by their own provisioned concurrency limits.",
      "Reserved concurrency automatically raises the account limit to 1,900, so the other functions are being throttled by API Gateway instead."
    ],
    correct: [0],
    explanation: "Correct — reserved concurrency does two things at once: it caps the reserved function at that number and it guarantees that number by subtracting it from the account's unreserved pool. Reserving 900 of 1,000 leaves 100 for everything else, so busy neighbours throttle. (AWS also enforces that at least 100 unreserved concurrency remains, which is exactly what is left here.)\n\nWhy the others are wrong:\n• \"Guarantees without removing\": this is the single most common misconception. The guarantee is funded by the shared pool, not created out of thin air.\n• \"Applies only to provisioned concurrency\": these are separate features. Reserved concurrency is a limit; provisioned concurrency pre-warms execution environments and is drawn from within the reservation.\n• \"Raises the account limit\": reservations never raise the account quota; only a service quota increase does.\n\nRule to remember: reserved concurrency is both a ceiling and a floor. Set it to protect a critical function or to protect downstream systems from a noisy one — and always check what is left for everyone else."
  },
  {
    id: "dva1-07", domain: 1, type: "single",
    stem: "A Lambda function must reach a third-party REST API on the public internet and also query an Amazon RDS instance in a private subnet of the same VPC. After the developer attaches the function to the VPC's private subnets, the RDS queries succeed but every call to the third-party API times out.\n\nWhat is the correct fix?",
    options: [
      "Route the private subnets' outbound traffic through a NAT gateway in a public subnet.",
      "Assign a public IP address to the Lambda function's elastic network interface.",
      "Move the Lambda function to the VPC's public subnets so it receives a route to the internet gateway.",
      "Create a VPC interface endpoint for the third-party API's domain name."
    ],
    correct: [0],
    explanation: "Correct — a VPC-attached Lambda function has no public IP and reaches the internet exactly the way a private EC2 instance does: through a NAT gateway sitting in a public subnet, with the private subnet route table sending 0.0.0.0/0 to that NAT gateway.\n\nWhy the others are wrong:\n• Assigning a public IP: you do not control the Hyperplane ENIs Lambda creates, and there is no setting to give them public IPs.\n• Putting Lambda in public subnets: this is the classic trap. A \"public\" subnet routes to an internet gateway, but an internet gateway only works for resources that have a public IP. Lambda ENIs never do, so the function ends up with no internet access at all.\n• VPC interface endpoint: PrivateLink endpoints exist for AWS services and partner services that publish them, not for arbitrary third-party HTTP endpoints.\n\nRule to remember: VPC Lambda + internet = private subnet + NAT gateway. Also remember the function's execution role needs AWSLambdaVPCAccessExecutionRole to manage ENIs."
  },
  {
    id: "dva1-08", domain: 1, type: "single",
    stem: "A Lambda function is invoked asynchronously by Amazon S3. The team needs to capture the failed event payload AND the error response for any invocation that still fails after Lambda's automatic retries, then route it to an SQS queue for analysis.\n\nWhich configuration provides the RICHEST failure information?",
    options: [
      "Configure an on-failure Lambda destination pointing at the SQS queue.",
      "Configure a Lambda dead-letter queue pointing at the SQS queue.",
      "Increase the maximum retry attempts to 5 and enable CloudWatch Logs Insights on the log group.",
      "Add a redrive policy to the S3 event notification with a maxReceiveCount of 3."
    ],
    correct: [0],
    explanation: "Correct — on-failure destinations were built to replace DLQs for asynchronous invocation. The record sent to the destination includes the original request payload, the invocation context (request ID, timestamps), and the error response with stack trace. Destinations also support an on-success target, which DLQs never had.\n\nWhy the others are wrong:\n• Dead-letter queue: a DLQ receives only the original event payload. The error itself is not included, so you have to correlate with CloudWatch Logs by hand. It works, but it is strictly less informative — and the question asks for the richest.\n• More retries plus Logs Insights: retries do not preserve the payload anywhere durable, and searching logs is a manual process, not a routing mechanism.\n• Redrive policy on the S3 notification: S3 event notifications have no redrive policy. That setting belongs to an SQS queue's DLQ configuration.\n\nRule to remember: asynchronous Lambda retries twice automatically (three total attempts). For failure handling, prefer destinations over DLQs; use DLQs only when you need the older behaviour or are on an event source that requires it."
  },
  {
    id: "dva1-09", domain: 1, type: "single",
    stem: "A Lambda function reads batches of 10 messages from an SQS queue. When a single message in the batch fails, the entire batch is returned to the queue and the nine successful messages are processed again.\n\nWhich change makes only the failed message reappear?",
    options: [
      "Enable ReportBatchItemFailures on the event source mapping and return the failed message IDs in the function response.",
      "Set the event source mapping's batch size to 1 so each invocation handles one message.",
      "Delete each successfully processed message explicitly with DeleteMessage inside the handler.",
      "Configure a maximum concurrency of 1 on the event source mapping so batches are processed serially."
    ],
    correct: [0],
    explanation: "Correct — with the ReportBatchItemFailures response type, the function returns a batchItemFailures array containing the itemIdentifier of each message that failed. Lambda deletes the rest and makes only the reported messages visible again. This is partial batch response, and it is the intended solution.\n\nWhy the others are wrong:\n• Batch size of 1: this does solve the duplication, but at roughly 10x the invocation count and cost. It is a workaround, not the mechanism AWS provides.\n• Manual DeleteMessage: this actually works too, but it fights the event source mapping, which will still delete or return the batch based on the function's outcome, and it requires extra IAM permissions and error-prone bookkeeping.\n• Maximum concurrency of 1: this limits parallelism across batches. It has no effect on how a failed batch is retried.\n\nRule to remember: ReportBatchItemFailures is the answer for any \"one bad record poisons the batch\" scenario, on SQS, Kinesis, and DynamoDB Streams alike. For Kinesis and DynamoDB Streams you also have BisectBatchOnFunctionError."
  },
  {
    id: "dva1-10", domain: 1, type: "single",
    stem: "A developer opens a database connection inside the Lambda handler function. Under load, the database reports thousands of short-lived connections and the function's duration is dominated by connection setup.\n\nWhat is the MOST effective code change?",
    options: [
      "Create the connection outside the handler, in the initialization code, so it is reused across invocations in the same execution environment.",
      "Move the connection into a Lambda layer so it is shared by every function that attaches the layer.",
      "Store the connection object in an environment variable so it survives between invocations.",
      "Increase the function timeout so connections have more time to be established."
    ],
    correct: [0],
    explanation: "Correct — code outside the handler runs once per execution environment (the INIT phase), and the environment is reused for many subsequent invocations. Putting the connection, SDK clients, and any expensive configuration there means warm invocations skip the setup entirely.\n\nWhy the others are wrong:\n• Lambda layer: layers ship code and dependencies onto the file system. They do not share live objects or connections between functions — every execution environment is isolated.\n• Environment variable: environment variables are strings, capped at 4 KB in total, and are set at configuration time. You cannot store a live socket in one.\n• Longer timeout: this masks the symptom by allowing slow invocations to finish. It neither reduces connection count nor improves duration.\n\nRule to remember: put anything expensive and reusable in the INIT phase. For relational databases, pair this with RDS Proxy, which pools and multiplexes connections so a concurrency spike does not exhaust the database's connection limit."
  },
  {
    id: "dva1-11", domain: 1, type: "single",
    stem: "A Lambda function backs a synchronous API Gateway endpoint and must return a 12 MB JSON report to the caller.\n\nWhat will happen, and what is the appropriate design?",
    options: [
      "The invocation fails because the synchronous response payload exceeds 6 MB; write the report to S3 and return a presigned URL instead.",
      "The invocation succeeds because Lambda's payload limit applies only to asynchronous invocations; no change is needed.",
      "The invocation succeeds but API Gateway compresses the response automatically; enable content encoding on the stage.",
      "The invocation fails because of the function's 512 MB /tmp limit; increase ephemeral storage to 10,240 MB."
    ],
    correct: [0],
    explanation: "Correct — synchronous Lambda invocations are capped at 6 MB for request and response payloads, and API Gateway independently caps payloads at 10 MB. A 12 MB response breaches both. The standard pattern is to persist the large object in S3 and hand the client a short-lived presigned URL, so the bulk transfer bypasses both services.\n\nWhy the others are wrong:\n• \"Limit applies only to async\": the limits differ but both exist — 6 MB synchronous, 256 KB asynchronous. Async is the tighter one.\n• Automatic compression: API Gateway can compress responses, but the limit is evaluated on the payload Lambda returns, and compression is not automatic.\n• /tmp: ephemeral storage governs files written to disk, not the size of the returned payload.\n\nRule to remember: 6 MB sync, 256 KB async, 10 MB through API Gateway. Anything larger goes through S3 with a presigned URL. (Lambda response streaming via function URLs is the exception, raising the ceiling for streamed responses.)"
  },
  {
    id: "dva1-12", domain: 1, type: "multiple",
    stem: "An inventory table must decrement a stock count by 1 and, in the same operation, insert a row into an audit table. Either both writes succeed or neither does.\n\nWhich TWO statements about implementing this with DynamoDB are correct? (Choose two.)",
    options: [
      "TransactWriteItems can write to multiple tables in a single all-or-nothing operation.",
      "Transactional writes consume twice the write capacity of the equivalent non-transactional writes.",
      "BatchWriteItem provides the same atomicity guarantee with lower cost.",
      "Transactions require both tables to share the same partition key schema.",
      "A DynamoDB transaction can span tables in different AWS Regions when global tables are enabled."
    ],
    correct: [0, 1],
    explanation: "Correct — TransactWriteItems groups up to 100 actions across one or more tables in the same account and Region into a single atomic unit; if any condition fails, everything rolls back. The price of that guarantee is 2x WCU, because DynamoDB performs a prepare and a commit phase.\n\nWhy the others are wrong:\n• BatchWriteItem: it is explicitly not atomic. It is a convenience wrapper that sends up to 25 writes in one call; individual items can fail and come back in UnprocessedItems, and it does not support conditions at all.\n• Shared partition key schema: tables in a transaction are entirely independent; no schema relationship is required.\n• Cross-Region transactions: transactions are single-Region. Global tables replicate asynchronously with last-writer-wins and offer no cross-Region atomicity.\n\nRule to remember: Batch = throughput and fewer round trips, no atomicity. Transact = atomicity, double the cost. Choose deliberately."
  },
  {
    id: "dva1-13", domain: 1, type: "single",
    stem: "A team wants expired session items removed from a DynamoDB table automatically, and wants a Lambda function to run cleanup logic when each item is removed.\n\nWhich implementation is correct AND most cost-effective?",
    options: [
      "Enable TTL on an epoch-seconds attribute, enable DynamoDB Streams, and subscribe the Lambda function to the stream, filtering for REMOVE records generated by TTL.",
      "Schedule an EventBridge rule every 5 minutes to Scan for expired items and delete them with BatchWriteItem.",
      "Enable TTL on an ISO-8601 timestamp attribute and subscribe the Lambda function to DynamoDB Streams.",
      "Enable TTL and configure the TTL setting to invoke the Lambda function directly when an item expires."
    ],
    correct: [0],
    explanation: "Correct — TTL deletes expired items at no WCU cost, and those deletions appear in DynamoDB Streams as REMOVE records. TTL-generated deletions are distinguishable because the record carries a userIdentity with principalId dynamodb.amazonaws.com, letting the function ignore ordinary user deletes.\n\nWhy the others are wrong:\n• Scheduled scan: this is exactly what TTL exists to avoid. You pay RCUs to scan the whole table plus WCUs for every delete, repeatedly.\n• ISO-8601 timestamp: TTL requires a Number attribute holding a Unix epoch time in seconds. A string timestamp is silently ignored and nothing ever expires — a nasty, quiet failure.\n• TTL invoking Lambda directly: TTL has no target configuration. Streams are the integration point.\n\nRule to remember: TTL is a background process — deletion typically happens within 48 hours of expiry, not on the second. If your application must never read an expired item, also filter on the TTL attribute at query time."
  },
  {
    id: "dva1-14", domain: 1, type: "single",
    stem: "A mobile app lets users upload profile photos of up to 8 MB directly to Amazon S3. The photos must not pass through the application servers, and each upload URL must be usable only for a specific object key and expire in 10 minutes.\n\nWhich approach meets the requirements?",
    options: [
      "Have the backend generate a presigned PUT URL scoped to the object key with a 10-minute expiry and return it to the app.",
      "Embed long-lived IAM user access keys in the mobile app and restrict them with a bucket policy.",
      "Make the bucket publicly writable and rely on a bucket policy that allows only s3:PutObject.",
      "Have the app upload to an API Gateway endpoint that proxies the bytes into S3."
    ],
    correct: [0],
    explanation: "Correct — a presigned URL carries a time-limited, cryptographically signed grant for one specific operation on one specific key. The client uploads straight to S3, and the credentials that signed the URL are never exposed.\n\nWhy the others are wrong:\n• Embedded access keys: distributing long-lived credentials in a client binary is indefensible — they can be extracted from any installed copy and never expire on their own.\n• Publicly writable bucket: this lets anyone on the internet write arbitrary objects, and it fails the per-key scoping requirement completely.\n• Proxying through API Gateway: this violates the \"must not pass through the application\" requirement, and API Gateway's 10 MB payload cap leaves almost no headroom for an 8 MB file.\n\nRule to remember: a presigned URL inherits the permissions of whoever signed it, so sign with a narrowly scoped role. For uploads with size or content-type constraints enforced by S3, reach for a presigned POST policy instead."
  },
  {
    id: "dva1-15", domain: 1, type: "single",
    stem: "A data pipeline uploads 4 GB log archives to S3 over an unreliable network connection. Uploads frequently fail near completion and must be restarted from the beginning, and partial data is accumulating storage charges.\n\nWhich TWO-part solution addresses both problems?",
    options: [
      "Use multipart upload so only failed parts are retried, and add a lifecycle rule to abort incomplete multipart uploads after 7 days.",
      "Use S3 Transfer Acceleration and enable versioning to clean up partial objects.",
      "Use multipart upload and enable S3 Intelligent-Tiering to move partial data to a cheaper class.",
      "Split the file into 4 separate objects in the application and reassemble them on download."
    ],
    correct: [0],
    explanation: "Correct — multipart upload splits the object into independently retried parts, so a network blip costs one part instead of 4 GB. Parts already uploaded for an upload that was never completed or aborted remain in the bucket and are billed, and they are invisible in the normal object listing — a lifecycle rule with AbortIncompleteMultipartUpload is the standard cleanup.\n\nWhy the others are wrong:\n• Transfer Acceleration plus versioning: acceleration speeds the transfer over long distances but does not make failures resumable, and versioning has nothing to do with orphaned parts.\n• Intelligent-Tiering: storage classes do not apply to incomplete multipart parts in the way implied, and tiering does not delete anything.\n• Manual splitting: this reinvents multipart upload badly, pushing reassembly onto every consumer.\n\nRule to remember: AWS recommends multipart upload above 100 MB and requires it above 5 GB (the single-PUT ceiling). Always pair it with an abort-incomplete lifecycle rule."
  },
  {
    id: "dva1-16", domain: 1, type: "single",
    stem: "An API Gateway REST API uses a non-proxy (custom) Lambda integration. The team wants to reshape the incoming query string into the JSON structure the Lambda function expects, without changing the function code.\n\nWhich feature accomplishes this?",
    options: [
      "A body mapping template written in Velocity Template Language on the integration request.",
      "A Lambda authorizer that rewrites the event before invocation.",
      "A stage variable that declares the expected input format.",
      "Switching the integration to AWS_PROXY so API Gateway transforms the request automatically."
    ],
    correct: [0],
    explanation: "Correct — non-proxy integrations let you define an integration request mapping template in VTL, which builds the exact JSON payload sent to the backend from path parameters, query strings, headers, and the body. An integration response template can reshape the reply on the way back.\n\nWhy the others are wrong:\n• Lambda authorizer: authorizers return an IAM policy and optional context for authorization decisions. They cannot rewrite the request payload for the integration.\n• Stage variable: stage variables are name-value pairs used inside integration configuration (for example, choosing a Lambda alias). They perform no transformation.\n• Switching to AWS_PROXY: proxy integration does the opposite — it forwards the raw request in a fixed envelope and mapping templates are unavailable, so the function code would have to change.\n\nRule to remember: proxy integration = zero configuration, all logic in code. Non-proxy integration = mapping templates, so you can adapt a legacy backend without touching it."
  },
  {
    id: "dva1-17", domain: 1, type: "single",
    stem: "A REST API must return cached responses for a read-heavy GET endpoint, enforce per-customer request quotas tied to API keys, and validate request bodies against a JSON schema before invoking the backend.\n\nWhich API Gateway API type supports ALL THREE requirements?",
    options: [
      "REST API",
      "HTTP API",
      "WebSocket API",
      "Either REST API or HTTP API, since they are functionally equivalent"
    ],
    correct: [0],
    explanation: "Correct — response caching, usage plans with API keys, and request validation against models are all REST API features. HTTP APIs deliberately drop them in exchange for lower cost and latency.\n\nWhy the others are wrong:\n• HTTP API: it is roughly 70% cheaper and supports JWT authorizers and native service integrations, but it has no built-in caching, no usage plans or API keys, and no request validation. It is the right default for simple Lambda or HTTP proxying — just not here.\n• WebSocket API: it is for persistent bidirectional connections (chat, live dashboards), routed by message content, not for REST-style request/response caching.\n• \"Functionally equivalent\": they are not. Knowing which features are REST-only is a recurring exam theme.\n\nRule to remember: reach for REST API when you need caching, API keys and usage plans, request validation, WAF, private endpoints, or canary stage deployments. Otherwise HTTP API is cheaper and faster."
  },
  {
    id: "dva1-18", domain: 1, type: "single",
    stem: "An order processing workflow must call an external partner system and then wait — potentially for hours — until that partner posts back a result before continuing.\n\nWhich AWS Step Functions pattern is designed for this?",
    options: [
      "A Task state using the .waitForTaskToken integration pattern, with the partner calling SendTaskSuccess or SendTaskFailure.",
      "A Wait state configured with a timestamp several hours in the future.",
      "A Choice state that polls a DynamoDB table until the partner writes a result.",
      "An Express Workflow with a Parallel state that runs the partner call and a timeout branch."
    ],
    correct: [0],
    explanation: "Correct — the callback pattern passes a unique task token to the integration. The state machine pauses (up to one year, billed only for the state transition) until an external system calls SendTaskSuccess or SendTaskFailure with that token. This is the canonical human-approval or third-party-callback pattern.\n\nWhy the others are wrong:\n• Wait state: waiting a fixed time is not the same as waiting for an event. You would either resume too early or waste hours.\n• Polling with a Choice state: this works but burns state transitions on every poll and adds latency equal to the poll interval. The callback pattern exists precisely to eliminate it.\n• Express Workflow: Express Workflows are capped at 5 minutes and are designed for high-volume, short-duration processing. A multi-hour wait requires a Standard Workflow.\n\nRule to remember: Standard Workflows — up to 1 year, exactly-once, full execution history, callbacks. Express Workflows — up to 5 minutes, at-least-once, very high throughput, cheaper."
  },
  {
    id: "dva1-19", domain: 1, type: "single",
    stem: "A FIFO SQS queue receives order events. Orders for the same customer must be processed strictly in sequence, but orders from different customers should be processed in parallel to maximize throughput.\n\nHow should messages be sent?",
    options: [
      "Set MessageGroupId to the customer ID, so ordering is guaranteed within each customer while different groups are consumed in parallel.",
      "Set MessageDeduplicationId to the customer ID, so messages from the same customer are serialized.",
      "Send all messages with the same MessageGroupId and increase the number of consumers.",
      "Use a standard queue and sort messages by timestamp in the consumer."
    ],
    correct: [0],
    explanation: "Correct — in a FIFO queue, MessageGroupId is the unit of ordering and of parallelism. Messages sharing a group ID are delivered in order, one in-flight batch at a time; distinct group IDs are processed concurrently. Using the customer ID gives per-customer ordering with cross-customer throughput.\n\nWhy the others are wrong:\n• MessageDeduplicationId: this controls duplicate suppression within a 5-minute window, not ordering. Using the customer ID here would silently discard every order after the first.\n• One shared group ID: this serializes the entire queue. Adding consumers gains nothing, because only one message group can be in flight at a time.\n• Standard queue with client-side sorting: standard queues make a best-effort ordering attempt only, and a consumer cannot reorder messages it has not received yet.\n\nRule to remember: FIFO throughput scales with the number of distinct message groups. Pick a group ID with high cardinality that still preserves the ordering you actually need."
  },
  {
    id: "dva1-20", domain: 1, type: "single",
    stem: "A publisher sends order events to an SNS topic with three subscribers. One subscriber should receive only events where the order total exceeds 1,000 and the region attribute equals \"EU\".\n\nWhat is the MOST efficient way to achieve this?",
    options: [
      "Apply a subscription filter policy on that subscription so SNS evaluates message attributes and delivers only matching messages.",
      "Have the subscriber receive every message and discard the ones it does not need.",
      "Create a separate SNS topic and have the publisher decide which topic to use for each event.",
      "Insert an SQS queue between SNS and the subscriber and configure a queue-level filter."
    ],
    correct: [0],
    explanation: "Correct — SNS subscription filter policies are evaluated inside SNS. Non-matching messages are never delivered, so you pay no delivery, no invocation, and no downstream processing for them. Filter policies support numeric comparisons, prefix matching, and anything-but conditions.\n\nWhy the others are wrong:\n• Filtering in the subscriber: functionally correct, wasteful in practice. You pay to deliver and process every message just to throw most away.\n• A second topic: this pushes routing logic into the publisher, coupling it to subscriber requirements — the exact coupling pub/sub is meant to remove.\n• Queue-level filter: SQS has no message filtering capability. A consumer can only receive and discard.\n\nRule to remember: SNS filter policies match on message attributes by default; set the filter policy scope to MessageBody to filter on the payload itself. When routing depends on richer event structure or you need archive and replay, EventBridge is the better fit."
  },
  {
    id: "dva1-21", domain: 1, type: "single",
    stem: "A Kinesis Data Stream with 8 shards ingests clickstream data. One shard consistently reports ProvisionedThroughputExceededException while the other seven are nearly idle.\n\nWhat is the MOST likely cause?",
    options: [
      "The partition key has low cardinality or is heavily skewed, so most records hash to the same shard.",
      "The stream's retention period is too short, causing records to be rewritten to a single shard.",
      "Enhanced fan-out is disabled, so all consumers share a single shard's read throughput.",
      "The producer is using the Kinesis Producer Library, which always writes to the first shard."
    ],
    correct: [0],
    explanation: "Correct — Kinesis hashes the partition key to choose a shard. If the key is something like a constant, a country code, or a single hot tenant ID, that traffic concentrates on one shard, which is limited to 1 MB/s or 1,000 records/s for writes. Adding shards does not help until the key distributes evenly.\n\nWhy the others are wrong:\n• Retention period: retention (24 hours by default, up to 365 days) controls how long records remain readable. It has no effect on which shard receives a write.\n• Enhanced fan-out: EFO affects read throughput per consumer, giving each 2 MB/s per shard instead of sharing it. The exception here is on the write path.\n• KPL writing to the first shard: the KPL aggregates and batches records for efficiency; it respects partition key hashing like any producer.\n\nRule to remember: \"one shard hot, the rest idle\" is always a partition key problem. Fix the key (add a random or hashed suffix, or use a higher-cardinality attribute) before scaling shards."
  },
  {
    id: "dva1-22", domain: 1, type: "single",
    stem: "An application must store user session state for a fleet of stateless EC2 instances behind an Application Load Balancer. Sessions must survive the loss of any single instance and be readable in single-digit milliseconds.\n\nWhich option BEST meets the requirement?",
    options: [
      "Store sessions in Amazon ElastiCache.",
      "Store sessions in the instance's local file system and enable sticky sessions on the ALB.",
      "Store sessions in an Amazon S3 bucket with strong read-after-write consistency.",
      "Store sessions in an Amazon RDS table with a read replica in each Availability Zone."
    ],
    correct: [0],
    explanation: "Correct — ElastiCache (Redis or Memcached) is the canonical external session store: sub-millisecond access, shared across the fleet, and independent of any single instance's lifetime. Redis adds replication and persistence if sessions must survive a node failure.\n\nWhy the others are wrong:\n• Local disk plus sticky sessions: this is precisely the pattern the requirement rules out. Losing an instance loses every session pinned to it, and stickiness undermines even load distribution.\n• S3: consistency is not the issue — latency is. S3 is optimized for throughput on objects, with latency in the tens of milliseconds, and it is a poor fit for per-request session reads.\n• RDS with read replicas: it works, but it is heavier and slower than a cache for ephemeral key-value data, and replica lag can serve stale sessions.\n\nRule to remember: DynamoDB is also a defensible session store (with TTL for expiry) and shows up as the correct answer when the emphasis is on serverless and durability rather than raw latency. Read the qualifier in the stem."
  },
  {
    id: "dva1-23", domain: 1, type: "single",
    stem: "A read-heavy application uses ElastiCache in front of a database with a lazy loading (cache-aside) strategy. The team notices that updates written directly to the database are not reflected in the application for a long time.\n\nWhich change addresses stale data with the LEAST additional write overhead?",
    options: [
      "Add a TTL to cached items so they expire and are refetched periodically.",
      "Switch entirely to a write-through strategy so every database write updates the cache.",
      "Disable caching for any entity that can be updated.",
      "Increase the cache node size so more items fit in memory."
    ],
    correct: [0],
    explanation: "Correct — lazy loading only ever populates the cache on a miss, so an item written directly to the database stays stale until it is evicted. Adding a TTL bounds that staleness with no extra work on the write path: the item simply expires and the next read repopulates it.\n\nWhy the others are wrong:\n• Pure write-through: it keeps the cache fresh but adds a cache write to every database write, including for data nobody ever reads, and it leaves the cache cold for existing data after a node restart. The question explicitly asks for the least write overhead.\n• Disabling caching: this trades the entire benefit for correctness that a TTL already provides.\n• Bigger nodes: more memory means fewer evictions, which actually makes stale items live longer. It moves in the wrong direction.\n\nRule to remember: lazy loading = only cached data is requested data, but data can be stale and every miss pays a penalty. Write-through = always fresh, higher write cost, cold cache for untouched data. In production, most teams combine write-through or lazy loading with a TTL."
  },
  {
    id: "dva1-24", domain: 1, type: "single",
    stem: "A DynamoDB table stores IoT readings keyed by deviceId. One device produces 90% of all traffic and its writes are throttled while overall table capacity is barely used.\n\nWhich technique resolves the hot partition?",
    options: [
      "Apply write sharding by appending a calculated suffix to the partition key, spreading that device's writes across multiple logical partitions.",
      "Switch the table to on-demand capacity mode, which removes all per-partition limits.",
      "Create a global secondary index on deviceId to absorb the excess writes.",
      "Enable DynamoDB Accelerator (DAX) to buffer the write traffic."
    ],
    correct: [0],
    explanation: "Correct — throughput in DynamoDB is allocated per partition, and a partition is chosen by the partition key. Write sharding (deviceId#1 … deviceId#N, chosen randomly or by a hash of the timestamp) spreads one logical device across many physical partitions. Reads then query each shard and merge, which is the trade-off you accept.\n\nWhy the others are wrong:\n• On-demand mode: it removes the need to provision capacity and adapts to traffic quickly, but a single partition still has hard physical limits (roughly 1,000 WCU / 3,000 RCU). A key this skewed can still throttle.\n• A GSI on deviceId: an index is a copy of the data with the same skew, so it inherits the same hot partition — and GSI throttling can back-pressure writes to the base table.\n• DAX: DAX is a read-through cache. It does not accelerate or buffer writes; writes go through it to the table.\n\nRule to remember: adaptive capacity absorbs moderate imbalance automatically, but it cannot save a key with fundamentally poor cardinality. Design the partition key for even distribution first."
  },
  {
    id: "dva1-25", domain: 1, type: "single",
    stem: "A Query on a DynamoDB table returns fewer items than expected. The response contains a LastEvaluatedKey value.\n\nWhat does this indicate, and what should the application do?",
    options: [
      "The result set exceeded 1 MB and was truncated; pass LastEvaluatedKey as ExclusiveStartKey on the next Query to retrieve the following page.",
      "The query matched no further items; LastEvaluatedKey marks the final item and should be ignored.",
      "The query was throttled; the application should retry the same request with exponential backoff.",
      "The FilterExpression removed items after the read; increasing the table's RCUs will return the full set in one call."
    ],
    correct: [0],
    explanation: "Correct — DynamoDB reads at most 1 MB per Query or Scan request. When more matching data exists, it returns LastEvaluatedKey, and you continue by passing that value as ExclusiveStartKey. Looping until LastEvaluatedKey is absent is the standard pagination idiom.\n\nWhy the others are wrong:\n• \"Matched no further items\": the opposite. Its absence means the result set is complete; its presence means there is more.\n• Throttling: that surfaces as ProvisionedThroughputExceededException, not as a pagination token.\n• More RCUs: the 1 MB limit is structural and independent of provisioned capacity. Note the related trap — a FilterExpression is applied after the 1 MB read, so a heavily filtered query can return zero items and still hand back a LastEvaluatedKey, having consumed full capacity.\n\nRule to remember: always loop on LastEvaluatedKey. Assuming a single response contains everything is one of the most common real-world DynamoDB bugs."
  },
  {
    id: "dva1-26", domain: 1, type: "single",
    stem: "A developer must store a 2 MB PDF associated with each DynamoDB item.\n\nWhat is the correct design?",
    options: [
      "Store the PDF in Amazon S3 and keep the object key in the DynamoDB item.",
      "Store the PDF as a Binary attribute in the DynamoDB item, compressed with gzip.",
      "Split the PDF across multiple DynamoDB items and reassemble it on read.",
      "Store the PDF in a DynamoDB item and enable DAX to handle the larger payload."
    ],
    correct: [0],
    explanation: "Correct — a DynamoDB item, including attribute names and values, cannot exceed 400 KB. The standard pattern is to store the large object in S3 and keep a pointer (bucket and key) plus metadata in DynamoDB, which keeps items small, queries cheap, and storage costs low.\n\nWhy the others are wrong:\n• Compressed Binary attribute: gzip might squeeze some PDFs under 400 KB, but it is unreliable, and every read of the item now pays RCUs for the full payload (a 400 KB item costs 100 RCUs for a strongly consistent read).\n• Splitting across items: this is a workaround that pushes reassembly and consistency handling into the application, with no atomicity across the parts.\n• DAX: caching does not change item size limits.\n\nRule to remember: 400 KB per item, and RCU/WCU cost scales with item size — so keeping items small is a performance and cost decision, not just a limit to respect."
  },
  {
    id: "dva1-27", domain: 1, type: "multiple",
    stem: "A developer is choosing between Amazon EventBridge and Amazon SNS for routing application events.\n\nWhich TWO capabilities are provided by EventBridge but NOT by SNS? (Choose two.)",
    options: [
      "Archiving events and replaying them to a target at a later time.",
      "Ingesting events directly from third-party SaaS partners such as Datadog or Zendesk.",
      "Delivering the same message to multiple subscribers in a fan-out pattern.",
      "Filtering messages so subscribers receive only a subset of events.",
      "Delivering messages to an SQS queue as a target."
    ],
    correct: [0, 1],
    explanation: "Correct — event archive and replay is unique to EventBridge and invaluable for reprocessing after a bug fix. So is the SaaS partner event source model, where a third party publishes directly onto a partner event bus in your account.\n\nWhy the others are wrong:\n• Fan-out: both do this. SNS is the classic fan-out service, and EventBridge rules can have multiple targets.\n• Filtering: both do this too. SNS uses subscription filter policies; EventBridge uses event patterns, which are richer, but the capability is not exclusive.\n• SQS as a target: both support it.\n\nRule to remember: SNS wins on very high throughput and lowest latency fan-out (and mobile push, SMS, email). EventBridge wins on content-based routing over complex event structure, schema discovery, SaaS integrations, scheduling, and replay."
  },
  {
    id: "dva1-28", domain: 1, type: "single",
    stem: "A Lambda function processes messages that occasionally exceed the SQS maximum message size of 256 KB.\n\nWhat is the recommended way to handle these larger payloads?",
    options: [
      "Use the Amazon SQS Extended Client Library, which stores the payload in S3 and sends a reference through the queue.",
      "Request a service quota increase to raise the SQS maximum message size.",
      "Compress the message with gzip and Base64-encode it before sending.",
      "Split the payload across multiple SQS messages and reassemble them in the consumer."
    ],
    correct: [0],
    explanation: "Correct — the SQS Extended Client Library transparently writes payloads above a configured threshold to an S3 bucket and puts a pointer on the queue. The consuming library resolves the pointer and hands the application the full payload, supporting messages up to 2 GB.\n\nWhy the others are wrong:\n• Quota increase: 256 KB is a hard service limit, not an adjustable quota.\n• Compression: it may help marginally, but it is not a guarantee — already-compressed or binary-heavy payloads barely shrink, and Base64 encoding inflates the result by roughly 33%.\n• Manual splitting: standard queues do not guarantee ordering, so reassembly requires sequencing, correlation, and partial-failure handling that you would have to build and maintain.\n\nRule to remember: the same claim-check pattern applies whenever a payload outgrows a messaging limit — SNS, EventBridge (256 KB), and Step Functions state payloads (256 KB) all point at S3 for the bulk."
  },
  {
    id: "dva1-29", domain: 1, type: "single",
    stem: "A Lambda function must read a 400 MB machine learning model file at startup. The file is too large for the deployment package but must be available on the function's file system, and multiple concurrent executions should share it without re-downloading.\n\nWhich option is the BEST fit?",
    options: [
      "Mount an Amazon EFS file system to the Lambda function and read the model from the mount point.",
      "Package the model in a Lambda layer and read it from /opt.",
      "Download the model from S3 into /tmp during the INIT phase.",
      "Store the model in DynamoDB and assemble it from multiple items at runtime."
    ],
    correct: [0],
    explanation: "Correct — EFS gives Lambda a shared, persistent POSIX file system with no practical size limit. Every concurrent execution environment sees the same mount, so the model is written once and read by all, with no per-environment download.\n\nWhy the others are wrong:\n• Lambda layer: the total unzipped deployment package plus layers cannot exceed 250 MB, so a 400 MB model does not fit.\n• Download to /tmp: this works if ephemeral storage is raised (up to 10,240 MB), but each new execution environment pays the download again, which is the opposite of sharing and inflates cold starts significantly.\n• DynamoDB assembly: a 400 KB item limit makes this a thousand-item reassembly with terrible latency and cost.\n\nRule to remember: for large read-only assets, the ladder is layers (≤250 MB total) → /tmp from S3 (≤10 GB, per-environment) → EFS (shared, unbounded). Container images (up to 10 GB) are the fourth option when the asset can be baked in."
  },
  {
    id: "dva1-30", domain: 1, type: "single",
    stem: "An application writes to a DynamoDB table and must ensure that a read immediately following a successful write always returns the newly written value.\n\nWhich configuration guarantees this?",
    options: [
      "Perform a strongly consistent read on the base table by setting ConsistentRead to true.",
      "Read from a global secondary index with ConsistentRead set to true.",
      "Read through DynamoDB Accelerator (DAX), which serves the most recent write from its item cache.",
      "Perform an eventually consistent read immediately, since DynamoDB writes are synchronous."
    ],
    correct: [0],
    explanation: "Correct — a strongly consistent read on the base table reflects all writes that received a successful response before it. It costs twice as much as an eventually consistent read and cannot be served from a different Region, but it is the guarantee you need.\n\nWhy the others are wrong:\n• Strongly consistent read on a GSI: not possible. GSIs are updated asynchronously and support eventually consistent reads only. This is a frequently tested limitation.\n• DAX: the item cache can return a stale value for the configured TTL. Strongly consistent reads bypass DAX entirely and go to DynamoDB, so DAX gives you no read-after-write guarantee.\n• \"Writes are synchronous, so eventual is fine\": writes are durable when acknowledged, but eventually consistent reads may be served by a replica that has not yet caught up (typically within a second).\n\nRule to remember: strongly consistent reads are available on the base table and on LSIs, never on GSIs. If a GSI read must be authoritative, fetch the key from the index and then read the item from the base table."
  },
  {
    id: "dva1-31", domain: 1, type: "single",
    stem: "Two users load the same DynamoDB item in a web form and submit changes seconds apart. The second save silently overwrites the first user's edits.\n\nWhich technique prevents the lost update while still allowing concurrent access?",
    options: [
      "Optimistic locking: keep a version attribute on the item and write with a ConditionExpression requiring the version to match the one that was read, incrementing it on success.",
      "Pessimistic locking: acquire an exclusive lock on the item with a strongly consistent read before any user opens the form.",
      "Enable DynamoDB Streams and have a Lambda function reconcile conflicting writes after the fact.",
      "Use TransactWriteItems so DynamoDB serializes the two updates in arrival order."
    ],
    correct: [0],
    explanation: "Correct — optimistic locking is the standard DynamoDB answer. Each item carries a version number; the update is conditional on the version still being what the client read. The second writer's condition fails with ConditionalCheckFailedException, and the application can reload and merge or prompt the user, rather than silently discarding work.\n\nWhy the others are wrong:\n• Pessimistic locking: DynamoDB has no lock primitive, and holding a lock across a human's editing session would serialize users and strand locks whenever a browser tab is closed.\n• After-the-fact reconciliation via Streams: the overwrite has already happened and the previous value may be unrecoverable. Streams are for reacting to changes, not preventing them.\n• TransactWriteItems: transactions give atomicity across items, not protection against a stale read. Both writes are individually valid; the second simply carries outdated data.\n\nRule to remember: in the AWS SDKs this is built in — the DynamoDB enhanced client's @DynamoDbVersionAttribute (Java) and equivalents implement exactly this pattern."
  },
  {
    id: "dva1-32", domain: 1, type: "single",
    stem: "A developer needs a counter in DynamoDB that increments reliably even when many clients update it at the same time.\n\nWhich operation should be used?",
    options: [
      "UpdateItem with an UpdateExpression of SET views = views + :incr, which DynamoDB applies atomically on the server.",
      "GetItem to read the current value, then PutItem with the incremented value.",
      "PutItem with a ConditionExpression that the new value is greater than the old one.",
      "BatchWriteItem with all pending increments submitted together."
    ],
    correct: [0],
    explanation: "Correct — this is an atomic counter. DynamoDB performs the read, the addition, and the write as a single server-side operation, so simultaneous increments from many clients all land. The ADD action achieves the same thing and also initializes the attribute if it does not exist.\n\nWhy the others are wrong:\n• Read then write: the textbook lost-update race. Two clients read 100, both write 101, and one increment vanishes.\n• PutItem with a greater-than condition: PutItem replaces the whole item and does not compute anything. The condition might reject some concurrent writes, but the client still has to supply a value it computed from a stale read.\n• BatchWriteItem: it only supports PutItem and DeleteItem — no updates, no expressions, no conditions.\n\nRule to remember: atomic counters are not idempotent. If a network error makes you retry, you may double-count. When exactness matters more than throughput, use a conditional update with a version or a client-supplied request ID instead."
  },
  {
    id: "dva1-33", domain: 1, type: "single",
    stem: "An API Gateway REST API routes to a Lambda function through the AWS_PROXY integration. The Lambda function returns a plain string, and clients receive HTTP 502 Bad Gateway.\n\nWhat is the cause?",
    options: [
      "With proxy integration, the function must return an object containing statusCode and body; anything else is a malformed response.",
      "The function's execution role is missing permission to write to CloudWatch Logs, so API Gateway cannot complete the request.",
      "The integration timeout of 29 seconds was exceeded, which API Gateway reports as 502.",
      "The API stage has no deployment, so the integration returns a gateway error."
    ],
    correct: [0],
    explanation: "Correct — AWS_PROXY integration requires a specific response envelope: at minimum statusCode and body (a string), with optional headers, multiValueHeaders, and isBase64Encoded. If the function returns anything else, API Gateway cannot construct an HTTP response and returns 502.\n\nWhy the others are wrong:\n• Missing logging permission: this means you lose the logs, which makes debugging harder — but the invocation itself still succeeds.\n• Timeout: an integration timeout surfaces as 504 Gateway Timeout, not 502. Distinguishing these two codes is a recurring exam point.\n• Missing deployment: calling an undeployed stage returns 403 with a \"Forbidden\" or missing-authentication-token style message, not 502.\n\nRule to remember: in API Gateway, 502 = the backend replied with something unusable, 504 = the backend did not reply in time, 403 = authorizer, resource policy, or WAF denied it, 429 = throttled."
  },
  {
    id: "dva1-34", domain: 1, type: "single",
    stem: "A single-page application hosted at https://app.example.com calls an API Gateway REST API at https://api.example.com. The browser console shows that the preflight OPTIONS request is failing, and no GET request is ever sent.\n\nWith a Lambda proxy integration, where must the CORS headers come from?",
    options: [
      "Enable CORS on the API so API Gateway answers OPTIONS with a MOCK integration, and return Access-Control-Allow-Origin from the Lambda function on the actual GET response.",
      "Configure CORS only on the API Gateway resource; API Gateway will inject the headers into every proxy response automatically.",
      "Configure the S3 bucket hosting the single-page application with a CORS rule permitting api.example.com.",
      "Disable CORS enforcement by adding Access-Control-Allow-Origin to the request headers sent by the browser."
    ],
    correct: [0],
    explanation: "Correct — CORS has two halves with proxy integration. The preflight OPTIONS request is answered by API Gateway itself (enabling CORS creates a MOCK integration returning the allow headers), but the actual response passes through untouched, so the Lambda function must include Access-Control-Allow-Origin in its own headers. Forgetting the second half is the classic \"preflight passes, real request fails\" bug — and here, the reverse.\n\nWhy the others are wrong:\n• \"API Gateway injects headers automatically\": true for non-proxy integrations where you configure method response headers; false for AWS_PROXY, which returns exactly what the function produced.\n• S3 bucket CORS: that governs browsers fetching objects from the bucket, not calls to a different API host.\n• Adding the header to the request: Access-Control-Allow-Origin is a response header. Browsers ignore it on requests, and CORS cannot be disabled from client-side JavaScript.\n\nRule to remember: CORS is enforced by the browser and satisfied by the server. Any \"works in curl or Postman, fails in the browser\" report is a CORS question."
  },
  {
    id: "dva1-35", domain: 1, type: "single",
    stem: "A team wants a single Lambda function to serve both a staging and a production API Gateway stage, with each stage pointing at a different function version.\n\nWhich approach accomplishes this without duplicating the API?",
    options: [
      "Publish Lambda versions, create aliases such as staging and prod, and reference the alias through an API Gateway stage variable in the integration URI.",
      "Deploy two copies of the API, one per environment, each with a hardcoded function ARN.",
      "Point both stages at $LATEST and use an environment variable inside the function to branch on the stage name.",
      "Use API Gateway canary deployments to route staging traffic to the older function version."
    ],
    correct: [0],
    explanation: "Correct — stage variables act like environment variables for an API stage. Putting ${stageVariables.lambdaAlias} in the integration URI lets one API definition target a different Lambda alias per stage, so promoting a version is an alias update rather than an API change.\n\nWhy the others are wrong:\n• Two API copies: it works but doubles the maintenance surface and invites configuration drift, which is what the question asks you to avoid.\n• Both stages on $LATEST: $LATEST is mutable, so staging and production would always run identical, unpinned code. Branching inside the function on the stage name mixes environment configuration into application logic and offers no rollback story.\n• Canary deployments: canaries split traffic within a single stage to test a new deployment gradually. They are not a mechanism for maintaining separate environments.\n\nRule to remember: Lambda versions are immutable snapshots; aliases are movable pointers. Aliases also support weighted routing, which is how you shift 10% of traffic to a new version."
  },
  {
    id: "dva1-36", domain: 1, type: "single",
    stem: "An application makes frequent calls to a downstream service that occasionally returns HTTP 503. The developer wraps every call in an immediate retry loop of up to 10 attempts. During a partial outage, the downstream service collapses entirely.\n\nWhich change to the retry strategy is correct?",
    options: [
      "Use exponential backoff with jitter and a bounded number of attempts, so retries spread out over time instead of arriving in synchronized waves.",
      "Increase the retry count to 20 so requests eventually succeed once the service recovers.",
      "Retry on all HTTP status codes, including 4xx, to maximize the chance of success.",
      "Remove retries entirely and surface every transient error to the user."
    ],
    correct: [0],
    explanation: "Correct — immediate retries from many clients create a retry storm: the struggling service receives more traffic exactly when it can handle least, a phenomenon called a thundering herd. Exponential backoff spaces attempts out, and jitter (adding randomness to each delay) prevents clients from resynchronizing into the same waves.\n\nWhy the others are wrong:\n• More retries: this amplifies the very problem that caused the collapse.\n• Retrying 4xx: 4xx means the client made a mistake — a bad request or an invalid parameter will fail identically forever. The exception is 429 (throttling), which is retryable with backoff.\n• No retries at all: transient failures are normal in distributed systems, and giving up on the first blip degrades availability unnecessarily.\n\nRule to remember: the AWS SDKs implement exponential backoff with jitter by default and expose maxAttempts and retry-mode (legacy, standard, adaptive). Prefer configuring the SDK over hand-rolling a retry loop."
  },
  {
    id: "dva1-37", domain: 1, type: "single",
    stem: "A Lambda function must know how much execution time remains so it can checkpoint its work before being terminated.\n\nWhere does it get this information?",
    options: [
      "From the context object passed to the handler, using its remaining-time method.",
      "From the event object, which includes the invocation deadline.",
      "From an environment variable that Lambda updates during execution.",
      "By subtracting the current time from the AWS_LAMBDA_FUNCTION_TIMEOUT environment variable."
    ],
    correct: [0],
    explanation: "Correct — the context object exposes the remaining execution time (getRemainingTimeInMillis in Node.js and Java, context.get_remaining_time_in_millis() in Python), along with awsRequestId, functionName, functionVersion, logGroupName, and logStreamName. Checking remaining time is the standard way to exit cleanly before a hard timeout.\n\nWhy the others are wrong:\n• The event object: it carries the invocation payload only. Its shape is defined by the caller or event source, not by Lambda.\n• A live-updating environment variable: environment variables are fixed for the lifetime of the execution environment; the runtime does not mutate them per invocation.\n• Computing from a timeout env var: there is no AWS_LAMBDA_FUNCTION_TIMEOUT variable, and even the configured timeout would not tell you when the current invocation started.\n\nRule to remember: a Lambda timeout kills the invocation with no chance to clean up. If your function does batch work, check remaining time between units and stop gracefully with whatever has been completed."
  },
  {
    id: "dva1-38", domain: 1, type: "multiple",
    stem: "A developer is designing a Lambda function that will be invoked by an event source that may deliver the same event more than once.\n\nWhich TWO techniques make the function idempotent? (Choose two.)",
    options: [
      "Record a unique request identifier from the event in DynamoDB using a conditional write, and skip processing when the write fails because the identifier already exists.",
      "Derive a deterministic key from the event payload and use it as the target object key in S3, so a repeat delivery overwrites the same object instead of creating a duplicate.",
      "Increase the function timeout so retries have time to complete before the next delivery arrives.",
      "Enable reserved concurrency of 1 so only one invocation runs at a time.",
      "Configure the event source mapping to deliver each event exactly once."
    ],
    correct: [0, 1],
    explanation: "Correct — both are real idempotency techniques. A conditional write on a deduplication key turns \"have I seen this before?\" into an atomic server-side check. Deterministic naming makes the operation naturally idempotent, since writing the same key twice produces the same end state.\n\nWhy the others are wrong:\n• Longer timeout: duration has no bearing on duplicate delivery. A duplicate can arrive days later.\n• Reserved concurrency of 1: serializing invocations does not prevent the same event being processed twice, one after the other. It only destroys throughput.\n• \"Configure exactly-once delivery\": most event sources cannot offer it. SQS standard, SNS, and asynchronous Lambda invocation are all at-least-once by design.\n\nRule to remember: idempotency is the application's responsibility in event-driven architectures. The AWS Lambda Powertools libraries provide a ready-made idempotency utility backed by DynamoDB, so you rarely need to build it yourself."
  },
  {
    id: "dva1-39", domain: 1, type: "single",
    stem: "An S3 bucket must trigger a Lambda function when new objects are created, and the same events must also be delivered to an SQS queue owned by a different team. The teams must be able to change their own consumers without coordinating.\n\nWhich design is the MOST decoupled?",
    options: [
      "Configure the S3 event notification to publish to an SNS topic, and have the Lambda function and the SQS queue subscribe to that topic.",
      "Configure two separate S3 event notifications for the same event type, one to Lambda and one to SQS.",
      "Configure the S3 event notification to invoke Lambda, and have the Lambda function forward each event to the SQS queue.",
      "Configure the S3 event notification to publish to SQS, and have the Lambda function poll the same queue alongside the other team's consumer."
    ],
    correct: [0],
    explanation: "Correct — SNS fan-out puts one publisher in front of many independent subscribers. Each team subscribes and unsubscribes on its own, and adding a third consumer later requires no change to the bucket configuration. (Routing S3 events to EventBridge is an equally valid modern answer, adding filtering and replay.)\n\nWhy the others are wrong:\n• Two notifications: historically S3 rejected overlapping event configurations for the same prefix and event type, and even where it works it means every consumer change is a bucket configuration change owned by whoever controls the bucket.\n• Lambda forwarding: this makes one team's function a hard dependency of the other team's pipeline. If it fails or is redeployed, the queue starves — the definition of coupling.\n• Sharing one queue between two consumers: SQS delivers each message to one consumer. The two teams would steal each other's messages, not both receive them.\n\nRule to remember: SQS = one message, one consumer (work distribution). SNS and EventBridge = one message, many consumers (fan-out). Combining SNS with an SQS subscription per consumer gives fan-out plus durable buffering."
  },
  {
    id: "dva1-40", domain: 1, type: "single",
    stem: "A developer needs to grant an application read access to a configuration value that changes weekly, is not sensitive, and is read by thousands of Lambda invocations per minute. Cost must be minimized.\n\nWhich service should be used?",
    options: [
      "AWS Systems Manager Parameter Store with a String parameter in the standard tier.",
      "AWS Secrets Manager with automatic rotation disabled.",
      "A DynamoDB table with a single configuration item.",
      "An encrypted environment variable on each Lambda function."
    ],
    correct: [0],
    explanation: "Correct — Parameter Store standard-tier parameters are free to store, and the value is non-sensitive, changes on a schedule that suits central storage, and can be cached. It is purpose-built for exactly this.\n\nWhy the others are wrong:\n• Secrets Manager: it charges per secret per month plus per API call, and its headline feature — managed rotation with Lambda — is irrelevant for a non-secret. It is the right answer for database credentials, not for configuration.\n• DynamoDB: it works, but you now own a table, its capacity mode, and its access patterns for a single value.\n• Lambda environment variables: the value would be baked into each function's configuration, so a weekly change means redeploying or updating every function — and environment variables cap out at 4 KB total.\n\nRule to remember: at high call volume, use the AWS Parameters and Secrets Lambda Extension. It caches values in a local HTTP endpoint, cutting both latency and API charges dramatically compared with fetching on every invocation."
  },
  {
    id: "dva1-41", domain: 1, type: "single",
    stem: "An application must run a containerized batch job that takes 40 minutes, requires 8 GB of memory, and runs a few times per day. The team does not want to manage servers.\n\nWhich compute option is MOST appropriate?",
    options: [
      "Run the container as an Amazon ECS task on AWS Fargate.",
      "Run the job in an AWS Lambda function packaged as a container image.",
      "Run the job on an EC2 instance in an Auto Scaling group with a minimum size of 1.",
      "Run the job as an AWS Lambda function with provisioned concurrency and 10 GB of memory."
    ],
    correct: [0],
    explanation: "Correct — Fargate runs containers without managed infrastructure, supports long-running tasks with no 15-minute ceiling, and bills only for the vCPU and memory consumed while the task runs. A few 40-minute runs per day is an ideal fit.\n\nWhy the others are wrong:\n• Lambda as a container image: packaging format is not the constraint — the hard 15-minute maximum execution time is. A 40-minute job cannot run in Lambda regardless of how it is packaged.\n• EC2 with a minimum of 1: you pay around the clock for a machine that works a couple of hours a day, and you own patching and scaling.\n• Lambda with provisioned concurrency: the 15-minute limit still applies, and provisioned concurrency would bill continuously for warm environments that sit idle most of the day.\n\nRule to remember: Lambda's 15-minute maximum is the first filter in any compute-selection question. Past that, think Fargate, AWS Batch, or ECS/EKS on EC2."
  },
  {
    id: "dva1-42", domain: 1, type: "single",
    stem: "A developer wants a Lambda function to be triggered only by objects uploaded to the images/ prefix of a bucket with a .png suffix.\n\nWhere is this filtering configured MOST efficiently?",
    options: [
      "In the S3 event notification configuration, using prefix and suffix filter rules.",
      "In the Lambda function code, by checking the object key and returning early for non-matching objects.",
      "In the function's resource-based policy, by scoping the source ARN to the prefix.",
      "In a CloudWatch Logs metric filter applied to the function's log group."
    ],
    correct: [0],
    explanation: "Correct — S3 event notifications support prefix and suffix filters natively. Non-matching objects never generate an event, so you are not invoked and not billed for them.\n\nWhy the others are wrong:\n• Filtering in code: this is correct but wasteful. Every upload of any type invokes the function, and you pay for the invocation and its duration just to discard the event.\n• Resource-based policy: the SourceArn condition constrains which bucket may invoke the function. It is a security boundary, not a content filter, and it does not understand object keys.\n• Metric filter: metric filters scan logs after the fact to produce metrics. They cannot prevent an invocation.\n\nRule to remember: filter as early in the pipeline as possible. The same principle drives SNS filter policies, EventBridge event patterns, and Lambda event source mapping filter criteria for SQS, Kinesis, and DynamoDB Streams."
  },
  {
    id: "dva1-43", domain: 1, type: "single",
    stem: "A DynamoDB table has a GSI that projects only KEYS_ONLY. A query against the index returns the key attributes, and the application then fetches each full item from the base table.\n\nThe team reports that this pattern is slow and expensive at scale. What is the MOST direct improvement?",
    options: [
      "Change the index projection to INCLUDE the specific non-key attributes the query needs, eliminating the fetch back to the base table.",
      "Switch the table to on-demand capacity mode so the extra reads are absorbed automatically.",
      "Enable strongly consistent reads on the GSI to avoid re-reading stale items.",
      "Add a local secondary index with the same key schema as the GSI."
    ],
    correct: [0],
    explanation: "Correct — the second round trip is called a fetch, and it costs an extra read per item plus latency. Projecting the attributes the query actually needs (INCLUDE, or ALL when it needs everything) makes the index self-sufficient, at the cost of extra index storage and write amplification.\n\nWhy the others are wrong:\n• On-demand mode: this changes how you pay, not how much work is done. The fetches still happen.\n• Strongly consistent reads on a GSI: not supported. GSIs are eventually consistent, full stop.\n• An LSI with the same key schema: an LSI must share the base table's partition key, so it cannot replicate a GSI's access pattern — and LSIs cannot be added after table creation.\n\nRule to remember: index projection is a deliberate trade — KEYS_ONLY is cheapest to store and maintain but forces fetches; ALL is the fastest to read but duplicates the whole item and consumes WCUs on every base-table write."
  },
  {
    id: "dva1-44", domain: 1, type: "single",
    stem: "A serverless application must process an uploaded CSV file of up to 500,000 rows. Each row requires an independent API call that takes about 200 ms, and the whole job must complete reliably even if individual rows fail.\n\nWhich architecture is MOST appropriate?",
    options: [
      "Have an S3 event start a Step Functions state machine that uses a Distributed Map state to fan out rows to a Lambda function, with per-item retry and failure tolerance.",
      "Invoke a single Lambda function from the S3 event and iterate over all rows inside one invocation.",
      "Have the S3 event invoke a Lambda function that writes all rows to a DynamoDB table, then run a nightly scan to process them.",
      "Upload the CSV directly to an SQS queue as a single message and let a Lambda function consume it."
    ],
    correct: [0],
    explanation: "Correct — the Distributed Map state in Step Functions is built for exactly this: it reads items straight from an S3 object, fans out up to 10,000 concurrent child executions, and supports per-item retries plus a tolerated failure percentage so a handful of bad rows does not abort the job.\n\nWhy the others are wrong:\n• One Lambda invocation for everything: 500,000 rows at 200 ms each is roughly 27 hours of serial work against a 15-minute ceiling. Even fully parallelized inside one function, a single timeout loses all progress.\n• Write-then-nightly-scan: this adds a full day of latency and a table scan, and it still leaves the actual processing fan-out unsolved.\n• CSV as one SQS message: SQS messages max out at 256 KB, and a single consumer processing the whole file recreates the timeout problem.\n\nRule to remember: when a job is \"many independent units of work with partial-failure tolerance,\" think Step Functions Distributed Map. When it is \"a stream of independent events,\" think SQS with Lambda and partial batch responses."
  },
  {
    id: "dva1-45", domain: 1, type: "single",
    stem: "An application uses the AWS SDK to call DynamoDB from an EC2 instance. The developer must ensure the SDK uses temporary credentials that rotate automatically and are never stored on disk.\n\nWhat should be configured?",
    options: [
      "Attach an IAM role to the instance through an instance profile and let the SDK's default credential provider chain retrieve credentials from the Instance Metadata Service.",
      "Store an IAM user's access keys in ~/.aws/credentials and rotate them with a cron job every 24 hours.",
      "Store the access keys in AWS Secrets Manager and fetch them at application startup.",
      "Pass the access keys as environment variables set by the instance's user data script."
    ],
    correct: [0],
    explanation: "Correct — an instance profile delivers temporary credentials through IMDS. The SDK's default credential provider chain finds them automatically, and they are refreshed before expiry with no code, no files, and no long-lived secrets anywhere.\n\nWhy the others are wrong:\n• Keys on disk with a cron rotation: still long-lived credentials sitting in a file, and now with a homegrown rotation mechanism that can fail silently.\n• Keys in Secrets Manager: this protects the keys at rest, but they are still long-lived IAM user credentials, and they end up in application memory anyway. It solves the storage problem while leaving the credential-type problem.\n• Keys in user data: user data is readable through IMDS by anything running on the instance and is visible in the console. This is worse than a file.\n\nRule to remember: on AWS compute, always use roles — instance profiles on EC2, task roles on ECS, execution roles on Lambda. Also enforce IMDSv2 (session-oriented, token-based) to defend against SSRF attacks that try to steal role credentials."
  },
  {
    id: "dva1-46", domain: 1, type: "single",
    stem: "A developer must ensure that a message published to an SQS queue is not visible to consumers for 10 minutes after it is sent.\n\nWhich setting achieves this?",
    options: [
      "The message timer, set with DelaySeconds on SendMessage, or the queue's delivery delay.",
      "The visibility timeout, set to 600 seconds on the queue.",
      "The message retention period, set to 600 seconds.",
      "The receive message wait time, set to 600 seconds."
    ],
    correct: [0],
    explanation: "Correct — DelaySeconds (up to 900 seconds, or 15 minutes) hides a message from the moment it is sent. Setting it per message is a message timer; setting it on the queue is a delay queue affecting all messages.\n\nWhy the others are wrong:\n• Visibility timeout: this hides a message after a consumer receives it, so no other consumer processes it concurrently. It does nothing before the first receive.\n• Retention period: it controls how long an unconsumed message survives before SQS deletes it — minimum 60 seconds, maximum 14 days, default 4 days.\n• Receive message wait time: this is long polling. It tells ReceiveMessage how long to wait for a message to arrive (up to 20 seconds) before returning empty, which reduces empty responses and cost.\n\nRule to remember: four SQS timers, four distinct jobs — DelaySeconds (before first delivery), visibility timeout (after receipt), retention (lifetime in queue), and wait time (long polling). Exam questions routinely swap them."
  },
  {
    id: "dva1-47", domain: 1, type: "multiple",
    stem: "A DynamoDB Query returns 200 items of roughly 8 KB each, but the application only displays 3 attributes per item. The team wants to reduce the read capacity the query consumes.\n\nWhich TWO changes actually reduce consumed RCUs? (Choose two.)",
    options: [
      "Request eventually consistent reads instead of strongly consistent reads.",
      "Move large, rarely used attributes out of the item into S3 so the stored items become smaller.",
      "Add a ProjectionExpression so the query returns only the 3 displayed attributes.",
      "Add a FilterExpression so fewer items are returned to the application.",
      "Increase the table's provisioned read capacity so the query completes without throttling."
    ],
    correct: [0, 1],
    explanation: "Correct — capacity is a function of how much data DynamoDB reads and how consistently it reads it. Eventually consistent reads cost half of strongly consistent ones, and shrinking the stored item means fewer 4 KB units per read (an 8 KB item costs 2 RCUs strongly consistent; a 3 KB item costs 1).\n\nWhy the others are wrong:\n• ProjectionExpression: this is the most commonly misunderstood point in DynamoDB. Projection reduces what is sent back over the network, but DynamoDB still reads the entire item from storage and charges for its full size. It saves bandwidth and parsing, not RCUs.\n• FilterExpression: filters are applied after items are read. You pay for every item scanned or queried, then some are discarded before the response.\n• More provisioned capacity: this raises the ceiling so you are not throttled. It changes what you are allowed to consume, not what you do consume — and it increases cost.\n\nRule to remember: to genuinely reduce read cost you must read less data (smaller items, tighter key conditions, a well-chosen index) or read it less strictly (eventual consistency). Anything applied after the read is free of charge only in the sense that it costs you nothing extra."
  },
  {
    id: "dva1-48", domain: 1, type: "multiple",
    stem: "A team is migrating from an SQS standard queue to a FIFO queue.\n\nWhich TWO statements about FIFO queues are correct? (Choose two.)",
    options: [
      "Without high throughput mode, a FIFO queue supports up to 300 transactions per second per API action, rising to about 3,000 messages per second when sending batches of 10.",
      "A MessageDeduplicationId, or content-based deduplication, suppresses duplicate sends within a 5-minute deduplication interval.",
      "FIFO queues deliver messages in strict order across the entire queue, regardless of message group.",
      "FIFO queue names have no special requirements and can reuse the existing standard queue name.",
      "FIFO queues remove the need for consumers to be idempotent, because each message is delivered exactly once under all conditions."
    ],
    correct: [0, 1],
    explanation: "Correct — FIFO queues trade throughput for ordering and deduplication guarantees. The base limit is 300 TPS per API action (send, receive, delete), and batching 10 messages per call multiplies effective throughput to roughly 3,000 messages per second; high throughput mode raises this substantially. Deduplication works on a 5-minute window keyed by an explicit MessageDeduplicationId or a SHA-256 of the body when content-based deduplication is enabled.\n\nWhy the others are wrong:\n• Strict order across the whole queue: ordering is guaranteed within a message group, not globally. That is precisely what allows different groups to be processed in parallel.\n• No naming requirement: a FIFO queue name must end with the .fifo suffix, so the migration cannot reuse the old name as-is.\n• \"No need for idempotency\": FIFO offers exactly-once processing within the deduplication window and while a consumer behaves. Application-level retries, cross-window resends, and downstream failures can still produce repeats. Idempotency remains good practice.\n\nRule to remember: choose FIFO when ordering or deduplication is a business requirement, and standard when raw throughput matters more. Do not choose FIFO merely to avoid writing an idempotent consumer."
  }
];
