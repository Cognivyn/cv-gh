use anyhow::Result;

pub async fn execute() -> Result<()> {
    println!("cv-gh doctor");
    println!("- Rust CLI: available");
    println!("- Git: {}", command_available("git"));
    println!(
        "- GitHub token: {}",
        if std::env::var_os("GITHUB_TOKEN").is_some() {
            "configured"
        } else {
            "not configured"
        }
    );
    Ok(())
}

fn command_available(command: &str) -> &'static str {
    if std::process::Command::new(command)
        .arg("--version")
        .output()
        .is_ok()
    {
        "available"
    } else {
        "not available"
    }
}
