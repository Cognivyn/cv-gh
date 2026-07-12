use clap::Parser;
mod cli;
mod commands;

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: cli::Commands,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    cli::run(Cli::parse().command).await
}
