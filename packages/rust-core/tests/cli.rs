use std::process::Command;

fn binary() -> Command {
    Command::new(env!("CARGO_BIN_EXE_cv-gh"))
}

#[test]
fn help_lists_supported_commands() {
    let output = binary().arg("--help").output().unwrap();
    assert!(output.status.success());
    let stdout = String::from_utf8_lossy(&output.stdout);
    assert!(stdout.contains("init"));
    assert!(stdout.contains("doctor"));
    assert!(stdout.contains("status"));
}

#[test]
fn init_creates_config() {
    let directory = tempfile::tempdir().unwrap();
    let output = binary()
        .args(["init", "--path", directory.path().to_str().unwrap()])
        .output()
        .unwrap();
    assert!(output.status.success());
    assert!(directory.path().join(".cv-gh.toml").exists());
}
