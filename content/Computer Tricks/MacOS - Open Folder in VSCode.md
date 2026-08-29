## Intro

When you install VSCode on MacOS you won't get the "Open Folder with" option. Instead, you'll need to create a **automation** where you add the functionality yourself to MacOS.

![[mac-vscode-000.png | 300]]

There's also this short video on [YouTube](https://www.youtube.com/watch?v=dcjevVMhpoM) showing the process.

## Step 1 - Open the Automator App

![[mac-vscode-001.png | 500]]

Press **⌘ + Space** (Command Key + Space Key) and type in **automator**. Then open the **Automator** app.

## Step 2 - Create a Quick Action

![[mac-vscode-002.png | 500]]
Once the **Automator** app has opened select **Quick Action**.

## Step 3 - Search and Select Action Type

![[mac-vscode-003.png | 500]]
In the Actions Search Window look for **Open Finder Items** then double click it to select.

## Step 4 - Change the Default Application

![[mac-vscode-004.png | 500]]
In the righthand side, where the window just got updated, beneath **Open Finder Items** change the Open with: Default Application by replacing the **Default Application** with **Visual Studio Code**.

> [!Observation]
> If VSCode does not appear in the list you'll need to:
>
> - scroll to the bottom of the list
> - press Other...
> - scroll again to the bottom of the Applications list
> - select Visual Studio Code

## Step 5 - Save Automation

Once you've completed Step 4 you can now save your automation by pressing **⌘ + S** (Command Key + S Key). The name that you'll give to your Automation will be the name that appears when you'll right-click a folder.
