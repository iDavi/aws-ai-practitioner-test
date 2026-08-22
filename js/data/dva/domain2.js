/* AWS Certified Developer – Associate (DVA-C02)
 * Domain 2: Security (26% of the exam)
 * Covers authentication/authorization (IAM, STS, Cognito), encryption
 * (KMS, S3 SSE, ACM), and handling sensitive data in application code.
 */
window.DVA_DOMAIN2 = [
  {
    id: "dva2-01", domain: 2, type: "single",
    stem: "A mobile application authenticates users through a Cognito user pool. After sign-in, the app must upload files directly to Amazon S3 using AWS credentials, with each user restricted to their own folder.\n\nWhich component provides the temporary AWS credentials?",
    options: [
      "A Cognito identity pool, which exchanges the user pool token for temporary credentials from AWS STS.",
      "The Cognito user pool itself, whose access token can be sent directly to the S3 API.",
      "An IAM user created for each application user at sign-up.",
      "An API Gateway Lambda authorizer that returns AWS credentials to the client."
    ],
    correct: [0],
    explanation: "Correct — this is the central Cognito distinction. A user pool authenticates and returns JWTs (ID, access, refresh). An identity pool takes a trusted token and calls STS on your behalf, returning temporary AWS credentials tied to an IAM role. Only an identity pool produces credentials the AWS SDK can sign requests with.\n\nWhy the others are wrong:\n• Sending the user pool token to S3: S3 does not understand Cognito JWTs. AWS APIs require SigV4-signed requests using access key, secret key, and session token.\n• An IAM user per application user: IAM is not built for application end users. There is a hard account limit (5,000 users) and the operational burden is untenable.\n• Lambda authorizer: an authorizer returns an IAM policy document that API Gateway evaluates for that request. It does not mint credentials for the client.\n\nRule to remember: for the per-user folder restriction, the identity pool's role policy uses the policy variable ${cognito-identity.amazonaws.com:sub} in the S3 resource ARN, so each user's credentials only permit their own prefix."
  },
  {
    id: "dva2-02", domain: 2, type: "single",
    stem: "A developer must decide which Cognito user pool token to send to a backend API that needs to make authorization decisions based on the user's group membership and identity.\n\nWhich token is designed for this purpose, and why?",
    options: [
      "The access token, because it carries scopes and cognito:groups claims and is intended to authorize access to resources.",
      "The refresh token, because it is long-lived and can be validated on every request.",
      "The ID token, because it is the only token containing the user's unique subject identifier.",
      "The session token, because it is signed by AWS STS and can be verified by any AWS service."
    ],
    correct: [0],
    explanation: "Correct — OIDC separates concerns. The access token authorizes access to resources and carries scopes and cognito:groups; it is what an API should validate. The ID token describes who the user is (email, name, custom attributes) and is meant for the client application.\n\nWhy the others are wrong:\n• Refresh token: it exists solely to obtain new ID and access tokens when they expire (typically after an hour). It is opaque, must never leave the client, and carries no claims to authorize against.\n• ID token: it does contain sub and cognito:groups, and API Gateway's Cognito authorizer accepts it — but conceptually it authenticates rather than authorizes, and sending identity claims to APIs is discouraged in OIDC.\n• \"Session token\": no such Cognito user pool token exists. Session tokens belong to STS temporary credentials, which are a different mechanism entirely.\n\nRule to remember: ID token = who you are (for the app). Access token = what you may do (for the API). Refresh token = how you get new ones. Always verify the JWT signature against the user pool's JWKS endpoint and check iss, aud, and token_use."
  },
  {
    id: "dva2-03", domain: 2, type: "single",
    stem: "An IAM role has an identity-based policy allowing s3:GetObject on a bucket. The bucket policy contains an explicit Deny for that role's ARN on the same action. A permissions boundary attached to the role also allows s3:GetObject.\n\nWhat is the result of a GetObject call?",
    options: [
      "The request is denied, because an explicit Deny in any applicable policy always overrides every Allow.",
      "The request is allowed, because the identity-based policy and the permissions boundary both permit it, outvoting the bucket policy.",
      "The request is allowed, because bucket policies apply only to principals outside the bucket owner's account.",
      "The result is non-deterministic and depends on which policy AWS evaluates first."
    ],
    correct: [0],
    explanation: "Correct — IAM policy evaluation follows a fixed order and an explicit Deny in any policy type is final. There is no voting or precedence by policy count; a single Deny anywhere ends the evaluation.\n\nWhy the others are wrong:\n• \"Outvoting\": policy evaluation is not a tally. The logic is: evaluate all applicable policies, deny if any explicit Deny matches, allow only if at least one Allow matches and no Deny does, otherwise deny implicitly.\n• \"Bucket policies apply only cross-account\": bucket policies apply to every principal, including those in the owning account. What is true is the reverse for Allows — within the same account, either an identity policy or the resource policy allowing the action is sufficient. Denies always apply.\n• Non-deterministic: IAM evaluation is fully deterministic and documented.\n\nRule to remember: the full order is organization SCPs → resource-based policies → identity-based policies → permissions boundaries → session policies. An explicit Deny at any layer wins; a permissions boundary or session policy can only reduce permissions, never grant them."
  },
  {
    id: "dva2-04", domain: 2, type: "single",
    stem: "A Lambda function in account A must read objects from an S3 bucket in account B.\n\nWhich configuration is required?",
    options: [
      "The bucket policy in account B must allow the function's execution role, and the execution role in account A must allow s3:GetObject on that bucket.",
      "Only the bucket policy in account B needs to allow the function's execution role ARN.",
      "Only the execution role in account A needs an s3:GetObject allow statement for the bucket ARN.",
      "The function must be deployed into a VPC in account B and use a gateway VPC endpoint."
    ],
    correct: [0],
    explanation: "Correct — cross-account access requires permission on both sides. Account B's resource-based policy must allow the principal, and account A's identity-based policy must allow the action. Either one alone is insufficient because each account independently controls what its own principals and resources permit.\n\nWhy the others are wrong:\n• Bucket policy alone: account A's administrator must still permit its role to call S3. Without that, the request fails in account A before it reaches the bucket.\n• Role policy alone: account B never granted access, so S3 denies the request. You cannot grant yourself access to someone else's bucket.\n• VPC endpoint: a gateway endpoint is a network path for private connectivity. It changes routing, not authorization, and Lambda in account A cannot join account B's VPC.\n\nRule to remember: same account — identity policy or resource policy is enough. Cross-account — both are required. The alternative pattern is a cross-account role that account A assumes with sts:AssumeRole, which centralizes the trust in one place."
  },
  {
    id: "dva2-05", domain: 2, type: "single",
    stem: "A third-party SaaS vendor needs to assume a role in a customer's AWS account to read monitoring data. The security team wants to prevent the confused deputy problem, where the vendor could be tricked into accessing another customer's account.\n\nWhich control addresses this specific risk?",
    options: [
      "Require an ExternalId condition in the role's trust policy, with a unique value the vendor must supply when assuming the role.",
      "Require multi-factor authentication in the role's trust policy.",
      "Attach a permissions boundary to the role that restricts it to read-only actions.",
      "Restrict the trust policy to the vendor's source IP address range with an aws:SourceIp condition."
    ],
    correct: [0],
    explanation: "Correct — the ExternalId is a shared secret between you and the vendor, unique per customer. Even if an attacker knows your role ARN and the vendor's account ID, the vendor will only pass the ExternalId it holds for its actual customer, so it cannot be manipulated into assuming your role on someone else's behalf. This is the control AWS documents specifically for the confused deputy problem.\n\nWhy the others are wrong:\n• MFA: an automated third-party service cannot present an MFA token. MFA conditions protect human role assumption.\n• Permissions boundary: it limits the blast radius if access is misused, which is worthwhile defense in depth — but it does nothing to stop the wrong party from assuming the role.\n• Source IP: SaaS vendors run from large, changing address ranges, and IP is spoofable in ways that make it a weak identity signal. It may be a useful additional condition but it is not the answer to this problem.\n\nRule to remember: whenever a question mentions a third party assuming a role in your account, the expected answer is ExternalId."
  },
  {
    id: "dva2-06", domain: 2, type: "multiple",
    stem: "A developer must encrypt a 500 MB file using AWS KMS.\n\nWhich TWO statements correctly describe how this should be done? (Choose two.)",
    options: [
      "Call GenerateDataKey to obtain a plaintext data key and an encrypted copy, encrypt the file locally with the plaintext key, then discard the plaintext key and store the encrypted key alongside the file.",
      "The KMS Encrypt API cannot be used directly, because it accepts a maximum of 4 KB of data.",
      "Call the KMS Encrypt API with the file contents, since KMS transparently handles large payloads by chunking them.",
      "Store the plaintext data key alongside the encrypted file so it can be decrypted quickly later.",
      "Use an asymmetric KMS key, which removes the size limit on the Encrypt operation."
    ],
    correct: [0, 1],
    explanation: "Correct — this is envelope encryption, and it exists precisely because KMS never handles bulk data. GenerateDataKey returns the same key twice: in plaintext (use it, then wipe it from memory) and encrypted under the KMS key (store it with the ciphertext). To decrypt, send the encrypted key to KMS Decrypt to recover the plaintext key. The 4 KB limit on direct Encrypt is the constraint that makes this necessary.\n\nWhy the others are wrong:\n• KMS chunking large payloads: it does not. A payload over 4 KB is rejected outright.\n• Storing the plaintext data key: this defeats the entire scheme. Anyone who can read the file can read the key next to it.\n• Asymmetric keys removing the limit: asymmetric RSA keys have an even smaller payload limit (a few hundred bytes) and are far slower. They are for signing and for key exchange with parties that cannot call KMS.\n\nRule to remember: KMS protects keys, not data. Any \"encrypt a large object\" question resolves to envelope encryption — which is exactly what SSE-KMS does for you inside S3."
  },
  {
    id: "dva2-07", domain: 2, type: "single",
    stem: "An IAM role has the AdministratorAccess policy attached. A developer using that role receives AccessDeniedException when calling kms:Decrypt on a customer managed key.\n\nWhat is the MOST likely cause?",
    options: [
      "The KMS key policy does not grant access to the role, and unlike most resources, a KMS key is not implicitly accessible to IAM administrators in the account.",
      "The key is in a different Region from the caller, and KMS keys are global resources that must be referenced by alias.",
      "The role is missing the kms:GenerateDataKey permission, which is required before kms:Decrypt can succeed.",
      "The key has been scheduled for deletion, which silently blocks all cryptographic operations."
    ],
    correct: [0],
    explanation: "Correct — KMS is unusual: the key policy is the primary authority, and access is not granted by IAM policies alone unless the key policy delegates to the account (the classic statement allowing the account root principal with a kms:ViaService or blanket condition). A key whose policy names only specific principals will deny even an account administrator.\n\nWhy the others are wrong:\n• Cross-Region: KMS keys are regional, not global, so calling the wrong Region gives a NotFoundException rather than AccessDenied. Aliases are regional too.\n• GenerateDataKey as a prerequisite: these are independent permissions. Decrypt does not depend on having GenerateDataKey.\n• Pending deletion: a key pending deletion is in the PendingDeletion state and cryptographic calls fail with KMSInvalidStateException, which is explicit — not silent, and not AccessDenied.\n\nRule to remember: for KMS, always check the key policy first. Effective access is the intersection of the key policy, IAM policies, and any grants. Grants are the mechanism for temporary, programmatic delegation, often used by AWS services on your behalf."
  },
  {
    id: "dva2-08", domain: 2, type: "single",
    stem: "An application uploads thousands of small objects per second to an S3 bucket configured with SSE-KMS. The team begins seeing ThrottlingException from AWS KMS.\n\nWhich change reduces KMS API calls with the least application change?",
    options: [
      "Enable S3 Bucket Keys on the bucket, so S3 uses a short-lived bucket-level key and dramatically reduces requests to KMS.",
      "Switch the bucket to SSE-C so the client supplies the encryption key on every request.",
      "Disable encryption on the bucket and encrypt objects in the application before upload.",
      "Create a separate KMS key for each object prefix to distribute the request load."
    ],
    correct: [0],
    explanation: "Correct — S3 Bucket Keys make S3 request a time-limited bucket-level data key from KMS and derive per-object keys from it locally. AWS documents reductions in KMS request traffic of up to 99%, and enabling it is a bucket setting requiring no code change.\n\nWhy the others are wrong:\n• SSE-C: the client must now generate, transmit, and manage keys on every request, and AWS stores nothing to help you recover from a lost key. That is a large application change and a large operational risk.\n• Disabling encryption and doing it client-side: this abandons the managed encryption requirement and shifts key management to you.\n• Multiple KMS keys per prefix: KMS request quotas are per Region and per account for most operations, so splitting keys does not multiply your quota — and it complicates key management and rotation considerably.\n\nRule to remember: KMS request quotas are a real scaling limit (in the tens of thousands of requests per second, varying by Region and operation). Bucket Keys for S3, DAX for DynamoDB, and caching data keys in your own application are the standard mitigations."
  },
  {
    id: "dva2-09", domain: 2, type: "single",
    stem: "A compliance requirement states that database credentials must be changed every 30 days without any application downtime or code deployment.\n\nWhich service and feature satisfy this?",
    options: [
      "AWS Secrets Manager with automatic rotation using a rotation Lambda function and staging labels.",
      "AWS Systems Manager Parameter Store with a SecureString parameter and a scheduled EventBridge rule.",
      "Encrypted Lambda environment variables updated by a monthly CI/CD pipeline run.",
      "AWS KMS automatic key rotation enabled on the key that encrypts the credentials."
    ],
    correct: [0],
    explanation: "Correct — Secrets Manager was built for this. A rotation Lambda creates a new credential, tests it, and moves staging labels so AWSCURRENT points to the new version while AWSPREVIOUS retains the old one. Applications resolve the secret by name and pick up the new value without redeployment, and the overlap window prevents downtime.\n\nWhy the others are wrong:\n• Parameter Store plus EventBridge: SecureString parameters store secrets well but have no built-in rotation workflow. You would have to build the rotation, the testing, and the safe cutover yourself — reimplementing Secrets Manager.\n• Environment variables via CI/CD: every rotation becomes a deployment of every consuming function, which is exactly the \"no code deployment\" the requirement excludes.\n• KMS key rotation: this rotates the key material that encrypts data. The database password itself is unchanged, so it does not meet a credential rotation requirement at all.\n\nRule to remember: Secrets Manager costs more than Parameter Store, and the feature you pay for is managed rotation plus cross-account access. If a question emphasizes rotation, the answer is Secrets Manager."
  },
  {
    id: "dva2-10", domain: 2, type: "single",
    stem: "During a code review, a developer finds AWS access keys hardcoded in a source file that was committed to a public repository three months ago.\n\nWhat is the FIRST action that should be taken?",
    options: [
      "Deactivate and delete the exposed access keys immediately, then review CloudTrail for unauthorized activity.",
      "Rewrite the Git history to remove the commit containing the keys.",
      "Add the file to .gitignore and push a new commit that removes the keys.",
      "Rotate the keys on the next scheduled maintenance window and add git-secrets to the pipeline."
    ],
    correct: [0],
    explanation: "Correct — the keys must be assumed compromised the moment they were published. Revoking them removes the attacker's access; everything else is cleanup. Reviewing CloudTrail then tells you whether they were already used and what was touched.\n\nWhy the others are wrong:\n• Rewriting history: valuable eventually, but the keys have been public for three months. They are certainly scraped and cached. Scrubbing history while live credentials remain valid is fixing the record instead of the breach.\n• .gitignore plus a removal commit: the keys stay in history and remain valid. This is the weakest option of the four.\n• Waiting for a maintenance window: an active exposed credential is an incident, not a scheduled task. Adding git-secrets is a good preventive step for later.\n\nRule to remember: the order for a leaked credential is revoke → investigate → remediate the pipeline → clean history. Then remove the root cause by switching to IAM roles, so there is no long-lived key to leak in the first place."
  },
  {
    id: "dva2-11", domain: 2, type: "single",
    stem: "An S3 bucket policy must allow uploads ONLY when the object is encrypted with a specific KMS key.\n\nWhich condition should the Deny statement use?",
    options: [
      "Deny s3:PutObject when s3:x-amz-server-side-encryption-aws-kms-key-id does not match the required key ARN.",
      "Deny s3:PutObject when aws:SecureTransport is false.",
      "Deny s3:PutObject when s3:x-amz-acl is not set to private.",
      "Deny kms:Encrypt when kms:KeyId does not match the required key ARN."
    ],
    correct: [0],
    explanation: "Correct — S3 exposes the encryption request headers as condition keys. Pairing a Deny on s3:x-amz-server-side-encryption (when it is not aws:kms) with a Deny on s3:x-amz-server-side-encryption-aws-kms-key-id (when it is not the required ARN) enforces both that KMS encryption is used and that it is the right key.\n\nWhy the others are wrong:\n• aws:SecureTransport: this enforces TLS for data in transit. It is a good statement to include, but it says nothing about encryption at rest.\n• s3:x-amz-acl: this constrains the object's ACL, an access control setting unrelated to encryption.\n• Denying kms:Encrypt in a bucket policy: a bucket policy governs S3 actions on S3 resources. KMS permissions belong in the key policy or an IAM policy, and SSE-KMS actually calls GenerateDataKey rather than Encrypt.\n\nRule to remember: the caller also needs kms:GenerateDataKey and kms:Decrypt on the key — Decrypt is required even for uploads, because S3 must unwrap the data key. A policy that grants only Encrypt is a common cause of mysterious upload failures."
  },
  {
    id: "dva2-12", domain: 2, type: "single",
    stem: "A REST API must accept requests only from users authenticated by a Cognito user pool, and the validation must not require writing custom code.\n\nWhich API Gateway authorizer type should be used?",
    options: [
      "A Cognito user pool authorizer, which validates the JWT against the user pool automatically.",
      "A Lambda authorizer in TOKEN mode that decodes and validates the JWT.",
      "IAM authorization using SigV4-signed requests.",
      "An API key attached to a usage plan."
    ],
    correct: [0],
    explanation: "Correct — a Cognito user pool authorizer is a built-in integration. API Gateway validates the token's signature, expiry, and issuer against the configured user pool with no code to write or maintain, and passes the claims to the backend.\n\nWhy the others are wrong:\n• Lambda authorizer: it would work, but you write and maintain the validation logic, pay for each invocation, and add latency. It is the right choice for custom schemes, third-party identity providers, or complex policy logic — not for plain Cognito.\n• IAM authorization: this authenticates AWS principals with SigV4. It fits service-to-service calls or clients that already hold AWS credentials (for example, via a Cognito identity pool), not raw JWTs from a user pool.\n• API keys: these identify a calling application for throttling and quota purposes. AWS documentation is explicit that API keys are not an authentication mechanism.\n\nRule to remember: on an HTTP API, the equivalent is the JWT authorizer, which works with Cognito and any OIDC provider. Both cache authorizer results, which is worth knowing when debugging stale authorization decisions."
  },
  {
    id: "dva2-13", domain: 2, type: "single",
    stem: "A Lambda authorizer returns an IAM policy allowing execute-api:Invoke on a specific method ARN. Developers notice that after a user's permissions are revoked in the backend system, the user can still call the API for several minutes.\n\nWhat explains this?",
    options: [
      "API Gateway caches the authorizer's returned policy for the configured TTL, so revocation takes effect only after the cache entry expires.",
      "The Lambda authorizer's execution role retains cached credentials from AWS STS for up to 15 minutes.",
      "The user's Cognito refresh token remains valid until it is explicitly revoked in the user pool.",
      "API Gateway stage caching is enabled, so the entire response including authorization is served from cache."
    ],
    correct: [0],
    explanation: "Correct — authorizer result caching exists to avoid invoking the authorizer on every request. The policy is cached against the identity source (usually the Authorization header) for the TTL, which defaults to 300 seconds and can be up to 3600. Until it expires, API Gateway reuses the old decision.\n\nWhy the others are wrong:\n• STS credential caching: this affects the authorizer function's own AWS API calls, not whether the authorizer runs or what it returns.\n• Refresh token validity: a refresh token obtains new tokens; it does not keep an already-issued authorization decision alive. And the scenario describes revocation in a backend system, not in Cognito.\n• Stage caching: response caching stores integration responses per method and cache key. It is a separate feature, and enabling it would produce stale data, not stale authorization.\n\nRule to remember: if immediate revocation matters, set the authorizer TTL to 0 (disabling the cache) and accept the extra invocation cost and latency, or design the backend to re-check on sensitive operations."
  },
  {
    id: "dva2-14", domain: 2, type: "single",
    stem: "A developer sets a Lambda environment variable containing a database password. The security team requires that the value not be readable in plaintext by anyone who can view the function's configuration.\n\nWhich approach satisfies this?",
    options: [
      "Enable encryption helpers with a customer managed KMS key, encrypt the value in transit, and decrypt it in code at startup — or better, store the password in Secrets Manager and fetch it at initialization.",
      "Rely on the default encryption Lambda applies to environment variables at rest, which already hides the value from console users.",
      "Base64-encode the password before setting it as the environment variable.",
      "Set the environment variable through the CLI rather than the console, which stores it encrypted."
    ],
    correct: [0],
    explanation: "Correct — Lambda encrypts environment variables at rest by default, but the console decrypts and displays them to anyone with lambda:GetFunctionConfiguration. Encryption helpers with a customer managed key mean the stored value is ciphertext that the console shows encrypted, and only principals with kms:Decrypt on that key can read it. Referencing an external secret store is the cleaner design.\n\nWhy the others are wrong:\n• Default at-rest encryption: real, but it protects against disk-level access, not against a console user. That is exactly the threat described.\n• Base64: an encoding, not encryption. Anyone can decode it instantly.\n• CLI versus console: the storage is identical; the interface used to set it changes nothing.\n\nRule to remember: environment variables are for configuration, not secrets. Prefer Secrets Manager or Parameter Store SecureString fetched during INIT, and use the Parameters and Secrets Lambda Extension to cache the value and avoid an API call on every invocation."
  },
  {
    id: "dva2-15", domain: 2, type: "multiple",
    stem: "A team must ensure that objects in an S3 bucket are encrypted at rest and that all access happens over HTTPS.\n\nWhich TWO configurations enforce these requirements? (Choose two.)",
    options: [
      "Set the bucket's default encryption to SSE-KMS so every object is encrypted when written.",
      "Add a bucket policy that denies all actions when the aws:SecureTransport condition key is false.",
      "Enable S3 Versioning so previous encrypted versions are retained.",
      "Enable S3 Block Public Access on the bucket.",
      "Enable S3 Transfer Acceleration so uploads use the CloudFront edge network over TLS."
    ],
    correct: [0, 1],
    explanation: "Correct — default bucket encryption guarantees at-rest encryption regardless of whether the client requested it, and a Deny statement conditioned on aws:SecureTransport being false rejects any plain HTTP request. Together they cover data at rest and data in transit.\n\nWhy the others are wrong:\n• Versioning: it protects against overwrite and deletion, which is durability, not encryption.\n• Block Public Access: an essential control that prevents accidental public exposure, but it neither encrypts data nor forces TLS.\n• Transfer Acceleration: a performance feature for long-distance transfers. It does not enforce anything.\n\nRule to remember: S3 has applied SSE-S3 by default to all new objects since January 2023, so \"is it encrypted\" is now usually yes — but explicit default encryption plus a policy that denies unencrypted PUTs is still how you prove enforcement to an auditor."
  },
  {
    id: "dva2-16", domain: 2, type: "single",
    stem: "A developer generates a presigned URL for an S3 object using credentials from an IAM role. The URL is configured to expire in 12 hours, but users report it stops working after about one hour.\n\nWhat is the cause?",
    options: [
      "A presigned URL is invalid once the credentials that signed it expire, and the assumed role session lasted only one hour.",
      "Presigned URLs have a hard maximum lifetime of one hour that cannot be extended.",
      "The object's storage class changed to S3 Glacier, invalidating the signature.",
      "The bucket's default encryption setting causes the signature to be recalculated hourly."
    ],
    correct: [0],
    explanation: "Correct — a presigned URL is only as durable as the credentials used to sign it. Temporary credentials from sts:AssumeRole default to a one-hour session, so the URL dies with the session no matter what expiry you requested.\n\nWhy the others are wrong:\n• \"Hard one-hour maximum\": SigV4 presigned URLs can be valid for up to 7 days. The one-hour behaviour here comes from the credentials, not the URL format.\n• Storage class: moving an object to Glacier makes retrieval require a restore, and the error would be about the storage class — it does not invalidate signatures.\n• Default encryption: encryption settings have no interaction with request signing.\n\nRule to remember: to sign a long-lived URL, either raise the role's MaxSessionDuration (up to 12 hours) and request a longer session, or sign with credentials that do not expire quickly. Lambda execution role credentials rotate frequently, which makes Lambda a poor place to sign very long-lived URLs."
  },
  {
    id: "dva2-17", domain: 2, type: "single",
    stem: "An application must call an AWS service from an on-premises server. The security team forbids storing long-lived IAM credentials on the server, and the company already runs an OIDC-compatible identity provider.\n\nWhich approach should the developer use?",
    options: [
      "Configure an IAM OIDC identity provider and have the application call sts:AssumeRoleWithWebIdentity to obtain temporary credentials.",
      "Create an IAM user with programmatic access and store its keys in an encrypted file on the server.",
      "Use sts:GetSessionToken with the root account credentials to issue temporary credentials.",
      "Install the AWS Systems Manager agent and use its instance profile to obtain credentials."
    ],
    correct: [0],
    explanation: "Correct — an IAM OIDC identity provider establishes trust between AWS and your existing IdP. The application presents an OIDC token to AssumeRoleWithWebIdentity and receives temporary credentials tied to an IAM role, with no long-lived secret on the server. This is the same mechanism behind IAM Roles for Service Accounts on EKS and GitHub Actions OIDC.\n\nWhy the others are wrong:\n• IAM user keys in an encrypted file: still long-lived credentials on the server. Encrypting the file at rest does not change what happens when the process reads it or the host is compromised.\n• GetSessionToken with root credentials: root credentials must never be used programmatically, and this still requires long-lived keys to exist.\n• Systems Manager agent with an instance profile: instance profiles are an EC2 concept. The on-premises equivalent is Systems Manager hybrid activations, which issue a managed instance role — a valid alternative, but it does not use the OIDC provider the company already operates.\n\nRule to remember: the STS call tells you the federation type — AssumeRole (IAM principal), AssumeRoleWithWebIdentity (OIDC, including Cognito identity pools), AssumeRoleWithSAML (enterprise SAML 2.0)."
  },
  {
    id: "dva2-18", domain: 2, type: "single",
    stem: "A KMS key has automatic key rotation enabled. A developer asks whether previously encrypted data must be re-encrypted after rotation.\n\nWhat is the correct answer?",
    options: [
      "No — KMS retains all previous backing key material and automatically uses the correct version to decrypt older ciphertext; the key ID and ARN never change.",
      "Yes — all data must be re-encrypted within 30 days or it becomes unreadable.",
      "No — rotation creates a new key with a new ARN, and an alias must be repointed to it.",
      "Yes — but only for data encrypted with data keys, not for data encrypted directly with the KMS key."
    ],
    correct: [0],
    explanation: "Correct — automatic rotation creates new cryptographic material while keeping the same logical key: same key ID, same ARN, same policies and grants. KMS records which backing key encrypted each ciphertext and selects it transparently on decrypt. Nothing needs to be re-encrypted, and applications notice nothing.\n\nWhy the others are wrong:\n• Re-encrypt within 30 days: no such requirement or expiry exists. Old material is retained for as long as the key exists.\n• New key with a new ARN: that describes manual rotation, where you create a genuinely new key and repoint an alias. Automatic rotation is not that.\n• A distinction between data keys and direct encryption: rotation works identically for both.\n\nRule to remember: automatic rotation happens yearly by default (configurable between 90 days and 7 years) and applies to symmetric customer managed keys. It is not supported for asymmetric keys, HMAC keys, or keys in custom key stores — and imported key material must be rotated manually."
  },
  {
    id: "dva2-19", domain: 2, type: "single",
    stem: "A developer encrypts data with KMS and passes an encryption context of {\"purpose\": \"invoice\"}. A later decrypt call omits the encryption context.\n\nWhat happens?",
    options: [
      "The decrypt call fails, because the encryption context is additional authenticated data that must match exactly.",
      "The decrypt call succeeds, because the encryption context is only metadata used for CloudTrail logging.",
      "The decrypt call succeeds but returns the ciphertext unchanged.",
      "The decrypt call succeeds only if the caller has the kms:ReEncrypt permission."
    ],
    correct: [0],
    explanation: "Correct — the encryption context is cryptographically bound to the ciphertext as additional authenticated data (AAD). It is not secret, but it is authenticated: decryption fails unless the exact same key-value pairs are supplied. That is what makes it useful for enforcing intent.\n\nWhy the others are wrong:\n• \"Only metadata for logging\": it does appear in CloudTrail, which is genuinely useful for auditing, but that is a side benefit rather than its function.\n• Returning ciphertext unchanged: decryption either succeeds and returns plaintext or fails. There is no pass-through mode.\n• ReEncrypt permission: a different operation entirely, used to move ciphertext from one key to another without exposing plaintext.\n\nRule to remember: encryption context is powerful in policies. A kms:EncryptionContext:purpose condition in a key policy lets you grant a principal decryption rights for invoices only, even though everything uses the same key."
  },
  {
    id: "dva2-20", domain: 2, type: "single",
    stem: "An EC2 application must access an S3 bucket. The security team wants the traffic to stay on the AWS network and wants the bucket to reject any request that does not arrive through that private path.\n\nWhich TWO-part configuration achieves this?",
    options: [
      "Create a gateway VPC endpoint for S3 and add a bucket policy that denies requests where aws:SourceVpce does not match the endpoint ID.",
      "Create a NAT gateway and add a bucket policy that allows only the NAT gateway's Elastic IP address.",
      "Create an interface VPC endpoint for S3 and enable Block Public Access on the bucket.",
      "Enable S3 Transfer Acceleration and restrict the bucket policy to the VPC's CIDR range."
    ],
    correct: [0],
    explanation: "Correct — a gateway endpoint for S3 adds a route so bucket traffic never leaves the AWS network, and the aws:SourceVpce condition key lets the bucket policy require that path. Without the policy, the endpoint is merely available rather than mandatory.\n\nWhy the others are wrong:\n• NAT gateway plus Elastic IP allowlist: traffic still traverses the public internet path to S3's public endpoint, and IP-based allowlisting is brittle.\n• Interface endpoint plus Block Public Access: an interface endpoint for S3 does exist (used for on-premises access over Direct Connect), but Block Public Access stops public grants — it does not enforce a network path.\n• Transfer Acceleration plus VPC CIDR: acceleration explicitly routes through CloudFront edge locations, the opposite of keeping traffic private, and the private CIDR is not what S3 sees as the source.\n\nRule to remember: gateway endpoints (S3 and DynamoDB) are free and route-table based; interface endpoints (PrivateLink) create ENIs in your subnets, cost per hour and per GB, and support more services. Related condition keys: aws:SourceVpce, aws:SourceVpc, and aws:PrincipalOrgID."
  },
  {
    id: "dva2-21", domain: 2, type: "single",
    stem: "An ECS task running on Fargate must pull an image from a private ECR repository and, once running, read from a DynamoDB table.\n\nWhich roles are required?",
    options: [
      "The task execution role for pulling the image and writing logs, and the task role for the application's DynamoDB calls.",
      "Only the task role, which covers both image pulls and runtime API calls.",
      "Only the task execution role, which the container inherits for all AWS API calls.",
      "An EC2 instance profile on the underlying host, which Fargate assigns automatically."
    ],
    correct: [0],
    explanation: "Correct — ECS separates two responsibilities. The task execution role is used by the ECS agent and Fargate infrastructure before and around your container: pulling the image from ECR, fetching secrets, and sending logs to CloudWatch. The task role is what the application code inside the container assumes for its own AWS API calls.\n\nWhy the others are wrong:\n• Task role only: the image pull happens before the container starts, so the task role is not yet in play. Missing the execution role produces a CannotPullContainerError.\n• Execution role only: your application code does not receive the execution role's credentials. Its calls would fail with AccessDenied.\n• EC2 instance profile: with Fargate there is no instance you own or configure. That model applies to the EC2 launch type, where the container instance role handles agent-level permissions.\n\nRule to remember: execution role = getting the container running (infrastructure). Task role = what the container may do (application). Lambda collapses both into one execution role, which is why the ECS split trips people up."
  },
  {
    id: "dva2-22", domain: 2, type: "single",
    stem: "A developer must allow a CI/CD pipeline to deploy only to resources tagged Environment=dev, while using a single IAM policy that scales as new resources are added.\n\nWhich technique should be used?",
    options: [
      "Attribute-based access control using a condition on the aws:ResourceTag/Environment key.",
      "Listing every dev resource ARN explicitly in the policy's Resource element.",
      "A permissions boundary that enumerates the allowed dev resources.",
      "A separate IAM user for each environment with inline policies."
    ],
    correct: [0],
    explanation: "Correct — ABAC evaluates tags at request time, so a policy conditioned on aws:ResourceTag/Environment equals dev automatically covers resources created tomorrow without any policy edit. This is the scaling property the question asks for.\n\nWhy the others are wrong:\n• Enumerating ARNs: this is RBAC by explicit list. Every new resource requires a policy change, and policies have size limits you will eventually hit.\n• Permissions boundary with an enumeration: boundaries constrain maximum permissions, and enumerating resources inside one inherits exactly the same maintenance problem.\n• An IAM user per environment: it does not scale, multiplies long-lived credentials, and does not address resource-level granularity.\n\nRule to remember: aws:ResourceTag/key filters on the target resource's tags; aws:RequestTag/key constrains tags being applied during creation; aws:PrincipalTag/key matches tags on the calling identity. ABAC questions usually hinge on picking the right one of the three."
  },
  {
    id: "dva2-23", domain: 2, type: "single",
    stem: "An application logs the full request payload for debugging. A security audit finds credit card numbers in CloudWatch Logs.\n\nWhich remediation addresses the root cause AND limits exposure of the existing logs?",
    options: [
      "Redact sensitive fields in the application before logging, and apply a CloudWatch Logs data protection policy to mask sensitive data in existing and future log events.",
      "Reduce the log group's retention period to one day so the data expires quickly.",
      "Encrypt the log group with a customer managed KMS key so the data is protected at rest.",
      "Move the logs to an S3 bucket with Block Public Access enabled."
    ],
    correct: [0],
    explanation: "Correct — the root cause is that the application writes card numbers at all, so redaction at the source is the real fix. CloudWatch Logs data protection policies complement it by detecting managed data identifiers (credit card numbers, SSNs, credentials) and masking them, so operators without the unmask permission never see the raw values.\n\nWhy the others are wrong:\n• Shorter retention: the data is still written and still readable by anyone with log access during that window. It shrinks the window, not the exposure.\n• KMS encryption on the log group: this protects against someone reading the underlying storage. Anyone with logs:GetLogEvents still sees plaintext, which is the actual audit finding.\n• Moving logs to S3: relocating sensitive data does not desensitize it.\n\nRule to remember: for sensitive data the hierarchy is do not collect it → do not log it → mask it → restrict who can read it → encrypt it. Encryption is the last line, never the first answer to an \"it should not be there\" finding."
  },
  {
    id: "dva2-24", domain: 2, type: "single",
    stem: "An S3 bucket must serve static website content publicly, but the security team requires that the origin bucket itself remain private and reject direct S3 URL access.\n\nWhich configuration meets both requirements?",
    options: [
      "Serve the content through CloudFront with Origin Access Control, and set a bucket policy allowing only the CloudFront distribution.",
      "Enable S3 static website hosting and add a bucket policy allowing s3:GetObject to everyone.",
      "Generate presigned URLs for every object and embed them in the site's HTML.",
      "Enable S3 Block Public Access and add the CloudFront distribution's IP ranges to the bucket policy."
    ],
    correct: [0],
    explanation: "Correct — Origin Access Control lets CloudFront sign requests to S3 with SigV4. The bucket policy grants access only to the cloudfront.amazonaws.com service principal, conditioned on the specific distribution ARN, so Block Public Access stays on and direct S3 URLs return 403. CloudFront additionally brings TLS, caching, and WAF integration.\n\nWhy the others are wrong:\n• Public website hosting with a public read policy: this directly contradicts the requirement that the bucket be private.\n• Presigned URLs for a public site: they expire, cannot be cached effectively by browsers or CDNs, and would require regenerating the HTML constantly. Presigned URLs are for controlled, temporary access, not public distribution.\n• Allowlisting CloudFront IP ranges: those ranges change and are enormous, and any customer's distribution shares them — so this both breaks over time and fails to restrict access to your distribution.\n\nRule to remember: OAC is the current mechanism and supports SSE-KMS and all HTTP methods. Origin Access Identity (OAI) is its legacy predecessor and still appears in older exam material and documentation."
  },
  {
    id: "dva2-25", domain: 2, type: "single",
    stem: "A developer needs to grant an AWS service temporary permission to use a KMS key on behalf of a user, with the ability to retire that permission when the operation completes, and without editing the key policy.\n\nWhich KMS feature fits?",
    options: [
      "A grant, which delegates specific operations and can be retired or revoked independently of the key policy.",
      "A key alias, which points to the key and can be deleted when access is no longer needed.",
      "An IAM inline policy attached to the service-linked role.",
      "Key rotation, which issues new material for the delegated operation."
    ],
    correct: [0],
    explanation: "Correct — grants exist for exactly this: programmatic, temporary, granular delegation. A grant names a grantee principal and a list of allowed operations, optionally constrained by encryption context, and can be retired by the creator or revoked by a key administrator. AWS services such as EBS and Amazon RDS create grants on your behalf routinely.\n\nWhy the others are wrong:\n• Alias: a friendly name pointing at a key. It carries no permissions whatsoever.\n• IAM inline policy: this could grant the permission, but it means editing IAM for every temporary delegation and it is not scoped to a single operation with a clean retirement path. Grants were designed to avoid churning policies.\n• Key rotation: it changes cryptographic material and has nothing to do with access delegation.\n\nRule to remember: key policy = the durable, primary access control on the key. Grants = temporary, programmatic delegation layered on top. Effective permissions are the union of the key policy, applicable IAM policies, and grants — minus any explicit Deny."
  },
  {
    id: "dva2-26", domain: 2, type: "single",
    stem: "A developer must call an API Gateway REST API that uses IAM authorization from a Lambda function.\n\nWhat must the request include?",
    options: [
      "A SigV4 signature computed with the function's temporary credentials, and the execution role must allow execute-api:Invoke on the method ARN.",
      "An API key in the x-api-key header matching a key in the API's usage plan.",
      "A bearer token obtained from AWS STS in the Authorization header.",
      "The function's execution role ARN in a custom header, which API Gateway validates against the resource policy."
    ],
    correct: [0],
    explanation: "Correct — IAM authorization means the request is a signed AWS API call. The caller signs with SigV4 using its temporary credentials, and API Gateway checks whether that principal is allowed execute-api:Invoke on the specific method ARN.\n\nWhy the others are wrong:\n• API key: keys identify an application for usage plans, throttling, and quotas. AWS documentation states plainly that they are not for authentication or authorization.\n• A bearer token from STS: STS returns access key, secret key, and session token for signing — not a bearer token that AWS services accept in an Authorization header.\n• A role ARN in a custom header: any client could claim any ARN. Identity in AWS is proven by a signature over the request, never by asserting a name.\n\nRule to remember: IAM authorization is ideal for service-to-service calls and for clients holding AWS credentials (including mobile clients using a Cognito identity pool). For human end users with JWTs, use a Cognito user pool authorizer or a Lambda authorizer instead."
  },
  {
    id: "dva2-27", domain: 2, type: "multiple",
    stem: "A team is deciding between AWS Secrets Manager and Systems Manager Parameter Store.\n\nWhich TWO statements are accurate? (Choose two.)",
    options: [
      "Secrets Manager supports built-in automatic rotation driven by a Lambda function; Parameter Store does not provide an equivalent managed rotation workflow.",
      "Parameter Store standard-tier parameters incur no charge for storage, whereas Secrets Manager charges per secret per month.",
      "Only Parameter Store can encrypt values with AWS KMS.",
      "Only Secrets Manager supports hierarchical paths that can be retrieved recursively.",
      "Parameter Store supports cross-account access through a resource-based policy, whereas Secrets Manager does not."
    ],
    correct: [0, 1],
    explanation: "Correct — managed rotation is Secrets Manager's headline feature and the usual reason to pay for it, and the pricing difference is real: standard-tier parameters are free to store while each secret carries a monthly charge plus per-call costs.\n\nWhy the others are wrong:\n• \"Only Parameter Store can use KMS\": both encrypt with KMS. Parameter Store does it through the SecureString type; Secrets Manager encrypts everything by default.\n• \"Only Secrets Manager supports hierarchical paths\": this is backwards. Parameter Store is the one with /app/dev/db/password style hierarchies and GetParametersByPath for recursive retrieval.\n• \"Parameter Store supports cross-account resource policies, Secrets Manager does not\": also backwards. Secrets Manager supports resource-based policies for cross-account sharing; Parameter Store's advanced tier added limited support later, and cross-account sharing is generally cited as a Secrets Manager advantage.\n\nRule to remember: Parameter Store for configuration and for secrets when cost matters and you will handle rotation. Secrets Manager when rotation, cross-account sharing, or native RDS integration justify the price."
  },
  {
    id: "dva2-28", domain: 2, type: "single",
    stem: "An application must verify that a JWT presented by a client was genuinely issued by a Cognito user pool and has not been tampered with.\n\nWhat must the verification code do?",
    options: [
      "Fetch the user pool's public JSON Web Key Set and validate the token's RS256 signature, then check the issuer, audience, expiry, and token_use claims.",
      "Call the Cognito AdminGetUser API with the token to confirm the user still exists.",
      "Decode the token's payload and confirm the sub claim matches a record in the application database.",
      "Send the token to AWS STS, which validates Cognito-issued tokens and returns the claims."
    ],
    correct: [0],
    explanation: "Correct — Cognito signs tokens with RS256 and publishes the corresponding public keys at a well-known JWKS URL for the user pool. Verifying the signature proves authenticity and integrity; checking iss, aud (or client_id), exp, and token_use prevents accepting a token from another pool, another app client, an expired session, or the wrong token type.\n\nWhy the others are wrong:\n• AdminGetUser: this confirms a user exists but proves nothing about the token, and it adds an API call and admin-level permissions to every request.\n• Decoding the payload only: a JWT payload is Base64, not encrypted. Anyone can forge one. Without signature verification you are trusting attacker-controlled input.\n• Sending it to STS: STS does not validate Cognito user pool JWTs. Identity pools consume them, but that is a different flow producing AWS credentials.\n\nRule to remember: never trust an unverified JWT. Use a maintained library (aws-jwt-verify, or your platform's JWT library with the JWKS), and cache the JWKS rather than fetching it per request."
  },
  {
    id: "dva2-29", domain: 2, type: "single",
    stem: "A Lambda function must be invocable by Amazon S3 when objects are created in a specific bucket, and by no other source.\n\nWhat should be configured?",
    options: [
      "A resource-based policy on the function allowing the s3.amazonaws.com service principal, with a SourceArn condition for the bucket and a SourceAccount condition for the owning account.",
      "An identity-based policy on the function's execution role allowing lambda:InvokeFunction on the bucket.",
      "A bucket policy allowing the Lambda function's execution role to call lambda:InvokeFunction.",
      "A VPC security group rule permitting inbound traffic from the S3 service prefix list."
    ],
    correct: [0],
    explanation: "Correct — who may invoke a function is controlled by the function's resource-based policy (a Lambda permission). Naming the S3 service principal grants the invoke right, and the SourceArn and SourceAccount conditions narrow it to one bucket in one account. SourceAccount matters because bucket names are globally unique but an ARN alone does not prove ownership.\n\nWhy the others are wrong:\n• Execution role policy: the execution role defines what the function may do, not who may call it. This is the most common inversion on the exam.\n• Bucket policy granting lambda:InvokeFunction: a bucket policy governs S3 actions on the bucket. Lambda permissions do not belong there, and S3 invokes using its service principal rather than your role.\n• Security group rule: invocation is an AWS API call to the Lambda service endpoint, not network traffic into your function.\n\nRule to remember: execution role = outbound (what the function can do). Resource-based policy = inbound (who can invoke it). The CLI shortcut is aws lambda add-permission, which the console runs for you when you attach a trigger."
  },
  {
    id: "dva2-30", domain: 2, type: "single",
    stem: "A security policy requires that developers be able to create IAM roles for their applications, but must never be able to create a role with more permissions than they themselves hold.\n\nWhich IAM feature enforces this?",
    options: [
      "A permissions boundary that developers must attach to any role they create, enforced by a condition on iam:PermissionsBoundary in their own policy.",
      "A service control policy applied to the developers' IAM group.",
      "An IAM Access Analyzer finding that alerts when an over-permissive role is created.",
      "A session policy passed when developers assume their own role."
    ],
    correct: [0],
    explanation: "Correct — this is the canonical permissions-boundary delegation pattern. The developers' policy allows iam:CreateRole and iam:AttachRolePolicy only when the request includes a specific boundary (condition key iam:PermissionsBoundary), and it denies iam:DeleteRolePermissionsBoundary. Any role they create is therefore capped at the boundary's maximum, no matter what policies they attach.\n\nWhy the others are wrong:\n• SCP on a group: SCPs attach to organizational units and accounts, not to IAM groups, and they constrain everything in the account rather than delegating safely.\n• Access Analyzer: it detects and reports after the fact. The requirement is prevention.\n• Session policy: a session policy limits the permissions of one assumed session. It does not constrain roles that principal later creates.\n\nRule to remember: a permissions boundary never grants anything. Effective permissions are the intersection of the identity policy and the boundary, so a boundary is a ceiling, and it is the standard tool for safely delegating IAM privileges."
  },
  {
    id: "dva2-31", domain: 2, type: "single",
    stem: "A developer must encrypt sensitive data before storing it in DynamoDB so that even a user with full dynamodb:GetItem permission cannot read the field's contents.\n\nWhich approach meets the requirement?",
    options: [
      "Use client-side encryption with the AWS Database Encryption SDK, so the field is ciphertext in the table and only holders of the KMS key permissions can decrypt it.",
      "Enable DynamoDB encryption at rest with a customer managed KMS key.",
      "Store the field in a separate table protected by a stricter IAM policy.",
      "Enable DynamoDB Streams encryption so the attribute is protected in transit."
    ],
    correct: [0],
    explanation: "Correct — the requirement is protection from an authorized DynamoDB reader, so encryption must happen before the data reaches DynamoDB. With client-side encryption the service stores opaque ciphertext, and reading the item yields nothing useful without separate kms:Decrypt permission on the key.\n\nWhy the others are wrong:\n• Encryption at rest with a customer managed key: DynamoDB decrypts transparently for any authorized reader, so GetItem returns plaintext. At-rest encryption defends against storage-layer access, not against authorized API callers. It does add value — revoking the key blocks all access to the table — but it is far too coarse for a single field.\n• A separate table with stricter IAM: this is access control, not encryption, and it leaves the data readable by anyone who gains access to that table.\n• Streams encryption: this concerns the change stream, not the stored attribute.\n\nRule to remember: at-rest encryption protects against infrastructure-level threats. Client-side encryption protects against the service and against over-permissioned principals. When a question says \"even someone with read access must not see it,\" the answer is always client-side."
  },
  {
    id: "dva2-32", domain: 2, type: "single",
    stem: "An API must be reachable only from within a VPC and must never be exposed to the public internet.\n\nWhich API Gateway configuration achieves this?",
    options: [
      "A private REST API endpoint accessed through an interface VPC endpoint, with a resource policy restricting access to that endpoint.",
      "A regional REST API with a resource policy denying all source IP addresses outside the VPC CIDR.",
      "An edge-optimized REST API fronted by CloudFront with a geographic restriction.",
      "A regional HTTP API deployed into private subnets of the VPC."
    ],
    correct: [0],
    explanation: "Correct — a private API endpoint has no public DNS route. It is reachable only through an execute-api interface VPC endpoint, and the resource policy (which is mandatory for private APIs) restricts which VPC endpoints or VPCs may call it.\n\nWhy the others are wrong:\n• Regional API with an IP-based deny: the endpoint is still publicly resolvable and reachable, so you rely entirely on policy evaluation. Traffic from the VPC would also arrive with a NAT or public source address, not the private CIDR.\n• Edge-optimized with geo restriction: CloudFront geo restriction filters by country. It is a public distribution by design.\n• \"HTTP API in private subnets\": API Gateway is a managed service that you do not deploy into subnets, and HTTP APIs do not support private endpoints in the way REST APIs do.\n\nRule to remember: the three REST endpoint types are edge-optimized (CloudFront-fronted, best for globally dispersed clients), regional (clients in the same Region, or bring your own CDN), and private (VPC-only through PrivateLink)."
  },
  {
    id: "dva2-33", domain: 2, type: "single",
    stem: "A CodeBuild project must use a database password during integration tests without exposing it in the buildspec file or in build logs.\n\nWhich configuration is correct?",
    options: [
      "Define the environment variable with a type of SECRETS_MANAGER referencing the secret name, so CodeBuild resolves it at runtime and masks it in logs.",
      "Define it as a PLAINTEXT environment variable in the buildspec, since build logs are private by default.",
      "Store it in an S3 bucket and download it during the install phase with the AWS CLI.",
      "Pass it as a build override parameter from the CodePipeline action configuration."
    ],
    correct: [0],
    explanation: "Correct — CodeBuild environment variables support three types: PLAINTEXT, PARAMETER_STORE, and SECRETS_MANAGER. The latter two resolve at build time from the referenced store, keep the value out of source control, and CodeBuild masks resolved secret values in log output. The build's service role needs permission to read the secret and to decrypt it with KMS.\n\nWhy the others are wrong:\n• PLAINTEXT because \"logs are private\": the value is now committed in the buildspec, visible to everyone with repository access, and will be printed by any command that echoes its environment.\n• Downloading from S3: this works but you are hand-rolling secret distribution, with a bucket to secure and no masking in logs.\n• Build override parameters: overrides are visible in the pipeline definition and in CodeBuild's build history, so the secret is still exposed in configuration.\n\nRule to remember: the same principle recurs everywhere in CI/CD — never put a secret in a file that lives in version control. Reference it from a secret store and let the platform resolve it at execution time."
  },
  {
    id: "dva2-34", domain: 2, type: "single",
    stem: "An application must call an internal service over TLS using a certificate that must be automatically renewed. The service runs behind an Application Load Balancer.\n\nWhich approach requires the least operational effort?",
    options: [
      "Request a public certificate from AWS Certificate Manager and attach it to the ALB listener, letting ACM handle renewal automatically.",
      "Purchase a certificate from a third-party certificate authority and import it into ACM, then renew it manually every year.",
      "Generate a self-signed certificate on each instance and distribute the CA bundle to all clients.",
      "Terminate TLS on the EC2 instances using certificates stored in Secrets Manager with automatic rotation."
    ],
    correct: [0],
    explanation: "Correct — ACM issues public certificates at no charge and renews them automatically as long as the domain validation (DNS validation via a CNAME is the recommended method) remains in place. Attaching the certificate to the ALB listener means the load balancer terminates TLS and you never touch renewal again.\n\nWhy the others are wrong:\n• Imported third-party certificate: ACM can store and deploy it, but ACM cannot renew a certificate it did not issue. You get a reminder and a manual task every year.\n• Self-signed certificates per instance: no automatic renewal, plus distributing and maintaining trust for a custom CA across every client.\n• TLS on instances with certificates in Secrets Manager: rotating a secret does not issue a new certificate, and you now own the reload and deployment mechanics on every instance.\n\nRule to remember: ACM public certificates are free and auto-renewing but can only be attached to integrated services (ALB, CloudFront, API Gateway, and others) — you cannot export the private key. For certificates on EC2 or on-premises, use AWS Private CA or an external CA."
  },
  {
    id: "dva2-35", domain: 2, type: "single",
    stem: "A team needs an audit trail showing which IAM principal read a specific object from an S3 bucket and when.\n\nWhat must be configured?",
    options: [
      "CloudTrail data events for the S3 bucket, since object-level read operations are not logged as management events.",
      "CloudTrail management events, which capture all S3 API calls by default.",
      "S3 server access logging with the default log format, which includes the IAM principal ARN.",
      "AWS Config with the S3 bucket recorded as a resource type."
    ],
    correct: [0],
    explanation: "Correct — CloudTrail splits API activity into management events (control plane, such as CreateBucket and PutBucketPolicy) and data events (data plane, such as GetObject and PutObject). Data events are not logged by default because of their volume and cost, so they must be explicitly enabled for the bucket or prefix.\n\nWhy the others are wrong:\n• Management events by default: they cover bucket-level operations only. A GetObject call will not appear.\n• S3 server access logging: it does record object-level requests and is cheaper, but delivery is best-effort and can be delayed by hours, and the records identify requesters less precisely than CloudTrail. For an audit trail, CloudTrail data events are the expected answer.\n• AWS Config: it tracks configuration state and compliance over time, not individual data access.\n\nRule to remember: the same data-event distinction applies to Lambda function invocations and DynamoDB item-level activity. If a question asks who read or wrote specific data, the answer involves CloudTrail data events."
  },
  {
    id: "dva2-36", domain: 2, type: "single",
    stem: "A developer wants to restrict an IAM role so it can only perform actions when the request originates from a specific corporate IP range, while still allowing AWS services to act on the role's behalf internally.\n\nWhich condition key combination is appropriate?",
    options: [
      "Deny actions when aws:SourceIp is outside the range AND aws:ViaAWSService is false, so service-initiated calls are not blocked.",
      "Deny all actions when aws:SourceIp is outside the corporate range, with no additional conditions.",
      "Allow actions only when aws:SourceVpc matches the corporate VPC.",
      "Deny actions when aws:PrincipalIp is outside the corporate range."
    ],
    correct: [0],
    explanation: "Correct — a naive aws:SourceIp deny breaks legitimate service-initiated calls. When an AWS service makes a request on your behalf (for example, CloudFormation calling another service, or an S3 lifecycle action), the source IP is the service's, not yours. The aws:ViaAWSService key is true for those requests, so excluding them from the deny keeps automation working while still restricting direct human and application calls.\n\nWhy the others are wrong:\n• An unconditional SourceIp deny: this is the classic self-inflicted outage. It blocks service-initiated calls and can lock you out in ways that are hard to diagnose.\n• aws:SourceVpc: valid for VPC endpoint traffic, but corporate office IPs are not VPC traffic, so this does not express the requirement.\n• aws:PrincipalIp: not a real IAM global condition key. The correct one is aws:SourceIp.\n\nRule to remember: related keys worth knowing are aws:CalledVia (which service chain made the call), aws:SecureTransport (TLS), aws:PrincipalOrgID (restrict to your organization), and aws:RequestedRegion (restrict to approved Regions)."
  },
  {
    id: "dva2-37", domain: 2, type: "single",
    stem: "An application currently uses a Cognito user pool for sign-in. Product wants users to be able to sign in with Google as well, keeping a single user profile per person.\n\nWhat is the standard way to implement this?",
    options: [
      "Configure Google as an identity provider in the user pool and enable attribute mapping, so federated users appear in the same user pool directory.",
      "Create a second Cognito user pool dedicated to Google users and merge the directories nightly.",
      "Configure Google directly as a provider in a Cognito identity pool and stop using the user pool.",
      "Implement the Google OAuth flow in the application and create an IAM user for each Google account."
    ],
    correct: [0],
    explanation: "Correct — user pools support external identity providers (Google, Facebook, Apple, Amazon, any SAML 2.0 or OIDC provider). Federated users are provisioned into the same directory, attribute mapping populates their profile, and the application continues to receive the same Cognito tokens no matter how the user signed in.\n\nWhy the others are wrong:\n• A second user pool with nightly merging: this produces duplicate identities, a synchronization job to maintain, and stale data between runs. Nothing about it is standard.\n• Identity pool only: an identity pool can federate Google directly, but it returns AWS credentials rather than user tokens and provides no user directory, no profile attributes, no groups, and no hosted UI. You would lose the user management the application already relies on.\n• An IAM user per Google account: IAM is not an end-user identity system, and the account-level user limit makes this unworkable.\n\nRule to remember: user pool federation = one directory, many sign-in methods, one token format for your application. Identity pool federation = converting any trusted identity into AWS credentials. They compose: users federate into the pool, then the pool token goes to the identity pool when AWS credentials are needed."
  },
  {
    id: "dva2-38", domain: 2, type: "single",
    stem: "A public-facing API experiences a credential-stuffing attack in which an attacker sends millions of login attempts from many IP addresses.\n\nWhich AWS service is designed to mitigate this at the edge, before requests reach the backend?",
    options: [
      "AWS WAF with rate-based rules and the account takeover prevention managed rule group, attached to the API Gateway stage or CloudFront distribution.",
      "API Gateway usage plans with per-API-key throttling.",
      "Amazon GuardDuty, which blocks malicious IP addresses automatically.",
      "AWS Shield Standard, which is enabled by default on all AWS accounts."
    ],
    correct: [0],
    explanation: "Correct — WAF inspects requests before they reach your integration. Rate-based rules throttle or block source IPs exceeding a threshold in a rolling window, and the Account Takeover Prevention managed rule group is purpose-built for credential stuffing, inspecting login attempts and checking against known compromised credentials.\n\nWhy the others are wrong:\n• Usage plan throttling: it applies per API key, and attackers in a credential-stuffing attack are unauthenticated and hold no key. Usage plans manage legitimate consumers rather than defend against abuse.\n• GuardDuty: it is a detection service. It analyzes CloudTrail, VPC Flow Logs, and DNS logs and produces findings, but it does not block traffic on its own — you would have to build remediation on top of its findings.\n• Shield Standard: it is automatic and free, and it protects against common network and transport layer (L3/L4) DDoS attacks. Credential stuffing is application layer (L7) traffic that looks like valid requests, which is WAF's domain.\n\nRule to remember: Shield = DDoS at L3/L4 (Advanced adds L7 protections and response team access). WAF = application-layer request filtering. GuardDuty = threat detection. Only WAF blocks malicious HTTP requests inline."
  },
  {
    id: "dva2-39", domain: 2, type: "multiple",
    stem: "An application must upload objects to an S3 bucket whose default encryption is SSE-KMS with a customer managed key. The IAM role already has s3:PutObject, but uploads fail with an access denied error referencing KMS.\n\nWhich TWO KMS permissions must the role have on the key? (Choose two.)",
    options: [
      "kms:GenerateDataKey",
      "kms:Decrypt",
      "kms:CreateGrant",
      "kms:ScheduleKeyDeletion",
      "kms:PutKeyPolicy"
    ],
    correct: [0, 1],
    explanation: "Correct — SSE-KMS is envelope encryption performed by S3 on your behalf. To write an object, S3 calls GenerateDataKey to obtain a fresh data key, and it calls Decrypt to unwrap that key. Both are required for an upload, which surprises people who reason that \"writing should only need encrypt permission.\"\n\nWhy the others are wrong:\n• kms:CreateGrant: required in some service integrations (for example, when a service needs standing delegated access such as EBS or a service-linked role), but not for a plain S3 PutObject.\n• kms:ScheduleKeyDeletion: a destructive key-management operation that no application role should hold.\n• kms:PutKeyPolicy: an administrative permission for changing who can use the key. Granting it to an application role would let that role escalate its own access.\n\nRule to remember: note what is absent from the answer — kms:Encrypt is not needed for SSE-KMS, because S3 never calls Encrypt directly. Downloads need kms:Decrypt. Uploads need both GenerateDataKey and Decrypt."
  }
];
