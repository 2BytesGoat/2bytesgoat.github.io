## Intro

I often need to switch between two GitHub accounts:

- my personal account - where I work on projects in my free time
- my work account - where I have access to private repositories from work

This tutorial shows how I made my setup such that I can easily switch between the two on the same PC.

> [!Warning] Disclaimer
> This workflow uses ssh-keys and does not cover other approaches such as using GPG keys or the Github Desktop App.

This workflow should also work for GitLab or Bitbucket.

This workflow is required only if you have two accounts for the same provider and you want to switch between them.

## Step 1 - Generating the SSH Keys

You'll need to generate two ssh keys:

- one for account A (personal account - in my case)
- one for account B (work account - in my case)

You can generate your ssh keys by running the command

```bash
ssh-keygen
```

You'll be then prompted with a bunch of steps that require you to name your key and add a optional password.

I recommend you choose representative names for your ssh-keys such that it's easier to keep track of (i.e. id-personal and id-work).

> [!Note]
> Be wary of the path where your ssh keys get generated. We're gonna need the contents of the public ssh key and the the parent folder location of the .ssh folder in the following steps.

## Step 2 - Create the .gitconfig file

Next, we'll need to tell git when and were to use each key. In order to do that we'll create a `.gitconfig` file one folder above the location of our `.ssh` folder.

Inside the file you'll need to add the following lines:

```text
[user]
	name = GIT-USER-NAME                    # default username for this PC
	email = GIT-EMAIL                       # default email for this PC
[includeIf "gitdir:PATH-TO-WORK-FOLDER"]    # path to the work folder
    path = ~/.gitconfig-work
[includeIf "gitdir:PATH-TO-PERSONAL-FOLDER"]# path to personal folder
    path = ~/.gitconfig-personal

[filter "lfs"]
	clean = git-lfs clean -- %f
	smudge = git-lfs smudge -- %f
	process = git-lfs filter-process
	required = true

```

Make sure to fill in the capitalized variables above with your own information from your Git account.

In the next step we'll create the other two files we'll need to complete the local setup.

## Step 3 - Adding helper files

In the steps above we've referenced `.gitconfig-work` and `.gitconfig-personal`. These two files contain the credential that Git will automatically switch between when inside the WORK-FOLDER or PERSONAL-FOLDER

In the same folder that we've created the `.gitconfig` file, we'll need to create the other two mentioned above. Let's start with `.gitconfig-work`.

```
[core]
	# replace id-work with the path you got when generating the ssh-key
	sshCommand = ssh -i ~/.ssh/id-work -F /dev/null
[user]
	name = GIT-WORK-USER-NAME
	email = GIT-WORK-EMAIL
```

The same thing should be done for the `.gitconfig-personal` file

```
[core]
	# replace id-personal with the path you got when generating the ssh-key
	sshCommand = ssh -i ~/.ssh/id-personal -F /dev/null
[user]
	name = GIT-PERSONAL-USER-NAME
	email = GIT-PERSONAL-EMAIL
```

## Step 4 - Add the SSH Keys to Git

The final step is to add each ssh key that we just generated on your corresponding Github account.

You can checkout [this link](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account) for further details.

## Step 5 - Testing

In order to check that the setup is working accordingly, you'll need to clone a **private repository** inside each of your designated work/personal folder. You'll know it worked if a repo which is available only for one user can be cloned via ssh to one folder **but not both**.
