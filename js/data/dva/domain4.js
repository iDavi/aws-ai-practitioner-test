/* AWS Certified Developer – Associate (DVA-C02)
 * Domain 4: Troubleshooting and Optimization (18% of the exam)
 * Root cause analysis, instrumenting code for observability, and
 * optimizing applications for latency, throughput, and cost.
 */
window.DVA_DOMAIN4 = [
  {
    id: "dva4-01", domain: 4, type: "single",
    stem: "A developer instruments an application with the AWS X-Ray SDK and wants to filter traces by customer tier so that support can find all slow requests from enterprise customers.\n\nHow should the customer tier be recorded?",
    options: [
      "As an annotation, because annotations are indexed and can be used in filter expressions.",
      "As metadata, because metadata supports arbitrary values and is searchable in the console.",
      "As a subsegment name, because subsegment names appear in the service map.",
      "As a custom CloudWatch metric dimension published alongside each trace."
    ],
    correct: [0],
    explanation: "Correct — X-Ray distinguishes two kinds of user data. Annotations are key-value pairs that X-Ray indexes, so they can be used in filter expressions such as annotation.tier = \"enterprise\" and combined with duration filters. That is exactly the described use case.\n\nWhy the others are wrong:\n• Metadata: it accepts arbitrary structures including nested objects, and it is visible when you open an individual trace — but it is not indexed and cannot be filtered on. Use it for diagnostic context you read after finding a trace, not for finding traces.\n• Subsegment name: names identify units of work (a downstream call, a function). Encoding data into names produces unusable cardinality in the service map.\n• A CloudWatch metric dimension: metrics aggregate, so you would learn that enterprise requests are slow without being able to open the specific trace.\n\nRule to remember: annotations are limited (up to 50 per trace) precisely because indexing costs something. Annotate what you search by; put everything else in metadata."
  },
  {
    id: "dva4-02", domain: 4, type: "single",
    stem: "An API Gateway endpoint intermittently returns HTTP 504 to clients. CloudWatch shows the backing Lambda function completing successfully in about 45 seconds.\n\nWhat is happening?",
    options: [
      "The integration exceeded API Gateway's timeout, so API Gateway returned 504 while the Lambda function continued to run to completion.",
      "The Lambda function ran out of memory and was restarted, which API Gateway reports as 504.",
      "The function's reserved concurrency was exhausted, and API Gateway maps throttling to 504.",
      "The client's TCP connection timed out before the response was returned, and API Gateway logged 504 on their behalf."
    ],
    correct: [0],
    explanation: "Correct — API Gateway enforces an integration timeout (29 seconds by default for REST APIs) independently of Lambda's own timeout. When the backend does not respond in time, API Gateway gives up and returns 504 Gateway Timeout, but the Lambda invocation is unaffected and keeps running, which is why the function's own metrics show success. That mismatch is the diagnostic signature.\n\nWhy the others are wrong:\n• Out of memory: that appears as an errored invocation with a memory message in the logs, and the function metrics would show an error rather than success.\n• Throttling: Lambda throttling surfaces to API Gateway as a 429 Too Many Requests, not 504.\n• Client-side timeout: a client giving up produces no status code from API Gateway at all, since nobody is left to receive one.\n\nRule to remember: a synchronous API is the wrong shape for a 45-second job. Convert it to an asynchronous pattern — return 202 Accepted with a job ID, process in the background, and let the client poll or receive a notification."
  },
  {
    id: "dva4-03", domain: 4, type: "single",
    stem: "A Lambda function writes structured JSON logs. The team needs to find all invocations where a field named durationMs exceeded 1000, across a log group containing millions of events.\n\nWhich tool answers this efficiently?",
    options: [
      "CloudWatch Logs Insights, using a query that parses the JSON field and filters on it.",
      "A CloudWatch Logs metric filter, which retroactively scans historical events and produces a metric.",
      "CloudWatch Logs subscription filters streaming to a Lambda function that inspects each event.",
      "Downloading the log streams with the CLI and filtering them locally."
    ],
    correct: [0],
    explanation: "Correct — Logs Insights is a purpose-built query engine over log data. It automatically discovers fields in JSON logs, so a query such as fields @timestamp, @message | filter durationMs > 1000 | sort @timestamp desc runs across the whole group in seconds, with no pre-configuration.\n\nWhy the others are wrong:\n• Metric filter: metric filters apply only to events ingested after the filter is created. They cannot answer questions about the past, which is what this question asks.\n• Subscription filter: subscriptions stream new events to a destination in real time. Again, forward-looking, and building an ad-hoc analysis pipeline for a one-off question is disproportionate.\n• Downloading and filtering locally: it works for small volumes and becomes impractical at millions of events, with significant transfer time and cost.\n\nRule to remember: Logs Insights for ad-hoc investigation of what already happened. Metric filters for continuous alarms on patterns going forward. Subscription filters for streaming logs to another system such as OpenSearch or a data lake."
  },
  {
    id: "dva4-04", domain: 4, type: "single",
    stem: "A developer wants a CloudWatch alarm to fire whenever the string \"OutOfMemoryError\" appears in an application's log group.\n\nWhat is the correct configuration?",
    options: [
      "Create a metric filter on the log group that matches the pattern and increments a custom metric, then create an alarm on that metric.",
      "Create the alarm directly on the log group, selecting the string as the alarm condition.",
      "Create a Logs Insights query and schedule it to run every minute, alarming on its results.",
      "Enable CloudWatch anomaly detection on the log group so unusual entries trigger alarms."
    ],
    correct: [0],
    explanation: "Correct — CloudWatch alarms operate on metrics, not on raw log text. A metric filter bridges the two: it evaluates each incoming log event against a pattern and publishes a data point (typically value 1) to a custom metric when it matches. You then alarm on that metric, usually with treatMissingData set to notBreaching so quiet periods do not trigger it.\n\nWhy the others are wrong:\n• Alarming directly on a log group: not supported. This is the conceptual gap the question tests.\n• Scheduled Logs Insights queries: Insights is interactive and its queries are not natively schedulable into alarms. You would have to build the scheduling and publishing yourself.\n• Anomaly detection: it models the expected range of a numeric metric over time. It does not read log content.\n\nRule to remember: the pipeline is log event → metric filter → custom metric → alarm → SNS action. Note that metric filters only apply to events ingested after creation, so create them before you need them."
  },
  {
    id: "dva4-05", domain: 4, type: "single",
    stem: "A Lambda function publishes 30 custom metrics per invocation with PutMetricData and runs 500 times per second. The team reports high CloudWatch costs and increased function duration.\n\nWhich change reduces both?",
    options: [
      "Emit metrics using the CloudWatch Embedded Metric Format by writing structured log entries, so CloudWatch extracts the metrics asynchronously with no API call from the function.",
      "Batch the 30 metrics into a single PutMetricData call per invocation.",
      "Reduce the metric resolution from high resolution to standard resolution.",
      "Publish the metrics to a custom namespace instead of the AWS/Lambda namespace."
    ],
    correct: [0],
    explanation: "Correct — the Embedded Metric Format lets the function write a specially structured JSON log line, and CloudWatch parses it to extract metrics automatically. There is no synchronous API call, so duration drops and the function is not exposed to PutMetricData throttling or latency. It also preserves the full log line as high-cardinality context alongside the aggregated metric.\n\nWhy the others are wrong:\n• Batching into one call: PutMetricData accepts up to 1,000 metrics per request, so this is a genuine improvement — but it still adds a synchronous network call to every invocation and still bills per metric. EMF removes the call entirely, addressing both stated problems more completely.\n• Standard versus high resolution: high-resolution metrics do cost more, but the dominant costs here are the number of custom metrics and API requests.\n• A different namespace: namespaces organize metrics. They do not change cost or latency (and you cannot publish into the reserved AWS/Lambda namespace anyway).\n\nRule to remember: custom metrics are billed per metric per month, where each unique combination of name and dimension values is a separate metric. High-cardinality dimensions like user ID or request ID cause cost explosions — put those in logs, not dimensions."
  },
  {
    id: "dva4-06", domain: 4, type: "single",
    stem: "A DynamoDB table using provisioned capacity reports ThrottledRequests even though the ConsumedWriteCapacityUnits metric averages well below the provisioned amount.\n\nWhat is the MOST likely explanation?",
    options: [
      "Traffic is concentrated on one partition key, so a single partition's throughput limit is exceeded while the table-level average looks healthy.",
      "The table has too many global secondary indexes, each of which halves the base table's available capacity.",
      "CloudWatch averages capacity over one-minute periods, so the metric is simply inaccurate.",
      "Eventually consistent reads are being counted twice in the consumed capacity metric."
    ],
    correct: [0],
    explanation: "Correct — provisioned throughput is distributed across partitions, and each partition has its own ceiling. A hot key saturates one partition while the table-wide average stays low. This averaging effect is why the CloudWatch metric looks fine during throttling, and it is the single most common DynamoDB throttling scenario.\n\nWhy the others are wrong:\n• GSIs halving base capacity: GSIs have their own independent provisioned capacity. They can cause throttling — a throttled GSI can back-pressure writes to the base table — but they do not halve the base table's capacity.\n• \"CloudWatch is inaccurate\": the metric is correct; it is an aggregate, and the interpretation is what misleads. Averaging a one-minute period also hides short bursts.\n• Eventually consistent reads counted twice: they cost half a unit, not double, and this is about writes in any case.\n\nRule to remember: to confirm a hot key, enable CloudWatch Contributor Insights for DynamoDB, which ranks the most frequently accessed keys. Fixes are write sharding, a better partition key, or caching reads with DAX."
  },
  {
    id: "dva4-07", domain: 4, type: "single",
    stem: "A Java Lambda function behind a user-facing API shows p99 latency of 4 seconds while p50 is 90 milliseconds. Traces show the slow invocations spending most of their time before the handler runs.\n\nWhich optimization targets this problem MOST directly?",
    options: [
      "Enable Lambda SnapStart on a published version, so the initialized execution environment is restored from a snapshot instead of initialized from scratch.",
      "Increase the function's timeout so slow invocations are not cut short.",
      "Move initialization code from outside the handler into the handler so it runs less often.",
      "Increase the batch size on the function's event source mapping."
    ],
    correct: [0],
    explanation: "Correct — the described pattern (a huge gap between median and tail latency, with the time spent before the handler) is a cold start, and JVM initialization is the classic worst case. SnapStart takes a snapshot of the initialized environment after the INIT phase and restores it on invocation, typically cutting cold starts by an order of magnitude at no additional charge.\n\nWhy the others are wrong:\n• Longer timeout: the invocations are completing, just slowly. A timeout change affects nothing here.\n• Moving init into the handler: this makes it worse. Init code outside the handler runs once per environment; inside the handler it runs on every single invocation.\n• Larger batch size: this concerns event source polling and is irrelevant to a synchronous API function.\n\nRule to remember: provisioned concurrency is the alternative — it keeps environments warm and eliminates cold starts entirely, but you pay for them continuously. SnapStart is free but requires a published version and demands care with anything that must be unique per environment (random seeds, cached credentials, open network connections) — handle those in the afterRestore runtime hook."
  },
  {
    id: "dva4-08", domain: 4, type: "single",
    stem: "A Lambda function connecting to an Amazon RDS database begins failing under load with \"too many connections\" errors, even though each invocation opens only one connection.\n\nWhat is the BEST remedy?",
    options: [
      "Put Amazon RDS Proxy between Lambda and the database so connections are pooled and reused across invocations.",
      "Increase the Lambda function's memory so each execution environment handles more requests.",
      "Set the function's reserved concurrency to the account maximum so invocations are spread out.",
      "Switch the database to a larger instance class to raise the connection limit permanently."
    ],
    correct: [0],
    explanation: "Correct — the mismatch is architectural. Lambda scales to many concurrent execution environments, each opening its own connection, while a relational database has a bounded connection limit. RDS Proxy maintains a warm pool and multiplexes many client connections onto a few database connections, and it also improves failover behaviour.\n\nWhy the others are wrong:\n• More memory: it makes each invocation faster but does not change how many environments exist or how many connections they open.\n• Reserved concurrency at the account maximum: this raises the ceiling rather than lowering it, allowing even more concurrent connections. Setting a low reserved concurrency would cap connections, but at the cost of throttling legitimate traffic — a blunt instrument compared with pooling.\n• A larger instance class: it buys headroom and delays the problem without fixing the pattern, at permanently higher cost.\n\nRule to remember: this is the classic serverless-meets-relational problem. RDS Proxy is the standard answer; Aurora Serverless with the Data API (an HTTP interface requiring no persistent connections) is the other common one."
  },
  {
    id: "dva4-09", domain: 4, type: "single",
    stem: "A Kinesis Data Streams consumer implemented as a Lambda function shows a steadily increasing IteratorAge metric.\n\nWhat does this indicate?",
    options: [
      "The consumer is falling behind the rate of incoming records, so the records being processed are progressively older.",
      "Records are expiring from the stream before they can be read, and the retention period must be reduced.",
      "The producer is writing records with timestamps in the past, which inflates the metric.",
      "The stream has too many shards, so each Lambda instance waits longer between batches."
    ],
    correct: [0],
    explanation: "Correct — iterator age measures how old the last processed record is. A rising value means processing is slower than ingestion and the lag is compounding. Left unchecked, records eventually age out of the retention window and are lost permanently, which is why this metric deserves an alarm.\n\nWhy the others are wrong:\n• Reducing the retention period: that makes data loss happen sooner. If anything, raising retention buys time to recover.\n• Producer timestamps: iterator age is computed from when Kinesis received the record, not from any application-supplied timestamp.\n• Too many shards: more shards means more parallelism, since Lambda processes each shard concurrently. Too few shards contributes to lag; too many does not.\n\nRule to remember: the remedies are to make the function faster (optimize code, raise memory), increase parallelism (add shards, or raise ParallelizationFactor up to 10 to run multiple concurrent batches per shard), or reduce work per record. Also check for a poison record stalling a shard — BisectBatchOnFunctionError and a failure destination handle that case."
  },
  {
    id: "dva4-10", domain: 4, type: "single",
    stem: "A distributed application spans API Gateway, a Lambda function, and a DynamoDB table. The team needs an end-to-end view showing where latency accumulates across all three.\n\nWhat must be enabled?",
    options: [
      "Active tracing on the API Gateway stage and the Lambda function, with the X-Ray SDK instrumenting the AWS SDK client used for DynamoDB.",
      "CloudWatch detailed monitoring on all three services, which correlates their metrics automatically.",
      "CloudTrail data events for DynamoDB and Lambda, which record request latency per call.",
      "VPC Flow Logs on the subnets hosting the Lambda function."
    ],
    correct: [0],
    explanation: "Correct — X-Ray builds a trace by propagating a trace ID across services. Enabling active tracing on the API Gateway stage starts the trace, active tracing on the function continues it, and instrumenting the AWS SDK client (via the X-Ray SDK or ADOT) captures the DynamoDB call as a subsegment. The result is a service map and a timeline showing where the milliseconds go.\n\nWhy the others are wrong:\n• Detailed monitoring: it increases metric granularity to one minute for some services. Metrics are aggregates and cannot attribute latency within a single request.\n• CloudTrail data events: they record who called what and when, for auditing. They are not a latency breakdown and are not correlated into traces.\n• VPC Flow Logs: they capture network-level connection metadata, with no application-level request context.\n\nRule to remember: the Lambda execution role needs permission to write traces (AWSXRayDaemonWriteAccess). On Lambda the X-Ray daemon is provided for you; on EC2, ECS, or on-premises you must run the daemon or the ADOT collector yourself."
  },
  {
    id: "dva4-11", domain: 4, type: "single",
    stem: "An application calls a DynamoDB table millions of times per second with a read-heavy workload of repeated item lookups. Response times must drop from single-digit milliseconds to microseconds.\n\nWhich solution requires the FEWEST application changes?",
    options: [
      "Amazon DynamoDB Accelerator (DAX), which is API-compatible with DynamoDB and requires only a client swap.",
      "Amazon ElastiCache for Redis in front of the table, with cache-aside logic in the application.",
      "A global secondary index projecting all attributes, to serve reads separately from writes.",
      "Increasing the table's provisioned read capacity and enabling auto scaling."
    ],
    correct: [0],
    explanation: "Correct — DAX is a write-through cache built specifically for DynamoDB, delivering microsecond reads. Because the DAX client implements the DynamoDB API, adopting it usually means changing the client object your code instantiates, leaving call sites untouched.\n\nWhy the others are wrong:\n• ElastiCache: it delivers comparable latency but you write and own the caching logic — key design, serialization, invalidation, cache-miss handling. That is substantially more application change. It remains the right choice when you need to cache computed results rather than raw items.\n• A GSI with all attributes projected: an index is another copy of the data with the same latency characteristics. It does not accelerate reads.\n• More provisioned capacity: capacity prevents throttling; it does not reduce per-request latency below DynamoDB's normal single-digit milliseconds.\n\nRule to remember: DAX has an item cache (for GetItem and BatchGetItem) and a query cache (for Query and Scan). The important caveat is that strongly consistent reads bypass DAX entirely and go to DynamoDB, so DAX only accelerates eventually consistent reads."
  },
  {
    id: "dva4-12", domain: 4, type: "single",
    stem: "Users in Europe report slow uploads to an S3 bucket located in us-east-1. Files are typically 2 GB.\n\nWhich TWO-part approach best improves upload performance?",
    options: [
      "Enable S3 Transfer Acceleration so uploads enter the AWS network at a nearby edge location, and use multipart upload to parallelize the transfer.",
      "Enable S3 Versioning and use byte-range fetches during upload.",
      "Move the bucket to eu-west-1 and enable Cross-Region Replication back to us-east-1 for uploads.",
      "Enable S3 Intelligent-Tiering and increase the client's socket timeout."
    ],
    correct: [0],
    explanation: "Correct — these address the two distinct bottlenecks. Transfer Acceleration routes the upload to a nearby CloudFront edge location and then over the optimized AWS backbone, cutting the effect of long-distance public internet paths. Multipart upload sends parts in parallel, which is what actually saturates the available bandwidth, and it makes failures resumable.\n\nWhy the others are wrong:\n• Versioning plus byte-range fetches: versioning is about object history, and byte-range fetches are a download optimization. Neither applies to uploads.\n• Moving the bucket and replicating back: this helps European users but adds replication cost and lag, and it does not address the parallelism problem. It is also a much larger change than the question requires.\n• Intelligent-Tiering plus socket timeout: tiering optimizes storage cost for varying access patterns, and raising a timeout makes a slow upload fail less often rather than go faster.\n\nRule to remember: AWS provides the S3 Transfer Acceleration Speed Comparison tool to check whether acceleration actually helps from a given location — it is not always faster, and it carries an additional per-GB charge."
  },
  {
    id: "dva4-13", domain: 4, type: "single",
    stem: "An application makes many SDK calls to the same AWS service and shows high per-call latency. Traces reveal that a significant portion of each call is spent establishing a TLS connection.\n\nWhich optimization applies?",
    options: [
      "Reuse a single SDK client instance across calls and enable HTTP keep-alive so connections are pooled rather than re-established.",
      "Increase the SDK's maximum retry attempts so failed handshakes are retried faster.",
      "Switch the SDK to use the service's IP address directly, bypassing DNS resolution.",
      "Wrap each SDK call in a thread so handshakes happen in parallel."
    ],
    correct: [0],
    explanation: "Correct — creating a client per call means a fresh TCP and TLS handshake every time, which can dominate the latency of short requests. A long-lived client reuses pooled connections. In Lambda this means instantiating the client outside the handler; keep-alive is on by default in current SDK versions (and was historically enabled in Node.js with AWS_NODEJS_CONNECTION_REUSE_ENABLED).\n\nWhy the others are wrong:\n• More retries: retries address failures, not the cost of a successful handshake. More retries under load can make things worse.\n• Hardcoding an IP address: AWS service endpoints resolve to many rotating addresses, so this breaks availability, breaks TLS certificate validation, and saves a DNS lookup that is already cached.\n• Threading the calls: parallelism can improve total throughput, but every thread still pays its own handshake. It hides the waste rather than removing it.\n\nRule to remember: client instantiation is expensive; client use is cheap. Create SDK clients once at startup and reuse them — the same principle as reusing database connections."
  },
  {
    id: "dva4-14", domain: 4, type: "single",
    stem: "A read-heavy REST API serves data that changes at most once per hour. Backend load and cost must be reduced without changing client behaviour.\n\nWhich API Gateway feature should be enabled?",
    options: [
      "Stage-level response caching with an appropriate TTL, so repeated requests are served from the cache without invoking the backend.",
      "Usage plans with a per-key quota, to limit how often each client can call the API.",
      "Request validation, so malformed requests are rejected before reaching the backend.",
      "Payload compression, to reduce the size of responses returned to clients."
    ],
    correct: [0],
    explanation: "Correct — API Gateway stage caching stores integration responses keyed by the request. Within the TTL, matching requests are answered from the cache and the backend is never invoked, which directly reduces both load and Lambda or backend cost. TTL defaults to 300 seconds and can be up to 3600, and cache size ranges from 0.5 GB to 237 GB.\n\nWhy the others are wrong:\n• Usage plan quotas: they cap consumption per API key, which changes client behaviour by rejecting requests. That is throttling, not caching.\n• Request validation: it rejects invalid requests early, which is worthwhile, but valid requests still reach the backend every time — and those are the bulk of the traffic.\n• Payload compression: it reduces bytes on the wire and data transfer cost. The backend is still invoked for every request.\n\nRule to remember: define cache keys carefully from the request parameters that actually vary the response, or you will either serve wrong data or get a near-zero hit rate. Clients holding InvalidateCache permission can bypass the cache with a Cache-Control: max-age=0 header."
  },
  {
    id: "dva4-15", domain: 4, type: "single",
    stem: "During a traffic spike, an application receives ProvisionedThroughputExceededException from DynamoDB. The SDK's default retry behaviour is in effect.\n\nWhat does the SDK do, and what should the developer verify?",
    options: [
      "The SDK retries automatically with exponential backoff and jitter; the developer should verify that the retry count and total timeout are appropriate and that the exception is not being swallowed after retries are exhausted.",
      "The SDK fails immediately on any 400-series error, so the developer must implement all retry logic manually.",
      "The SDK retries indefinitely until the request succeeds, so the developer should add a circuit breaker to prevent hangs.",
      "The SDK converts the exception into a successful empty response, so the developer should check for empty result sets."
    ],
    correct: [0],
    explanation: "Correct — throttling exceptions are classified as retryable, and the AWS SDKs retry them with exponential backoff and jitter by default (three attempts in legacy mode, more in standard and adaptive modes). What deserves verification is what happens after retries are exhausted: the exception surfaces, and application code must handle it rather than logging and continuing.\n\nWhy the others are wrong:\n• \"Fails immediately on 400-series\": most 4xx errors are not retried, but throttling is the deliberate exception — along with 429 and certain transient conditions.\n• Indefinite retries: retries are bounded. An unbounded retry loop would be a serious availability hazard.\n• Silent conversion to an empty response: the SDK never fabricates a successful response. That would hide data loss.\n\nRule to remember: retry-mode standard and adaptive add client-side rate limiting that backs off proactively when throttling is detected. Retries are a band-aid — if throttling is sustained, fix the capacity mode, the partition key, or add caching."
  },
  {
    id: "dva4-16", domain: 4, type: "multiple",
    stem: "Messages in an SQS queue are being received repeatedly and never deleted, but the consuming Lambda function logs show no errors.\n\nWhich TWO checks are MOST relevant? (Choose two.)",
    options: [
      "Whether the function's response reports batch item failures, which makes Lambda return those messages to the queue even though nothing threw an exception.",
      "Whether the queue's visibility timeout is shorter than the function's actual processing time, so messages reappear while still being processed.",
      "Whether the queue's retention period is shorter than the visibility timeout.",
      "Whether the queue has server-side encryption enabled without the correct KMS permissions.",
      "Whether long polling is disabled, which causes the same message to be delivered more than once."
    ],
    correct: [0, 1],
    explanation: "Correct — these are the two mechanisms that cause silent redelivery. If the function returns a batchItemFailures list (or an unexpected response shape while ReportBatchItemFailures is configured), Lambda makes those messages visible again even though no exception was raised and nothing is logged as an error. Separately, if processing outlasts the visibility timeout, the message reappears mid-flight and another invocation picks it up.\n\nWhy the others are wrong:\n• Retention shorter than visibility timeout: an odd configuration, but it causes messages to be deleted permanently, not redelivered.\n• Encryption without KMS permissions: this produces explicit access-denied errors on receive, so the consumer would fail loudly rather than loop quietly.\n• Long polling disabled: short polling causes empty receive responses and higher API cost. It does not duplicate deliveries.\n\nRule to remember: configure a dead-letter queue with a maxReceiveCount so a message that fails repeatedly stops circulating and becomes visible for inspection. A queue with a rising ApproximateAgeOfOldestMessage and no DLQ is a stuck-message incident waiting to happen."
  },
  {
    id: "dva4-17", domain: 4, type: "single",
    stem: "A CloudWatch alarm on a Lambda function's Errors metric never fires, even though the function fails several times per day. The alarm is configured with a threshold of \"greater than 0\" over a 5-minute period with 1 datapoint to alarm.\n\nWhat is the MOST likely cause?",
    options: [
      "The alarm's missing data treatment leaves it in INSUFFICIENT_DATA during quiet periods, and the statistic or period may be smoothing away isolated errors — the Sum statistic over a short period is the appropriate configuration.",
      "Lambda does not publish an Errors metric; only Invocations and Duration are available.",
      "CloudWatch alarms cannot be created on metrics in the AWS/Lambda namespace.",
      "The alarm requires at least 3 datapoints to alarm before it can transition out of OK."
    ],
    correct: [0],
    explanation: "Correct — the usual culprits are the statistic and the missing-data setting. Using Average over 5 minutes dilutes a single error across many invocations to a value below the threshold, whereas Sum counts them. Separately, if the function is idle, no data points are published at all, and the alarm sits in INSUFFICIENT_DATA rather than evaluating — treatMissingData controls how that is handled.\n\nWhy the others are wrong:\n• \"No Errors metric\": Lambda publishes Invocations, Errors, Duration, Throttles, ConcurrentExecutions, DeadLetterErrors, and more.\n• \"Cannot alarm on AWS namespaces\": alarms work on any metric, AWS-published or custom.\n• \"Requires 3 datapoints\": the datapoints-to-alarm value is configurable, and the stem states it is set to 1.\n\nRule to remember: for error counting always use Sum. For latency use percentiles (p90, p99) rather than Average, which hides tail latency behind a comfortable-looking mean."
  },
  {
    id: "dva4-18", domain: 4, type: "single",
    stem: "An application's X-Ray service map shows a downstream service in orange with a high fault rate, but only 5% of requests appear in the traces.\n\nWhat explains the incomplete picture, and how is it changed?",
    options: [
      "X-Ray applies a sampling rule — by default the first request each second plus 5% of additional requests — and the rule can be modified to increase the sampling rate.",
      "The X-Ray SDK drops traces when the daemon's buffer is full, and the buffer size must be increased.",
      "X-Ray retains only 5% of traces after 30 days, and the retention period must be extended.",
      "Only requests that result in a fault are traced, so successful requests are absent by design."
    ],
    correct: [0],
    explanation: "Correct — X-Ray samples deliberately, to bound cost and overhead. The default reservoir-plus-rate rule captures the first request each second and 5% of the rest. You can create custom sampling rules matched on service name, HTTP method, URL path, or host, each with its own reservoir and fixed rate — for example, sampling 100% of requests to a critical checkout endpoint.\n\nWhy the others are wrong:\n• Daemon buffer drops: possible under extreme load and worth knowing, but 5% is exactly the documented default sampling rate, which makes sampling the obvious explanation.\n• A 5% retention policy: X-Ray retains traces for 30 days; it does not discard 95% of them at the end.\n• Only faults traced: sampling is independent of outcome. Successful requests are traced too.\n\nRule to remember: sampling rules are configured centrally in the X-Ray console and picked up by SDKs automatically, so you can change sampling without redeploying the application."
  },
  {
    id: "dva4-19", domain: 4, type: "single",
    stem: "A Lambda function occasionally receives HTTP 429 TooManyRequestsException when invoked synchronously, and the Throttles metric is non-zero while ConcurrentExecutions stays well below the account limit.\n\nWhat is the MOST likely cause?",
    options: [
      "The function has a reserved concurrency setting that is lower than its peak demand, capping it independently of the account limit.",
      "The account's burst concurrency limit was raised, causing requests to be rejected during scale-up.",
      "The function's timeout is too low, so long invocations are converted into throttles.",
      "The function's memory setting is too low, so Lambda rejects invocations to protect the runtime."
    ],
    correct: [0],
    explanation: "Correct — reserved concurrency is a hard per-function cap. Once the function reaches it, further concurrent invocations are throttled with 429 regardless of how much unused account concurrency exists. That is exactly the signature described: function-level throttling with plenty of account headroom.\n\nWhy the others are wrong:\n• A raised burst limit: raising a limit does not cause rejections. Burst concurrency does matter during rapid scale-up (Lambda adds capacity in defined increments after the initial burst), but the stem points to a steady cap rather than a scaling ramp.\n• Timeout: a timeout produces a Lambda.Timeout error on that invocation. It never manifests as a throttle.\n• Memory: memory affects performance and cost. Lambda does not reject invocations because of a memory setting.\n\nRule to remember: throttling comes from one of three places — the account concurrency limit (default 1,000, adjustable), a function's reserved concurrency, or the burst scaling rate during a sudden spike. Check them in that order, and remember that asynchronous invocations are retried on throttle while synchronous ones return 429 to the caller."
  },
  {
    id: "dva4-20", domain: 4, type: "single",
    stem: "A team must correlate a single user request across an API Gateway endpoint, an SQS queue, and two Lambda functions, in logs rather than traces.\n\nWhich practice makes this possible?",
    options: [
      "Generate a correlation ID at the entry point, propagate it through message attributes and function payloads, and include it as a field in every structured log entry.",
      "Rely on the CloudWatch request ID, which is shared by every service handling the same logical request.",
      "Enable CloudTrail and search by event time across all four services.",
      "Use the SQS message ID as the correlation identifier in all downstream components."
    ],
    correct: [0],
    explanation: "Correct — correlation must be explicit. You mint an ID at the boundary (or reuse the incoming X-Ray trace ID or API Gateway request ID), carry it forward in SQS message attributes and in every payload, and log it as a structured field. A Logs Insights query filtered on that field then returns the complete story across all components.\n\nWhy the others are wrong:\n• \"CloudWatch request ID is shared\": each Lambda invocation has its own unique awsRequestId. Nothing propagates it automatically across service boundaries.\n• CloudTrail by event time: CloudTrail records control-plane API calls, not application flow, and time-based correlation collapses immediately under concurrency.\n• SQS message ID: it only exists from the moment the message is enqueued, so it cannot cover the API Gateway hop before it or connect two messages in a chain.\n\nRule to remember: structured JSON logging plus a propagated correlation ID is the foundation of debugging distributed systems. AWS Lambda Powertools implements both, including automatic correlation ID extraction from common event sources."
  },
  {
    id: "dva4-21", domain: 4, type: "single",
    stem: "An application stores 20 GB of infrequently accessed data in DynamoDB and queries it a few times per month for reporting. Costs are dominated by provisioned capacity that sits idle.\n\nWhich change reduces cost with minimal risk?",
    options: [
      "Switch the table to on-demand capacity mode so you pay per request rather than for provisioned throughput.",
      "Reduce provisioned capacity to the minimum and rely on burst capacity for the monthly reports.",
      "Enable DynamoDB Accelerator to reduce the number of reads that reach the table.",
      "Enable TTL on the table so unused items are removed automatically."
    ],
    correct: [0],
    explanation: "Correct — on-demand billing charges per read and write request with no idle capacity charge. For a spiky, low-volume workload like a monthly report, that is dramatically cheaper than provisioning throughput that goes unused 99% of the time, and switching modes requires no application change.\n\nWhy the others are wrong:\n• Minimum capacity plus burst: burst capacity accumulates only up to 300 seconds of unused capacity and is explicitly not guaranteed. A reporting run would throttle heavily.\n• DAX: it adds cluster cost around the clock to accelerate reads that happen a few times a month, and it does nothing about idle provisioned capacity.\n• TTL: it deletes data. The requirement is to keep the data and reduce cost, not to discard it.\n\nRule to remember: on-demand suits unpredictable, spiky, or new workloads. Provisioned with auto scaling suits steady, predictable traffic and is cheaper at sustained high utilization. You can switch between modes (with a cooldown between switches), so start on-demand and move to provisioned once the pattern is known."
  },
  {
    id: "dva4-22", domain: 4, type: "single",
    stem: "A developer must determine why a specific Lambda invocation failed three days ago. The function's log group has a retention setting of \"Never expire\" and contains many streams.\n\nWhat is the FASTEST way to locate the relevant log entries?",
    options: [
      "Query the log group in CloudWatch Logs Insights, filtering on the invocation's request ID over the relevant time window.",
      "Open each log stream in the console and read through it until the failure appears.",
      "Enable X-Ray tracing on the function and re-run the failing invocation.",
      "Export the log group to S3 and query it with Amazon Athena."
    ],
    correct: [0],
    explanation: "Correct — Lambda writes the request ID into the START, END, and REPORT lines of every invocation, so filtering on it in Logs Insights pinpoints that specific invocation across all streams in seconds. Restricting the time window keeps the scanned volume (and cost) small.\n\nWhy the others are wrong:\n• Reading streams manually: Lambda creates a stream per execution environment, so a busy function has hundreds. This does not scale.\n• Enabling X-Ray and re-running: tracing is not retroactive, and re-running may not reproduce a failure that depended on three-day-old state or input.\n• Exporting to S3 and using Athena: a reasonable approach for large-scale historical analysis, but the export alone takes time and this is a single-invocation lookup.\n\nRule to remember: \"Never expire\" is the default for a Lambda log group and is a common source of unnecessary spend. Set a retention period deliberately, and note that the function's execution role needs logs:CreateLogGroup, logs:CreateLogStream, and logs:PutLogEvents — missing them means no logs at all, which is its own confusing failure mode."
  },
  {
    id: "dva4-23", domain: 4, type: "single",
    stem: "An ECS service running on EC2 must send application traces to AWS X-Ray.\n\nWhat is required in addition to instrumenting the application code?",
    options: [
      "Run the X-Ray daemon (or the ADOT collector) as a sidecar container or on the host, and grant the task role permission to write trace segments.",
      "Nothing else — X-Ray is enabled by default on all ECS clusters.",
      "Enable X-Ray tracing on the Application Load Balancer in front of the service.",
      "Attach the AWSXRayDaemonWriteAccess policy to the container instance's EC2 instance profile only."
    ],
    correct: [0],
    explanation: "Correct — the X-Ray SDK does not call the X-Ray API directly. It sends segment documents over UDP to a local daemon, which buffers and uploads them. On Lambda that daemon is provided by the service; on ECS, EC2, or on-premises you must run it yourself, commonly as a sidecar container in the task definition. The identity making the upload needs xray:PutTraceSegments and xray:PutTelemetryRecords.\n\nWhy the others are wrong:\n• \"Enabled by default\": tracing is never automatic outside services that host the daemon for you.\n• Tracing on the ALB: an ALB adds an X-Amzn-Trace-Id header that propagates the trace, which is helpful, but it does not collect or upload your application's segments.\n• Instance profile only: the permissions must belong to whatever identity the daemon runs under. With awsvpc networking and a sidecar, that is the task role, and relying solely on the instance profile is both incorrect here and a poor practice, since it grants the permission to every task on the host.\n\nRule to remember: the pattern is SDK → daemon (UDP 2000) → X-Ray API. When traces are missing, check each hop: is the daemon running, reachable on the expected address, and permitted to upload?"
  },
  {
    id: "dva4-24", domain: 4, type: "single",
    stem: "An application performs a DynamoDB Scan on a 50 GB table every hour to build a report, consuming enormous read capacity.\n\nWhich change delivers the LARGEST improvement?",
    options: [
      "Redesign the access pattern to use Query against an appropriate index (or a sparse index containing only report-relevant items) instead of scanning the whole table.",
      "Enable parallel scan with multiple segments to complete the scan faster.",
      "Add a FilterExpression so only the needed items are returned.",
      "Switch to eventually consistent reads to halve the cost of the scan."
    ],
    correct: [0],
    explanation: "Correct — a Scan reads every item, so its cost and duration grow with the table rather than with the result set. Querying an index goes directly to the relevant items. A sparse index is especially effective for reporting: only items that carry the indexed attribute appear in it, so the index may hold a tiny fraction of the table.\n\nWhy the others are wrong:\n• Parallel scan: it finishes sooner by using more capacity at once. The total read cost is the same or higher, and the throughput spike is more likely to throttle other workloads.\n• FilterExpression: this is the most tempting wrong answer. Filters are applied after items are read, so you pay full RCUs for every item scanned and merely receive fewer of them. It reduces network transfer, not cost.\n• Eventually consistent reads: a genuine 50% saving and worth doing, but it is a constant-factor improvement on a fundamentally wrong access pattern.\n\nRule to remember: in DynamoDB you design tables around access patterns, not the other way round. A recurring Scan is a signal that a required access pattern was never modelled."
  },
  {
    id: "dva4-25", domain: 4, type: "single",
    stem: "A developer notices that a Lambda function's Duration metric averages 200 ms but its billed duration is consistently higher during the first invocation in each execution environment.\n\nWhat accounts for the difference, and is it billed?",
    options: [
      "The INIT phase (cold start) runs the initialization code before the handler; for standard on-demand invocations this initialization time is billed as part of the invocation.",
      "The difference is network latency between the client and the Lambda service, which is not billed.",
      "The difference is the time spent downloading the deployment package, which AWS never bills.",
      "The difference is CloudWatch Logs ingestion time, which is billed separately under CloudWatch."
    ],
    correct: [0],
    explanation: "Correct — a cold start comprises downloading the code, starting the execution environment, and running the initialization code outside the handler. For standard invocations that initialization time is included in the billed duration, which is why heavy module imports and client construction cost real money as well as latency.\n\nWhy the others are wrong:\n• Client network latency: it is outside the function's measured duration entirely and is never part of billed duration.\n• Package download: it is part of the cold start, but framing it as \"never billed\" is wrong — and it is not the whole difference.\n• Log ingestion: CloudWatch charges for ingestion and storage separately, but that does not appear in the function's billed duration.\n\nRule to remember: to shrink cold starts, reduce package size, import only what you need, defer heavy work that is not needed on every path, and choose a lighter runtime where possible. For the tail latency itself, use provisioned concurrency (where INIT is not billed as invocation time) or SnapStart."
  },
  {
    id: "dva4-26", domain: 4, type: "single",
    stem: "An application shows intermittent 500 errors. CloudWatch metrics for the Lambda function show no errors, but API Gateway's 5XXError metric is elevated.\n\nWhere should the developer look next?",
    options: [
      "Enable API Gateway execution logging and access logging on the stage to capture the integration request and response, which reveals whether the failure is in the integration, a mapping template, or the authorizer.",
      "Increase the Lambda function's memory, since 5XX errors indicate resource exhaustion.",
      "Check VPC Flow Logs for rejected packets between API Gateway and Lambda.",
      "Enable DynamoDB Streams to capture the state of the data at the time of failure."
    ],
    correct: [0],
    explanation: "Correct — the discrepancy between a clean Lambda error metric and elevated API Gateway 5XX means the failure happens in API Gateway's own processing. Execution logging records the full request lifecycle — the authorizer decision, mapping template evaluation, the integration request, and the raw integration response — which is what distinguishes a malformed response (502) from a timeout (504) from a mapping template error.\n\nWhy the others are wrong:\n• More memory: nothing indicates resource exhaustion, and the function is not reporting errors at all.\n• VPC Flow Logs: API Gateway invokes Lambda through the AWS API, not through your VPC, so there is no flow to inspect.\n• DynamoDB Streams: it captures data changes. It says nothing about why an HTTP request failed.\n\nRule to remember: execution logging is verbose and can log request and response bodies, so treat it as a debugging tool rather than a permanent setting, and be careful about sensitive data. Access logging with a custom format is the lightweight option suitable for continuous use."
  },
  {
    id: "dva4-27", domain: 4, type: "single",
    stem: "A cost review finds that a Lambda function processing S3 uploads is invoked 10 million times per month, but 90% of invocations exit immediately because the object does not match the expected prefix.\n\nWhich change reduces cost the MOST?",
    options: [
      "Add prefix and suffix filters to the S3 event notification so non-matching uploads never invoke the function.",
      "Reduce the function's memory setting so each wasted invocation costs less.",
      "Increase the function's timeout so matching invocations are not cut short.",
      "Move the prefix check into a Lambda layer shared by all functions."
    ],
    correct: [0],
    explanation: "Correct — the cheapest invocation is the one that never happens. S3 event notification filters are evaluated by S3 before any event is emitted, so 9 million invocations, their duration charges, and their log ingestion disappear entirely.\n\nWhy the others are wrong:\n• Lower memory: it reduces the cost per wasted invocation but you still pay the per-request charge and still generate a log entry for each. It shaves a fraction of a problem you can eliminate.\n• Longer timeout: irrelevant to cost here, and timeouts do not bill unless used.\n• A shared layer: layers change where code lives, not whether the function is invoked. The check still runs 10 million times.\n\nRule to remember: push filtering as far upstream as possible. The same lever exists as SNS subscription filter policies, EventBridge event patterns, and Lambda event source mapping filter criteria — and in each case it removes both compute cost and log volume."
  },
  {
    id: "dva4-28", domain: 4, type: "single",
    stem: "A team wants to be alerted when a business-critical workflow stops processing, but the workflow runs only during business hours and produces no metric data overnight.\n\nHow should the alarm be configured to avoid false alerts?",
    options: [
      "Set the alarm's missing data treatment to notBreaching so quiet periods do not trigger it, and optionally use a composite alarm combining the metric with a schedule-aware condition.",
      "Set the missing data treatment to breaching so any gap in data raises an alert immediately.",
      "Delete and recreate the alarm each morning with an EventBridge scheduled rule.",
      "Set the alarm's evaluation period to 24 hours so overnight gaps are averaged out."
    ],
    correct: [0],
    explanation: "Correct — treatMissingData controls how CloudWatch interprets gaps. notBreaching treats missing data points as within threshold, so an idle overnight period does not alarm. Composite alarms then let you combine conditions (for example, requiring both low throughput and an expectation of activity) to express \"broken during business hours\".\n\nWhy the others are wrong:\n• breaching: this is the opposite of what is needed and would page someone every night.\n• Recreating the alarm daily: this is automation covering for a misconfiguration, adds a moving part that can fail, and loses alarm history.\n• A 24-hour evaluation period: it would suppress overnight noise and also delay detection of a real failure by up to a day, which defeats the alarm's purpose.\n\nRule to remember: the four options are missing, ignore, breaching, and notBreaching. The default is missing, which leaves the alarm in its current state. Choose deliberately — this setting is the difference between a trustworthy alarm and one people learn to ignore."
  },
  {
    id: "dva4-29", domain: 4, type: "multiple",
    stem: "An application's ElastiCache for Redis cluster shows a high number of evictions and a falling cache hit rate, while the database load rises.\n\nWhich TWO responses are appropriate? (Choose two.)",
    options: [
      "Scale the cluster up to a larger node type or out to more shards, increasing the memory available for the working set.",
      "Review the eviction policy and set TTLs so low-value entries expire before memory pressure forces arbitrary eviction.",
      "Disable the eviction policy so no keys are ever removed from the cache.",
      "Reduce the cache node count so fewer nodes compete for memory.",
      "Switch the caching strategy from lazy loading to write-through without changing capacity."
    ],
    correct: [0, 1],
    explanation: "Correct — evictions mean the working set no longer fits in memory, so Redis is discarding keys to make room and the hit rate falls. The two levers are capacity (a larger node type, or more shards in cluster mode) and what you keep (an eviction policy such as allkeys-lru, plus TTLs that expire low-value entries before pressure forces arbitrary eviction).\n\nWhy the others are wrong:\n• Disabling eviction: with noeviction, writes fail once memory is exhausted instead of silently degrading. That converts a performance problem into an outage.\n• Fewer nodes: this reduces total memory and makes evictions worse.\n• Switching to write-through without more capacity: write-through populates the cache with every write, including data nobody reads, which increases memory pressure — the exact opposite of what is needed here.\n\nRule to remember: watch Evictions, CacheHitRate, and DatabaseMemoryUsagePercentage together. Rising evictions with a falling hit rate is the signature of an undersized cache, and the database load increase is the downstream symptom."
  },
  {
    id: "dva4-30", domain: 4, type: "single",
    stem: "A developer must reduce the latency of a global static website served from an S3 bucket in a single Region, and also reduce S3 request costs.\n\nWhich solution addresses both?",
    options: [
      "Serve the site through Amazon CloudFront, which caches objects at edge locations close to users and absorbs repeat requests before they reach S3.",
      "Enable S3 Transfer Acceleration on the bucket so downloads use edge locations.",
      "Enable Cross-Region Replication to buckets in several Regions and use latency-based Route 53 records.",
      "Move the objects to S3 Intelligent-Tiering so frequently accessed objects are served faster."
    ],
    correct: [0],
    explanation: "Correct — CloudFront caches at hundreds of edge locations, so users are served locally and only cache misses reach the origin. That cuts latency and S3 GET request and data transfer charges at the same time, and it adds TLS, custom domains, and WAF integration.\n\nWhy the others are wrong:\n• Transfer Acceleration: it optimizes the network path to the bucket but does not cache. Every request still reaches S3, so request costs are unchanged, and it is aimed at uploads over long distances.\n• Cross-Region Replication with latency routing: this does reduce latency, but you now pay to store the data several times and to replicate it, and you still pay S3 request charges in every Region. It is more expensive and more complex than caching.\n• Intelligent-Tiering: it optimizes storage cost by access pattern. It does not change latency or request pricing.\n\nRule to remember: pair CloudFront with Origin Access Control so the bucket stays private and can only be read through the distribution — the answer to \"fast globally and locked down\" is almost always CloudFront plus OAC."
  },
  {
    id: "dva4-31", domain: 4, type: "multiple",
    stem: "A latency-sensitive Lambda function shows acceptable warm performance but unacceptable cold start times.\n\nWhich TWO changes reduce cold start duration? (Choose two.)",
    options: [
      "Reduce the deployment package size and import only the specific modules the function needs, rather than entire SDK bundles.",
      "Configure provisioned concurrency on the alias the function is invoked through, so execution environments are initialized in advance.",
      "Move initialization work, such as SDK client construction, from outside the handler to inside it.",
      "Increase the function's configured timeout so the cold start has more time to complete.",
      "Increase the event source mapping's batch size so fewer environments are created."
    ],
    correct: [0, 1],
    explanation: "Correct — cold start time is dominated by how much code must be loaded and initialized, and by whether initialization happens on the request path at all. A smaller package with targeted imports shortens the INIT phase, and provisioned concurrency moves INIT off the request path entirely by keeping pre-initialized environments ready.\n\nWhy the others are wrong:\n• Moving init inside the handler: this is actively harmful. Code outside the handler runs once per execution environment; inside the handler it runs on every invocation, so you convert an occasional cold start penalty into a permanent warm-path penalty.\n• A longer timeout: the invocation is slow, not failing. Timeout does not affect initialization speed.\n• A larger batch size: this concerns polling event sources and does not apply to a latency-sensitive synchronous function, nor does it change initialization cost.\n\nRule to remember: raising memory also tends to shorten cold starts, since CPU scales with memory and initialization is CPU-bound. For JVM and .NET functions, SnapStart is the targeted fix and costs nothing extra, unlike provisioned concurrency."
  }
];
