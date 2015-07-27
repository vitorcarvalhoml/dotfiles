echo ".zshrc scripts"

# Path to your oh-my-zsh installation.
export ZSH=/Users/Lucazz/.oh-my-zsh

# Set name of the theme to load.
ZSH_THEME="gianu"

# Uncomment the following line to use hyphen-insensitive completion. Case
# sensitive completion must be off. _ and - will be interchangeable.
HYPHEN_INSENSITIVE="true"

# Uncomment the following line to enable command auto-correction.
ENABLE_CORRECTION="true"

# Loading plugins
plugins=(aws vagrant colored-man)

# User configuration
source $ZSH/oh-my-zsh.sh
#env vars
source .env/.env.zsh
#aliases
source .alias/.alias.zsh
#functions
source .functions/.extract.zsh
#awscli
source /usr/local/share/zsh/site-functions/_aws
complete -C aws_completer aws
