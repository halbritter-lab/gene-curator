#!/usr/bin/env python3
"""
Comprehensive linting script for Gene Curator backend.

This script runs all linting tools in the correct order and provides
a unified interface for code quality checks.
"""

import subprocess
import sys
from pathlib import Path
from typing import List, Optional


def run_command(cmd: List[str], description: str) -> bool:
    """Run a command and return True if successful."""
    print(f"🔍 {description}...")
    try:
        result = subprocess.run(
            cmd, 
            cwd=Path(__file__).parent.parent,
            capture_output=True, 
            text=True, 
            check=False
        )
        
        if result.returncode == 0:
            print(f"✅ {description} passed")
            if result.stdout.strip():
                print(f"   Output: {result.stdout.strip()}")
            return True
        else:
            print(f"❌ {description} failed")
            if result.stdout.strip():
                print(f"   stdout: {result.stdout.strip()}")
            if result.stderr.strip():
                print(f"   stderr: {result.stderr.strip()}")
            return False
            
    except FileNotFoundError:
        print(f"❌ {description} failed - command not found: {' '.join(cmd)}")
        return False


def main() -> int:
    """Run all linting checks."""
    print("🚀 Starting Gene Curator Backend Linting Suite")
    print("=" * 60)
    
    checks = [
        (["poetry", "check"], "Poetry configuration check"),
        (["ruff", "check", "app/"], "Ruff linting"),
        (["ruff", "format", "--check", "app/"], "Ruff formatting check"),
        (["mypy", "app/"], "MyPy type checking"),
        (["bandit", "-r", "app/", "-f", "json"], "Bandit security check"),
    ]
    
    failed_checks = []
    
    for cmd, description in checks:
        if not run_command(cmd, description):
            failed_checks.append(description)
    
    print("\n" + "=" * 60)
    
    if failed_checks:
        print(f"❌ {len(failed_checks)} check(s) failed:")
        for check in failed_checks:
            print(f"   - {check}")
        print("\n💡 Run individual tools to see detailed error messages:")
        print("   - poetry check")
        print("   - ruff check app/ tests/")
        print("   - ruff format --diff app/ tests/")
        print("   - mypy app/")
        print("   - bandit -r app/")
        return 1
    else:
        print("✅ All linting checks passed!")
        return 0


if __name__ == "__main__":
    sys.exit(main())