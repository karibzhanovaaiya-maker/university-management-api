# Reproducible toolchain for this project.
# Run `nix-shell` in the project root to get Java 17 + Maven on PATH.
{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.jdk17
    pkgs.maven
  ];

  shellHook = ''
    export JAVA_HOME=${pkgs.jdk17}
    echo "JDK: $(java -version 2>&1 | head -1)"
    echo "Maven: $(mvn -version 2>&1 | head -1)"
  '';
}
