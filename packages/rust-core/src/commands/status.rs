use anyhow::{Context, Result};
use std::process::Command;

pub async fn execute() -> Result<()> {
    let output = Command::new("git")
        .args(["status", "--short", "--branch"])
        .output()
        .context("failed to execute git; install Git and run this command inside a repository")?;
    if !output.status.success() {
        anyhow::bail!(
            "git status failed: {}",
            String::from_utf8_lossy(&output.stderr).trim()
        );
    }
    print!("{}", String::from_utf8_lossy(&output.stdout));
    Ok(())
}
