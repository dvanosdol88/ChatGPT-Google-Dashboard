#!/bin/bash

echo "GitHub Repository Archive Script"
echo "================================"
echo ""
echo "This script will archive the following repositories:"
echo "1. Cal_backend_May13 - Dormant since May 13"
echo "2. mg-dashboard - Experimental version"
echo "3. mg-dashboard-deploy - Related to experimental version"
echo "4. Dashboard_May10 - Superseded by ChatGPT-Google-Dashboard"
echo ""

# First, close the open issue in Dashboard_May10
echo "Closing open issue in Dashboard_May10..."
gh issue close 1 -R dvanosdol88/Dashboard_May10 -c "Archiving repository - functionality moved to ChatGPT-Google-Dashboard" || echo "Issue may already be closed"

echo ""
echo "Archiving repositories..."
echo ""

# Archive each repository
echo "1. Archiving Cal_backend_May13..."
gh repo archive dvanosdol88/Cal_backend_May13 --yes
echo "✓ Cal_backend_May13 archived"

echo ""
echo "2. Archiving mg-dashboard..."
gh repo archive dvanosdol88/mg-dashboard --yes
echo "✓ mg-dashboard archived"

echo ""
echo "3. Archiving mg-dashboard-deploy..."
gh repo archive dvanosdol88/mg-dashboard-deploy --yes
echo "✓ mg-dashboard-deploy archived"

echo ""
echo "4. Archiving Dashboard_May10..."
gh repo archive dvanosdol88/Dashboard_May10 --yes
echo "✓ Dashboard_May10 archived"

echo ""
echo "================================"
echo "Archive complete!"
echo ""
echo "Archived repositories will:"
echo "- Be read-only (no new commits/issues/PRs)"
echo "- Show 'Archived' badge on GitHub"
echo "- Be hidden from your main repository list"
echo "- Remain accessible and can be unarchived anytime"
echo ""
echo "Your active dashboard repositories are:"
echo "- ChatGPT-Google-Dashboard (main production)"
echo "- calendar-backend (useful Google integration code)"
echo "- designs-personal-dashboard (UI designs)"
echo "- tech-leadership-dashboard (professional dashboard)"