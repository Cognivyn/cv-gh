use clap::Subcommand;

pub mod commands;

#[derive(Subcommand)]
pub enum Commands {
    Init(commands::init::InitArgs),
    Pr(commands::pr::PrArgs),
    Release(commands::release::ReleaseArgs),
    Doctor,
    Status,
    // Add more...
}

pub async fn run(command: Commands) -> anyhow::Result<()> {
    match command {
        Commands::Init(args) => commands::init::execute(args).await,
        Commands::Pr(args) => commands::pr::execute(args).await,
        Commands::Release(args) => commands::release::execute(args).await,
        Commands::Doctor => commands::doctor::execute().await,
        _ => todo!(),
    }
}