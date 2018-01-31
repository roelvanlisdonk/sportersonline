
# Notes
# This app is created on Windows 10 with Visual Studio Code.
# Chocolately is used to install some development tooling like:
# - node.js
# - npm
# - git

# Check versions
node -v
npm -version

# Check for outdated pacackages in current repository
npm outdated

# Check for outdated pacackages globaly
npm outdated -g --depth=0

# Update tooling
nuget update -self
choco upgrade chocolatey -y
choco upgrade nodejs -y
choco upgrade git -y
npm update -g

# Update local repository packages
npm install