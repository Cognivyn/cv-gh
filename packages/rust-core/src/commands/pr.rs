use anyhow::{Context, Result};
use clap::Args;
use std::process::Command;

#[derive(Args, Debug)]
pub struct PrArgs {
    #[arg(long)]
    pub title: Option<String>,
    #[arg(long)]
    pub body: Option<String>,
    #[arg(long)]
    pub draft: bool,
}

pub async fn execute(args: PrArgs) -> Result<()> {
    let mut command = Command::new("gh");
    command.arg("pr").arg("create");
    if let Some(title) = args.title {
        command.args(["--title", &title]);
    }
    if let Some(body) = args.body {
        command.args(["--body", &body]);
    }
    if args.draft {
        command.arg("--draft");
    }
    let status = command
        .status()
        .context("GitHub CLI (gh) is required for `cv-gh pr`")?;
    if !status.success() {
        anyhow::bail!("gh pr create failed with {}", status);
    }
    Ok(())
}
