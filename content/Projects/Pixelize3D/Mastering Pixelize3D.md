---
tags:
  - pixelart
  - godot4
  - blender
date: 2023-10-19
---

# Prerequisites
- Download and Install Blender - [link](https://www.blender.org/download/)
- Download and Install Godot - [steam](https://store.steampowered.com/app/404790/Godot_Engine/) - [standalone](https://godotengine.org/download/windows/)
- Download the Pixelize3D project locally - [git link](https://github.com/GianiStatie/pixelize3d)
- (Optional) Check the video tutorial to be able to follow along - [link](https://www.youtube.com/watch?v=ez4lOfKzFbA)

# Usage

## Step 1 - Download the 3D model
The 3D model can be downloaded from one of the links provided in the references. 

If you choose a model from outside Mixamo, you will need to rig it using the Mixamo "upload character". That way you will add bones to your 3D mesh and make sure the Mixamo animations are supported.

## Step 2 - Downloading animations
Based on what game genre you want to make, you can download any number of animations from Mixamo as individual `.fbx` files.

## Step 3 - Merging the animations in Blender
There is a process documented in the references and in the video that I've uploaded that takes you step-by-step through the process of adding all animations to a single 3D model. 

After adding all animations to your mode, you have to export your model as a `.glb` file.

**Observation:** In case your animations are not "in place", you will need to download a blender extension named `In Placer` (link in references).
## Step 4 - Rendering the 3D model
You will need to replace the already existing model from the Godot project with the exported model  (the `.glb` file). 

Check the `SubViewport` node to see whether the 3D model is centered. You may have to scale and rotate the model in order to fit your needs.

**Observation**: Due to my lack of shader knowledge, you will need to make due with the greenscreen. In case your sprite also contains tints of green, you can change the screen color in the `WorldEnvironment` node.

To generate the spritesheet you just need to run the project.

## Step 5 - Tweaking the spritesheet
Now it's your time to let your artistic juices flow. You can import your spritesheet in your sprite-editor of choice (mine is Aseprite) and tweak the frames to your liking.

# References
## Where to find 3D models
- Sketchfab - [link](https://sketchfab.com)
- Mixamo - [link](https://www.mixamo.com/)

## Rigging and animating your model
- Mixamo.com - [link](www.mixamo.com)

## Exporting animations to Godot
- Making a animation library in Blender - [YT-link](https://www.youtube.com/watch?v=cetPEHgmATA)
- Making animations in place in Blender - [YT-link](https://www.youtube.com/watch?v=le7exScwwrQ)- [addon](https://fatihpehlevan.gumroad.com/l/InPlacer)

## Pixelating 3D models
- Godot 4: 3D Pixel Art - [YT-link](https://www.youtube.com/watch?v=Mg_V27arKdg)
- Godot 4 pixelart shader - [Git-link](https://github.com/leopeltola/Godot-3d-pixelart-demo)
- Godot 4 limiting color space - [link](https://ask.godotengine.org/142965/limit-games-color-palette)
- [Bugfix] Canvas textures are blurry - [Git-link](https://github.com/godotengine/godot/issues/66764)

