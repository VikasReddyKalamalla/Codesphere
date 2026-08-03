FROM ubuntu:22.04

# Avoid prompt during installations
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=UTC

# Install core utilities, compilers, and language runtimes
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    build-essential \
    gcc \
    g++ \
    gdb \
    clangd \
    openjdk-17-jdk \
    python3 \
    python3-pip \
    python3-venv \
    php-cli \
    golang-go \
    unzip \
    tar \
    sudo \
    net-tools \
    iputils-ping \
    tmux \
    && rm -rf /var/lib/apt/lists/*

# Install Rust & rust-analyzer
ENV RUSTUP_HOME=/usr/local/rustup \
    CARGO_HOME=/usr/local/cargo \
    PATH=/usr/local/cargo/bin:$PATH
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain stable --no-modify-path \
    && chmod -R a+w $RUSTUP_HOME $CARGO_HOME \
    && rustup component add rust-analyzer || true

# Install Node.js (v20), npm, and Python LSP (pyright)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g yarn pnpm nodemon pyright

# Install code-server
RUN curl -fsSL https://code-server.dev/install.sh | sh

# Pre-install curated extensions into code-server
RUN code-server --install-extension esbenp.prettier-vscode || true \
    && code-server --install-extension dbaeumer.vscode-eslint || true \
    && code-server --install-extension pkief.material-icon-theme || true

# Setup non-root coder user
RUN useradd -m -s /bin/bash coder \
    && echo "coder ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/coder \
    && chmod 0440 /etc/sudoers.d/coder

# Create workspace directory
RUN mkdir -p /home/coder/workspace \
    && chown -R coder:coder /home/coder

WORKDIR /home/coder/workspace

# Copy entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

USER coder

EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
