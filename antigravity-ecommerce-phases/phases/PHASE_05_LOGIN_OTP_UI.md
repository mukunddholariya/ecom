# Phase 05 — Login UI with Mock Email/Phone OTP

Read `MASTER_CONTEXT.md` first.

## Goal

Build a convincing login experience that demonstrates both phone OTP and email OTP without sending real messages or claiming real authentication.

## Required flow

1. Login page offers two methods:
   - phone number
   - email address
2. Validate input on the client with appropriate friendly messages.
3. User requests an OTP. Show a clear demo message that no SMS/email is actually sent.
4. Display an OTP entry state. For local development, use a documented fixed demo OTP or a mock verification function. Do not use a real OTP delivery service.
5. Allow the user to return and change the phone/email value.
6. Handle incorrect OTP, empty input, resend cooldown UI if included, and successful mock verification.
7. On success, create a clearly marked mock session with only the minimum demo identity data required.
8. Support logout and logged-in navigation state.
9. Keep browsing and cart usage available without login.
10. If cart items exist before mock login, preserve them; do not clear cart on login.

## Security and honesty rules

- Do not connect a real provider or backend.
- Never say an OTP was sent. Use wording such as “Demo mode: use the test code shown on this page.”
- Do not log OTPs or store OTPs in localStorage.
- Do not collect passwords or payment-card details.
- Do not use real people's email addresses or phone numbers in fixtures.
- Clearly label the mock session as prototype behavior in code comments or developer documentation.
- Do not treat this client-only demo as production authentication.

## UX requirements

- Accessible labels, focus handling, clear validation errors, and loading/disabled states.
- Responsive form layout.
- Support both email and phone without duplicating the entire page unnecessarily.
- After successful mock login, return to the intended page when practical; otherwise go to the account page.
- Use the existing form validation approach if the project already has one.

## Acceptance checklist

- Both phone and email paths can be demonstrated.
- Invalid input and wrong code show helpful errors.
- Successful mock verification updates UI state.
- Logout resets the mock session.
- Cart remains intact.
- UI clearly states that OTP delivery and identity verification are simulated.
- No real auth provider is added.

## Final report

Describe the mock OTP contract/code, session persistence behavior, route protection (if any), and checks actually run.
