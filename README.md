# Vote Page (React + D3 + AWS Serverless)

This scaffold gives you:

- Frontend SPA: React + D3 (Vite)
- Shared data persistence: AWS API Gateway + Lambda + DynamoDB
- Hosting model: frontend on GitHub Pages, backend on AWS free tier

## Architecture

- `frontend/`: UI with a vote form and D3 bar chart
- `backend/`: AWS SAM stack with:
  - `GET /votes` to fetch current totals
  - `POST /vote` to increment a selected option
  - DynamoDB table for shared vote counts

## Prerequisites

- Node.js 18+
- AWS CLI configured (`aws configure`)
- AWS SAM CLI installed

## 1) Run frontend locally

```bash
cd frontend
npm install
cp .env.example .env
# edit .env and set VITE_API_BASE_URL after backend deploy
npm run dev
```

## 2) Deploy backend (AWS)

```bash
cd backend
npm install
sam build -t template.yaml
sam deploy --guided -t template.yaml
```

During guided deploy:

- Stack Name: `vote-page`
- Region: your preferred region
- Confirm changes: `Y`
- Allow SAM IAM role creation: `Y`
- Save arguments to samconfig: `Y`

After deployment, copy output `ApiBaseUrl` and set it in:

- `frontend/.env` as `VITE_API_BASE_URL=<ApiBaseUrl>`

Then restart the frontend dev server.

## 3) Build frontend for GitHub Pages

```bash
cd frontend
npm run build
```

Deploy `frontend/dist` to GitHub Pages using your preferred workflow (GitHub Actions is easiest).

## 4) Automated deploys with GitHub Actions (recommended)

This repo includes:

- `.github/workflows/deploy-backend.yml`: Deploys SAM stack to AWS using OIDC
- `.github/workflows/deploy-frontend.yml`: Builds and deploys `frontend/dist` to GitHub Pages

### Required GitHub repo settings

Add these repository variables:

- `AWS_REGION` (example: `us-east-1`)
- `SAM_STACK_NAME` (example: `vote-page`)

Add this repository secret:

- `AWS_DEPLOY_ROLE_ARN` (IAM role ARN that GitHub Actions can assume)

The backend workflow updates repo variable `VITE_API_BASE_URL` automatically from CloudFormation output `ApiBaseUrl`.

### AWS OIDC role setup

1. Create OIDC identity provider in AWS IAM:
   - Provider URL: `https://token.actions.githubusercontent.com`
   - Audience: `sts.amazonaws.com`
2. Create an IAM role trusted by that provider.
3. Restrict trust policy to your repo/branch (example below).
4. Attach permissions for CloudFormation, Lambda, API Gateway, IAM pass role, S3 artifact bucket access, and DynamoDB stack resources.

Example trust policy (replace `OWNER/REPO`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:OWNER/REPO:ref:refs/heads/main"
        }
      }
    }
  ]
}
```

### Trigger behavior

- Backend deploy runs on pushes affecting `backend/**` and manual trigger.
- Frontend deploy runs on pushes affecting `frontend/**` and manual trigger.

If you want frontend deploy after every backend deploy, run frontend workflow manually or add a workflow dependency in a follow-up.

## Notes on free tier

- DynamoDB uses on-demand billing; very low traffic usually stays in free tier.
- Lambda + API Gateway also have free monthly quotas that fit small projects.

## API contract

### GET `/votes`

Response:

```json
{
  "votes": [
    { "option": "Cats", "count": 3 },
    { "option": "Dogs", "count": 1 }
  ]
}
```

### POST `/vote`

Request:

```json
{
  "option": "Cats"
}
```

Response:

```json
{
  "votes": [
    { "option": "Cats", "count": 4 },
    { "option": "Dogs", "count": 1 }
  ]
}
```
