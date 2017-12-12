# Dotfiles

## Overview

This repo is my dotfiles.

## Using this repo

You don't. [Dotfiles Are Not Meant to Be Forked](http://www.anishathalye.com/2014/08/03/managing-your-dotfiles/).

But, if you do:

    $ xcode-select --install
    $ git clone --recursive git@github.com:vitorcarvalhoml/dotfiles.git ~/.dotfiles
    $ cd .dotfiles
    $ ./install

Remeber to create a tokens file into your home directory. The content is private, so I'm not put it here.

```
export HOMEBREW_GITHUB_API_TOKEN=<api-key>
```
