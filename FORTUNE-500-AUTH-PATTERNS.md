# Fortune 500 Admin Authentication Patterns

**Last Updated:** December 2025
**Target Audience:** Enterprise developers studying authentication patterns from industry leaders

---

## Table of Contents
- [Salesforce Admin Console](#salesforce-admin-console)
- [AWS IAM Console](#aws-iam-console)
- [Google Cloud Console](#google-cloud-console)
- [Microsoft Azure Portal](#microsoft-azure-portal)
- [Stripe Dashboard](#stripe-dashboard)
- [Vercel Dashboard](#vercel-dashboard)
- [Common Patterns Across Platforms](#common-patterns-across-platforms)
- [Key Takeaways for SRS](#key-takeaways-for-srs)

---

## Salesforce Admin Console

### Authentication Methods

**Multi-Factor Authentication (MFA)**
- REQUIRED for all UI-based user logins
- Provides essential defense against credential leaks and brute-force attacks
- Users must provide an additional form of identification after username/password
- Supported methods: Authenticator apps, security keys, SMS (deprecated for security)

**Single Sign-On (SSO)**
- Users only use one set of credentials across organizational applications
- Access provisioned and managed from central location
- Salesforce can act as service provider OR identity provider
- Supports SAML and OAuth protocols

**Connected Apps**
- Use standard SAML and OAuth protocols
- Control external system access to Salesforce
- Define authentication protocols, authorization scope, session behavior in single definition
- Enable API access with proper authentication

### Security Features

**IP Restrictions**
- Restricting access through IP addresses protects data from unauthorized access and phishing
- Admins can define login IP ranges
- Unidentified or non-trusted IPs are denied or challenged for identity verification

**Named Credentials**
- Cornerstone of Salesforce's secure integration architecture
- Streamlined and highly secure method for defining callout endpoints
- Authentication parameters defined directly within Salesforce platform

**Health Check Tool**
- Built-in free tool for managing org security settings
- Identifies and fixes potentially vulnerable security settings
- Create custom baseline standards aligned with business needs
- Continuous security posture monitoring

### Key Patterns

1. **MFA Enforcement:** Required by default, no exceptions
2. **Centralized Access Management:** SSO for entire organization
3. **Granular Permission Controls:** Role-based with profile assignments
4. **Continuous Monitoring:** Health Check for security drift detection
5. **API Security:** Connected Apps with OAuth 2.0

**Sources:**
- [Salesforce Security Best Practices](https://security.salesforce.com/security-best-practices)
- [Authenticate Users | Salesforce Security Guide](https://developer.salesforce.com/docs/atlas.en-us.securityImplGuide.meta/securityImplGuide/security_sharing_setup.htm)
- [Secure Authentication & App Integration - Trailhead](https://trailhead.salesforce.com/content/learn/modules/mobile_sdk_introduction/mobilesdk_intro_security)

---

## AWS IAM Console

### Authentication Methods

**Root User Protection**
- Never use or share root credentials under any circumstances (even for administrative activities)
- Sign in as root ONLY to enable MFA and create administrative users
- Safeguard root credentials and don't use them for everyday tasks

**Multi-Factor Authentication (MFA)**
- REQUIRED for all accounts that have console password
- Each user needs device that generates response to authentication challenge
- Both credentials AND device-generated response required to complete sign-in
- Recommended for all users, especially privileged accounts

**Temporary Credentials (Recommended)**
- Require human users to rely on temporary credentials when accessing AWS
- Use identity provider for federated access by assuming IAM roles
- Centralized access management via AWS IAM Identity Center

### Security Patterns

**Least Privilege Permissions**
- Principle of least privilege gives users minimum access rights to do their job, no more
- Users and groups given minimum rights to accomplish necessary tasks
- Use IAM Access Analyzer to create least-privilege policies based on access activity

**Administrative User Setup**
- Sign in as AWS account administrator
- Set up these identities:
  - Create least-privilege users for other humans
  - Set up temporary credentials for workloads
  - Create access keys only for use cases requiring long-term credentials

**Policy Conditions**
- Apply conditions to policies for additional stipulations on resource access
- Conditions include: date/time limitations, IP source address ranges, require SSL encryption

**Password Policy**
- Enforce complex password policy and regular rotation
- Created on Account Settings page of IAM console
- Dictates password length, character requirements, rotation frequency

### AWS-Specific Innovations

1. **Identity Center:** Centralized multi-account access
2. **Access Analyzer:** Automated least-privilege policy creation
3. **Temporary Credentials:** Federated access via role assumption
4. **Policy Simulator:** Test policies before deployment
5. **Service Control Policies:** Organization-wide guardrails

**Sources:**
- [Security best practices in IAM - AWS Identity and Access Management](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [AWS Identity and Access Management (IAM) Best Practices](https://aws.amazon.com/iam/resources/best-practices/)
- [Security best practices for AWS account administrators](https://docs.aws.amazon.com/signin/latest/userguide/best-practices-admin.html)
- [AWS IAM Security Best Practices | Blog | Logicata](https://www.logicata.com/blog/aws-iam-best-practices/)

---

## Google Cloud Console

### Authentication Methods

**Application Default Credentials (ADC)**
- Strategy used by authentication libraries to automatically find credentials
- Based on application environment
- Libraries look for credentials in defined locations and use them to authenticate requests
- Makes credentials available in variety of environments without modifying application code

**Identity and Access Management (IAM)**
- Three components: Principal (identity), Role (collection of permissions), Resource
- To give principal permission to access resource, grant them a role on the resource

### Security Features

**Multi-Factor Authentication**
- Enforced on super admin accounts and all accounts with elevated privileges
- Recommended to use security key or other physical authentication device
- Always enforce 2-step verification with security keys in Cloud Identity

**Context-Aware Access**
- Control access based on contextual attributes
- Attributes include: device security status, IP address, resource type, date/time
- Dynamic access decisions based on risk

**Group-Based Access Management**
- Assign users to groups based on job functions and access requirements
- Grant IAM roles to groups (not individual users)
- Manage IAM roles at scale efficiently

### Management Tools

- Google Cloud Console (web UI)
- IAM methods (API)
- gcloud command line tool

### Google-Specific Features

1. **Workforce Identity Federation:** External identity provider integration
2. **Context-Aware Access:** Risk-based access control
3. **Organization Policies:** Centralized constraint management
4. **Resource Hierarchy:** Projects/folders/organization structure
5. **Service Accounts:** Application identity with key management

**Sources:**
- [Identity and Access Management documentation](https://cloud.google.com/iam/docs)
- [Authenticate to IAM | Google Cloud](https://cloud.google.com/iam/docs/authentication)
- [IAM overview](https://docs.cloud.google.com/iam/docs/overview)
- [Super administrator account best practices](https://docs.cloud.google.com/resource-manager/docs/super-admin-best-practices)

---

## Microsoft Azure Portal

### Authentication Methods

**Azure Role-Based Access Control (RBAC)**
- Helps manage who has access to Azure resources
- What they can do with those resources
- What areas they have access to
- Authorization system built on Azure Resource Manager

**Core RBAC Components**
- **Security Principal:** User, group, service principal, or managed identity requesting access
- **Role Definition:** Collection of permissions
- **Scope:** Set of resources the access applies to
- **Role Assignment:** Combines security principal + role definition + scope

### Authentication Flow

1. User (or service principal) acquires token for Azure Resource Manager
2. Makes REST API call to Azure Resource Manager with token attached
3. Azure Resource Manager retrieves all role assignments and deny assignments
4. Evaluates permissions for requested action on resource

### Security Best Practices

**Maximum 3 Subscription Owners**
- Reduce potential for breach by compromised owner
- Limit blast radius of compromised privileged account

**Assign Roles to Groups, Not Users**
- Avoid direct role assignments to individual users
- Use groups for scalable permission management
- Easier to audit and manage

**Privileged Administrator Roles**
- Remove unnecessary privileged role assignments
- Avoid assigning privileged admin role when job function role can be used instead
- Use narrow scope (resource group/resource) instead of broader scope

**Privileged Identity Management (PIM)**
- Helps protect privileged accounts
- Provides just-in-time privileged access to Microsoft Entra ID and Azure resources
- Time-bound access with approval workflows
- Audit trail of privileged operations

### Azure-Specific Innovations

1. **PIM (Privileged Identity Management):** Just-in-time admin access
2. **Managed Identities:** Automatic credential management for Azure resources
3. **Conditional Access:** Risk-based access policies
4. **Azure AD B2B:** Guest user access management
5. **Break Glass Accounts:** Emergency access accounts

**Sources:**
- [What is Azure role-based access control (Azure RBAC)?](https://learn.microsoft.com/en-us/azure/role-based-access-control/overview)
- [Best practices for Azure RBAC](https://learn.microsoft.com/en-us/azure/role-based-access-control/best-practices)
- [Azure roles, Microsoft Entra roles, and classic subscription administrator roles](https://learn.microsoft.com/en-us/azure/role-based-access-control/rbac-and-directory-admin-roles)

---

## Stripe Dashboard

### Authentication Methods

**Single Sign-On (SSO)**
- Allows teams to sign in through Identity Provider (IdP) using one set of credentials
- Increases security and ease of access
- Supports SAML 2.0 for managing user account creation, authentication, and authorization
- Access to sandboxes managed through SSO SAML assertion

**Two-Factor Authentication (2FA)**
- Supports TouchID, security key, SMS, and authenticator apps (Google Authenticator)
- Stripe recommends all users register for 2FA
- Only organization Administrators or Super Administrators can require 2FA for all team members
- Required for some users to enable when using Dashboard (enhanced security)

### Session Management

**Active Sessions Management**
- Personal details settings include password, communication preferences, and active sessions
- When users aren't managed through SCIM, Stripe doesn't receive immediate notifications if access revoked in IdP
- If users attempt to log in through SSO after session expires, Stripe revokes their access

**Session Persistence**
- Sessions maintained securely with proper timeout
- Integration with SSO provider for session synchronization

### Team & Security Management

**Administrator Capabilities**
- Manage team member permission levels
- Add or remove members
- View all members
- Change user roles
- Manage 2FA settings for members or entire account
- View security history

**Security History**
- Organizations can view security history filtered by date or action
- Hundreds of actions tracked across categories:
  - User security
  - Team management
  - API access
  - Various Stripe products

### API Authentication

**API Key Security**
- API keys carry many privileges and must be kept secure
- Not shared in publicly accessible areas (GitHub, client-side code)
- All API requests must be made over HTTPS
- Calls over plain HTTP will fail

### Stripe-Specific Features

1. **Sandbox Access Control:** Separate environment with dedicated permissions
2. **Webhook Signing:** Verify webhook authenticity
3. **Restricted API Keys:** Fine-grained API key permissions
4. **IP Whitelisting:** Restrict API access by IP
5. **Audit Logs:** Comprehensive activity tracking

**Sources:**
- [Single sign-on (SSO) | Stripe Documentation](https://docs.stripe.com/get-started/account/sso)
- [Manage access and API keys](https://docs.stripe.com/sandboxes/dashboard/manage-access)
- [Two-step authentication requirement](https://support.stripe.com/questions/two-step-authentication-requirement)
- [Authentication | Stripe API Reference](https://docs.stripe.com/api/authentication)

---

## Vercel Dashboard

### Authentication Methods

**Vercel Authentication**
- Allows all Vercel users to log in with Vercel account across platform
- Enables teams to share protected previews without additional security credentials

**Passkeys**
- Log into Vercel account using biometrics (face or fingerprint recognition)
- Support for PINs, hardware security keys
- Modern authentication without passwords

**SAML Single Sign-On**
- Log into Vercel team with organization's identity provider
- Identity provider manages credentials
- Available to Enterprise teams
- Pro teams can purchase as paid add-on ($150)
- Configured by team Owners from Security & Privacy settings

### Deployment Protection

**Protection Levels**
- All Deployments
- Standard Protection
- None

**Protection Methods**
- Vercel Authentication
- Password Protection (Pro plan with Advanced Deployment Protection add-on)
- Shareable Links (Hobby plan limited to 1 link per account)

**Advanced Deployment Protection ($150/month for Pro)**
- Password Protection
- Deployment Protection Exceptions
- Private Production Deployments

### Security Features

**Activity Tracking**
- Track and analyze team members' activity
- Accessed by team members with owner role
- Audit trail for compliance

**Data Protection**
- Data encrypted at rest (AES-256)
- Data encrypted in transit (HTTPS/TLS)
- Includes sensitive information like access tokens and secrets

**Team Default Configuration**
- Configure default Deployment Protection for new projects
- Set protection level and method at team level
- Consistent security across all projects

### Vercel-Specific Features

1. **Preview Authentication:** Protect preview deployments without auth code
2. **Deployment Protection:** Tiered security for different deployment types
3. **Edge Config:** Fast, global configuration with authentication
4. **OIDC Integration:** OpenID Connect for external services
5. **Secure Environment Variables:** Encrypted storage with access controls

**Sources:**
- [Vercel Authentication](https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication)
- [Access Control](https://vercel.com/docs/security/access-control)
- [Deployment Protection on Vercel](https://vercel.com/docs/deployment-protection)
- [Role-based access control (RBAC)](https://vercel.com/docs/rbac)

---

## Common Patterns Across Platforms

### Universal Security Requirements

**1. Multi-Factor Authentication (MFA)**
- **All platforms** require or strongly recommend MFA
- Prioritized for admin/privileged accounts
- Multiple methods supported (authenticator apps, security keys, biometrics)
- SMS deprecated due to security concerns

**2. Least Privilege Access**
- **AWS:** IAM policies with minimal required permissions
- **Azure:** RBAC with narrow scopes
- **Google Cloud:** IAM roles assigned to groups
- **Salesforce:** Profile-based permissions with role hierarchy
- **Stripe:** Team member permission levels
- **Vercel:** RBAC with defined access roles

**3. Centralized Identity Management**
- **All platforms** support SSO/SAML for enterprise
- Integration with external identity providers
- Centralized user provisioning and deprovisioning
- Single source of truth for identity

**4. Audit Logging**
- Comprehensive activity tracking on all platforms
- Security event logging and monitoring
- Compliance reporting capabilities
- Filterable by user, action, date, resource

**5. Temporary/Time-Bound Access**
- **AWS:** Temporary security credentials via STS
- **Azure:** Privileged Identity Management (just-in-time)
- **Google Cloud:** Time-bound access grants
- **Pattern:** Minimize standing privileges

### Architecture Patterns

**Defense in Depth**
```
Layer 1: Network (IP restrictions, VPN requirements)
Layer 2: Authentication (MFA, SSO, password policies)
Layer 3: Authorization (RBAC, least privilege)
Layer 4: Resource-Level (Fine-grained permissions)
Layer 5: Monitoring (Audit logs, anomaly detection)
```

**Zero Trust Principles**
- Never trust, always verify
- Verify explicitly on every request
- Assume breach mentality
- Least privilege access
- Context-aware security decisions

### Session Management Patterns

**Common Approach:**
- Short-lived access tokens (15-60 minutes)
- Longer-lived refresh tokens (hours to days)
- Automatic session timeout with warnings
- Active session management UI
- "Sign out all other devices" capability

**Session Invalidation:**
- Password change → Invalidate all sessions
- Permission change → Invalidate affected sessions
- Security event detected → Immediate revocation
- Manual revocation by admin or user

### API Security Patterns

**Authentication:**
- API keys for service-to-service
- OAuth 2.0 for user-delegated access
- Service accounts with key rotation
- Scoped permissions per API key

**Protection:**
- HTTPS/TLS required
- Rate limiting per key/account
- IP whitelisting available
- Request signing (HMAC, JWT)

### Admin UI/UX Patterns

**Login Experience:**
- Email/username + password as baseline
- MFA as second step (if enabled)
- "Remember this device" option
- Secure password reset flow
- Account lockout after failed attempts

**Permission Management UI:**
- Clear role/permission matrix
- Group-based assignment preferred
- Permission inheritance visualization
- "What can this user do?" simulation

**Security Dashboard:**
- Active sessions view
- Recent security events
- Security recommendations
- Compliance status

---

## Key Takeaways for SRS

### Must-Have Features (Critical)

**1. Multi-Factor Authentication**
- Require for all admin accounts (no exceptions)
- Support authenticator apps minimum
- Consider security key support for super admins
- **Implementation:** via Supabase Auth MFA

**2. Role-Based Access Control**
- At minimum: Super Admin, Admin, Editor, Viewer
- Group-based assignment over individual
- Principle of least privilege
- **Implementation:** Custom claims in Supabase JWT + RLS policies

**3. Audit Logging**
- Log all admin actions (create, update, delete)
- Include: who, what, when, where (IP), why (context)
- Searchable and filterable
- Retention policy (minimum 90 days for compliance)
- **Implementation:** Supabase audit table with RLS

**4. Session Management**
- Short-lived access tokens (15 minutes)
- Active session viewing
- "Sign out all other devices"
- Session timeout with warning
- **Implementation:** Access + refresh token pattern

**5. Secure API Access**
- API keys with scoped permissions
- Rate limiting per key
- HTTPS only
- Request logging
- **Implementation:** Supabase service role + custom API keys table

### Should-Have Features (High Priority)

**6. Single Sign-On (SSO)**
- SAML 2.0 support for enterprise customers
- Simplifies user management
- Better security through centralized identity
- **Implementation:** Supabase Auth + SAML provider integration (future)

**7. IP Whitelisting**
- Restrict admin access to known IP ranges
- Useful for remote-only or office-only access
- **Implementation:** Middleware check + Supabase database table

**8. Password Policies**
- Minimum length: 12 characters
- Complexity requirements
- Password history (prevent reuse)
- Expiration: 90 days for high-security
- **Implementation:** Supabase Auth configuration + custom validation

**9. Security Dashboard**
- Active sessions count
- Recent failed login attempts
- Security events timeline
- Permissions summary
- **Implementation:** Custom React dashboard querying Supabase

### Nice-to-Have Features (Medium Priority)

**10. Just-in-Time (JIT) Admin Access**
- Temporary elevation to admin role
- Time-bound access (e.g., 1 hour)
- Approval workflow
- **Implementation:** Custom role elevation system with expiry

**11. Device Fingerprinting**
- Track known devices
- Alert on new device login
- Device-based MFA bypass (controversial)
- **Implementation:** Custom fingerprinting + Supabase storage

**12. Anomaly Detection**
- Detect unusual login patterns (location, time)
- Alert on suspicious activity
- Automated response (block, require MFA)
- **Implementation:** Background jobs analyzing audit logs

### Implementation Priority Matrix

| Feature | Priority | Complexity | ROI | Implementation Time |
|---------|----------|------------|-----|---------------------|
| MFA | Critical | Medium | Very High | 8-16 hours |
| RBAC | Critical | Medium-High | Very High | 16-24 hours |
| Audit Logging | Critical | Low-Medium | High | 4-8 hours |
| Session Management | Critical | Medium | High | 8-12 hours |
| API Security | Critical | Medium | High | 8-12 hours |
| SSO | High | High | Medium-High | 24-40 hours |
| IP Whitelisting | High | Low | Medium | 2-4 hours |
| Password Policies | High | Low | Medium | 2-4 hours |
| Security Dashboard | Medium | Medium | Medium | 8-16 hours |
| JIT Access | Low | High | Low-Medium | 16-32 hours |
| Device Fingerprinting | Low | Medium-High | Low | 12-24 hours |
| Anomaly Detection | Low | Very High | Medium | 40+ hours |

### Architecture Recommendations

**Phase 1: Foundation (Week 1-2)**
1. Implement basic authentication with Supabase
2. Add RBAC with admin_users table and RLS
3. Set up audit logging table
4. Implement session management (access + refresh tokens)

**Phase 2: Security Hardening (Week 3-4)**
5. Add MFA requirement for admin accounts
6. Implement API key system with rate limiting
7. Add IP whitelisting capability
8. Create security dashboard

**Phase 3: Enterprise Features (Month 2)**
9. SSO integration planning
10. Advanced audit log filtering and search
11. Automated security alerts
12. Compliance reporting

**Phase 4: Advanced (Month 3+)**
13. JIT admin access
14. Device fingerprinting
15. Anomaly detection
16. Advanced security analytics

---

## Comparison Table: Fortune 500 Platforms

| Feature | Salesforce | AWS IAM | Google Cloud | Azure | Stripe | Vercel |
|---------|-----------|---------|--------------|-------|--------|--------|
| **MFA** | Required | Recommended | Recommended | Required (PIM) | Recommended | Supported |
| **SSO** | SAML, OAuth | SAML | SAML, OIDC | SAML, OIDC | SAML 2.0 | SAML |
| **RBAC** | Profiles + Roles | IAM Policies | IAM Roles | Azure RBAC | Team Roles | RBAC |
| **Temp Access** | Session | STS | Time-bound | PIM | Session | Session |
| **Audit Logs** | Yes | CloudTrail | Cloud Audit Logs | Activity Logs | Security History | Activity Log |
| **IP Restrictions** | Yes | Conditions | Context-Aware | Conditional Access | IP Whitelist | Custom |
| **API Security** | Connected Apps | IAM Keys | Service Accounts | Service Principals | API Keys | API Tokens |
| **Zero Trust** | Partial | Yes | Yes | Yes | Partial | Partial |

---

## References

### Salesforce
1. [Salesforce Security Best Practices](https://security.salesforce.com/security-best-practices)
2. [Authenticate Users | Salesforce Security Guide](https://developer.salesforce.com/docs/atlas.en-us.securityImplGuide.meta/securityImplGuide/security_sharing_setup.htm)

### AWS
3. [Security best practices in IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
4. [AWS IAM Security Best Practices](https://www.logicata.com/blog/aws-iam-best-practices/)

### Google Cloud
5. [Identity and Access Management documentation](https://cloud.google.com/iam/docs)
6. [Super administrator account best practices](https://docs.cloud.google.com/resource-manager/docs/super-admin-best-practices)

### Microsoft Azure
7. [What is Azure role-based access control (Azure RBAC)?](https://learn.microsoft.com/en-us/azure/role-based-access-control/overview)
8. [Best practices for Azure RBAC](https://learn.microsoft.com/en-us/azure/role-based-access-control/best-practices)

### Stripe
9. [Single sign-on (SSO) | Stripe Documentation](https://docs.stripe.com/get-started/account/sso)
10. [Authentication | Stripe API Reference](https://docs.stripe.com/api/authentication)

### Vercel
11. [Vercel Authentication](https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication)
12. [Access Control](https://vercel.com/docs/security/access-control)
