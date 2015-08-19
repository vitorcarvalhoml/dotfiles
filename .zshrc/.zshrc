# Path to your oh-my-zsh installation.
export ZSH=/Users/Lucazz/.oh-my-zsh

# Set name of the theme to load.
ZSH_THEME="gianu"

# Uncomment the following line to use hyphen-insensitive completion. Case
# sensitive completion must be off. _ and - will be interchangeable.
HYPHEN_INSENSITIVE="true"

# Uncomment the following line to enable command auto-correction.
ENABLE_CORRECTION="false"

# Loading plugins
plugins=(aws vagrant colored-man)

# User configuration
source $ZSH/oh-my-zsh.sh > /dev/null 2>&1
#env vars
source ~/.dotfiles/.env/.env.zsh > /dev/null 2>&1
#aliases
source ~/.dotfiles/.alias/.alias.zsh > /dev/null 2>&1
#functions
source ~/.dotfiles/.functions/.extract.zsh > /dev/null 2>&1
#awscli
source /usr/local/share/zsh/site-functions/_aws > /dev/null 2>&1
complete -C aws_completer aws > /dev/null 2>&1
