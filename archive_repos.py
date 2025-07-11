#!/usr/bin/env python3
"""
Archive GitHub repositories using the GitHub API
"""
import subprocess
import json
import sys

# Repositories to archive
repos_to_archive = [
    "Cal_backend_May13",
    "mg-dashboard", 
    "mg-dashboard-deploy",
    "Dashboard_May10"
]

def archive_repo_via_gh_api(owner, repo):
    """Archive a repository using gh api command"""
    print(f"\nArchiving {repo}...")
    
    # First, close any open issues if it's Dashboard_May10
    if repo == "Dashboard_May10":
        print(f"  Closing open issues in {repo}...")
        close_cmd = [
            "gh", "api", "--method", "PATCH",
            f"/repos/{owner}/{repo}/issues/1",
            "-f", "state=closed",
            "-f", "state_reason=not_planned"
        ]
        try:
            subprocess.run(close_cmd, capture_output=True, text=True)
            print(f"  ✓ Closed issue #1")
        except:
            print(f"  - No open issues or already closed")
    
    # Archive the repository
    cmd = [
        "gh", "api", "--method", "PATCH",
        f"/repos/{owner}/{repo}",
        "-f", "archived=true"
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"  ✅ Successfully archived {repo}")
            return True
        else:
            print(f"  ❌ Failed to archive {repo}")
            print(f"     Error: {result.stderr}")
            return False
    except Exception as e:
        print(f"  ❌ Error archiving {repo}: {e}")
        return False

def main():
    print("GitHub Repository Archive Tool")
    print("==============================")
    print(f"Will archive {len(repos_to_archive)} repositories:")
    for repo in repos_to_archive:
        print(f"  - {repo}")
    
    # Test gh cli availability
    try:
        test_result = subprocess.run(["gh", "auth", "status"], capture_output=True, text=True)
        if test_result.returncode != 0:
            print("\n❌ GitHub CLI not authenticated. Please run: gh auth login")
            return 1
    except:
        print("\n❌ GitHub CLI not found. Please install gh")
        return 1
    
    print("\nStarting archive process...")
    
    success_count = 0
    for repo in repos_to_archive:
        if archive_repo_via_gh_api("dvanosdol88", repo):
            success_count += 1
    
    print(f"\n{'='*50}")
    print(f"Archive complete: {success_count}/{len(repos_to_archive)} repositories archived")
    
    if success_count == len(repos_to_archive):
        print("\n✅ All repositories successfully archived!")
        print("\nArchived repositories:")
        print("- Are read-only (no new commits/issues/PRs)")
        print("- Show 'Archived' badge on GitHub")
        print("- Are hidden from your main repository list")
        print("- Can be unarchived anytime if needed")
    else:
        print("\n⚠️  Some repositories could not be archived.")
        print("Check the errors above and try again.")
    
    return 0 if success_count == len(repos_to_archive) else 1

if __name__ == "__main__":
    sys.exit(main())