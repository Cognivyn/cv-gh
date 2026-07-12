use anyhow::{Context, Result};
use clap::Args;
use std::fs;
use std::path::PathBuf;

#[derive(Args, Debug)]
pub struct InitArgs {
    #[arg(long, default_value = ".")]
    pub path: PathBuf,
}

pub async fn execute(args: InitArgs) -> Result<()> {
    let root = args
        .path
        .canonicalize()
        .with_context(|| format!("cannot access {}", args.path.display()))?;
    let config = root.join(".cv-gh.toml");
    if config.exists() {
        println!("{} already exists", config.display());
        return Ok(());
    }
    fs::write(&config, "# cv-gh configuration\n")
        .with_context(|| format!("cannot create {}", config.display()))?;
    println!("Created {}", config.display());
    Ok(())
}
