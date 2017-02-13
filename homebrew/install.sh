#!/bin/sh
#
# Homebrew
#
# This installs some of the common dependencies needed (or at least desired)
# using Homebrew.
echo "homebrew scripts"
# Ask for the administrator password upfront.
sudo -v

# Check for Homebrew
if test ! $(which brew)
then
  echo "  Installing Homebrew for you."
  ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
fi

# Keep-alive: update existing `sudo` time stamp until the script has finished.
while true; do sudo -n true; sleep 60; kill -0 "$$" || exit; done 2>/dev/null &

# Make sure we’re using the latest Homebrew.
brew update

# Upgrade any already-installed formulae.
brew upgrade --all

# Taping brew repos
brew tap homebrew/versions
brew tap caskroom/versions

# Install more recent versions of some OS X tools.
brew install vim --with-override-system-vi
brew install python
brew install homebrew/dupes/openssh
brew install homebrew/dupes/screen
brew install homebrew/dupes/grep

# Install `wget` with IRI support.
brew install wget --with-iri

# Install useful tools 
brew install curl htop ssh-copy-id aria2 httpie nmap \
youtube-dl p7zip tree findutils speedtest_cli \
keybase pwgen uncrustify git git-lfs git-flow \
packer terraform awscli ansible

# Install homebrew cask
brew tap caskroom/cask
brew install brew-cask
brew cask install alfred
brew cask install docker
brew cask install evernote
brew cask install firefox 
brew cask install google-drive
brew cask install gpgtools
brew cask install little-snitch

brew cask install flux
brew cask install macpass
brew cask install osxfuse
brew cask install screenhero
brew cask install slack
brew cask install sublime-text
brew cask install spectacle

brew cask install telegram-desktop
brew cask install tunnelblick
brew cask install the-unarchiver
brew cask install transmission
brew cask install virtualbox
brew cask install vagrant
brew cask install vlc
brew cask install whatsapp

# Remove outdated versions from the cellar.
brew cleanup

exit 0
