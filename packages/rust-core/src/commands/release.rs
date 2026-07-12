use anyhow::{Context, Result};
use clap::Args;
use std::process::Command;

#[derive(Args, Debug)]
pub struct ReleaseArgs {
    pub tag: String,
    #[arg(long)]
    pub title: Option<String>,
    #[arg(long)]
    pub notes: Option<String>,
}

pub async fn execute(args: ReleaseArgs) -> Result<()> {
    let mut command = Command::new("gh");
    command.args(["release", "create", &args.tag]);
    if let Some(title) = args.title {
        command.args(["--title", &title]);
    }
    if let Some(notes) = args.notes {
        command.args(["--notes", &notes]);
    }
    let status = command
        .status()
        .context("GitHub CLI (gh) is required for `cv-gh release`")?;
    if !status.success() {
        anyhow::bail!("gh release create failed with {}", status);
    }
    Ok(())
}
