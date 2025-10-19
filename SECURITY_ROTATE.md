Security credential rotation runbook

This document explains how to rotate the Mongo Atlas user password and the JWT secret used by the backend.

1) Rotate Mongo Atlas user password

- Log into MongoDB Atlas, go to Database Access, find the user used by this app (from `config/.env`).
- Create a new strong password and update the user record.
- Test connection locally by updating `config/.env` with the new URI (or set `MONGO_URI` env var) and restarting the backend.
- Update the CI / deployment secrets with the new `MONGO_URI`.
- Revoke any old credentials if the app or CI no longer needs them.

Example Atlas: update connection string

	# new password: choose a strong password
	NEW_PW='S3cureP@ssw0rd!'
	# If your user is 'appuser' and cluster is cluster0.xvke8l
	# new URI:
	MONGO_URI='mongodb+srv://appuser:${NEW_PW}@cluster0.xvke8l.mongodb.net/throttleops?retryWrites=true&w=majority'

Update `config/.env` or the environment variable store with the new `MONGO_URI`.

2) Rotate JWT secret

- Generate a new long, random secret (recommended: 32+ bytes base64 or hex).
- Update `config/.env` locally with the new `JWT_SECRET` and restart the backend.
- Update CI and deploy-time environment variables with the new secret.
- Note: Rotating the JWT secret will invalidate all existing JWTs (users will need to re-login).

3) After rotation

- Verify the app can connect to Mongo and users can login.
- Ensure old credentials are removed from any backup or other systems.

4) Emergency: compromised credentials

- Immediately rotate the credentials and investigate access logs in Atlas.
- Consider rotating other related credentials and secrets.

5) Add reminders

- Add a calendar reminder to rotate sensitive secrets periodically (every 3-6 months).

6) Quick JWT secret rotate (example)

	# generate a 32-byte hex secret
	node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

Place the generated string into `JWT_SECRET` in `config/.env`, restart the backend, and update CI/deployment secrets.

Note: rotating the JWT secret invalidates all existing tokens — plan for user re-login.
