echo ".env scripts"
BASEDIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd )"
export NPM_PACKAGES="${HOME}/.npm-packages"
export NODE_PATH="$NPM_PACKAGES/lib/node_modules:$NODE_PATH"
export LATEX_PATH=/usr/local/texlive/2015/bin/x86_64-darwin
export HOMEBREW_GITHUB_API_TOKEN="87c13c747adc00ade971a611e83588f7ae9be260"

export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$NPM_PACKAGES/bin:$LATEX_PATH:"
export PATH="./bin:/usr/local/bin:/usr/local/sbin:$ZSH/bin:$PATH"
export MANPATH="/usr/local/man:/usr/local/mysql/man:/usr/local/git/man:$MANPATH"
export VAGRANT_DEFAULT_PROVIDER=virtualbox
export LANG=en_US.UTF-8
export LSCOLORS="Gxfxcxdxbxegedabagacad"
