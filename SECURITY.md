# Security Policy

## 🛡️ Supported Versions

We actively support the following versions of Morpion Otaku Battle:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | ✅ Fully supported |
| < 1.0   | ❌ Not supported   |

## 🚨 Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please report it responsibly.

### 📧 How to Report

1. **DO NOT** create a public GitHub issue for security vulnerabilities
2. **Email us directly** at: [security@yourproject.com] or create a private security advisory
3. **Use GitHub Security Advisories**: Go to the Security tab → Report a vulnerability

### 📋 What to Include

Please include the following information in your report:

- **Description** of the vulnerability
- **Steps to reproduce** the issue
- **Potential impact** of the vulnerability
- **Suggested fix** (if you have one)
- **Your contact information** for follow-up

### ⏱️ Response Timeline

- **Initial Response**: Within 48 hours
- **Detailed Analysis**: Within 1 week
- **Fix Development**: Depends on severity
- **Public Disclosure**: After fix is deployed

### 🎁 Recognition

Security researchers who responsibly disclose vulnerabilities will be:
- Credited in our SECURITY.md file (with permission)
- Thanked in release notes
- Given priority support for future issues

## 🔒 Security Best Practices

### For Users
- Always download from official GitHub releases
- Keep your Python dependencies updated
- Use HTTPS when accessing the web version
- Don't run the server on public networks without proper security

### For Contributors
- Validate all user inputs
- Use secure coding practices
- Test for common vulnerabilities (XSS, injection, etc.)
- Follow the principle of least privilege

## 🛠️ Security Measures in Place

- **Input Validation**: All user inputs are validated
- **CORS Protection**: Configured for development use
- **Dependency Scanning**: Automated security checks via GitHub Actions
- **Code Review**: All contributions are reviewed before merging

## 📞 Contact

For general security questions or concerns:
- Create an issue with the `security` label
- Email: [security@yourproject.com]
- Discord: [Your Discord Server]

Thank you for helping keep Morpion Otaku Battle secure! 🙏