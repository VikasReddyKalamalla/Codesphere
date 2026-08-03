#!/bin/bash
set -e

echo "Starting CodeSphere Cloud Workspace container..."

# Create workspace directory if it doesn't exist
mkdir -p /home/coder/workspace

# Configure VS Code settings for seamless experience
mkdir -p /home/coder/.local/share/code-server/User
cat << 'EOF' > /home/coder/.local/share/code-server/User/settings.json
{
  "workbench.colorTheme": "Default Dark Modern",
  "editor.fontSize": 14,
  "editor.tabSize": 2,
  "editor.wordWrap": "on",
  "editor.minimap.enabled": true,
  "editor.formatOnSave": true,
  "terminal.integrated.defaultProfile.linux": "bash",
  "telemetry.telemetryLevel": "off",
  "update.mode": "off"
}
EOF

# Start code-server binding to 0.0.0.0:8080 without auth (isolated per container)
exec code-server \
  --bind-addr 0.0.0.0:8080 \
  --auth none \
  --disable-telemetry \
  --disable-update-check \
  /home/coder/workspace
