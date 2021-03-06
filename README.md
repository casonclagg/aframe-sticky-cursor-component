# Sticky Cursor

An A-Frame component to move cursor along object's surface.

**[DEMO PAGE (link)](https://casonclagg.github.io/aframe-sticky-cursor-component/)**

![DEMO](demo.gif)

[Demo Video on Gfycat](https://gfycat.com/EasygoingUnluckyAuk)

## API

| Property          | Description                                              | Default Value |
| ----------------- | -------------------------------------------------------- | ------------- |
| fuse              | Trigger 'click' event after staring at something         | true          |
| fuseTimeout       | Time required staring until click event triggered        | 1000          |
| cursorId          | id of the cursor                                         | #cursor       |
| hoverDistance     | distance to hover cursor above normal face (in meters)   | 0             |

## Usage

    <!-- Camera and Cursor Setup -->
    <a-entity id="cursor" scale="0.02 0.02 0.02" geometry="primitive: sphere" material="side: double; color: yellow; shader: flat">
        <a-animation begin="cursor-fusing" dur="1500" easing="ease-in" attribute="material.color" fill="forwards" from="#FFF" to="#F00"></a-animation>
        <a-animation begin="click" dur="1" easing="ease-in" attribute="material.color" fill="backwards" from="#F00" to="#FFF"></a-animation>
    </a-entity>
    <!-- Attach Raycaster and sticky-cursor to camera (because thats where the ray gets casts from) -->
    <!-- TODO - Allow connecting to controllers. -->
    <a-camera raycaster sticky-cursor="fuse: true; fuseTimeout: 1500; cursorId: #cursor; hoverDistance: 0;"></a-camera>

## Installation

### browser

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.4.0/aframe.min.js"></script>
  <script src="https://cdn.rawgit.com/casonclagg/aframe-sticky-cursor-component/master/dist/aframe-sticky-cursor-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity id="cursor" scale="0.02 0.02 0.02" geometry="primitive: sphere" material="side: double; color: yellow; shader: flat">
        <a-animation begin="cursor-fusing" dur="1500" easing="ease-in" attribute="material.color" fill="forwards" from="#FFF" to="#F00"></a-animation>
        <a-animation begin="click" dur="1" easing="ease-in" attribute="material.color" fill="backwards" from="#F00" to="#FFF"></a-animation>
    </a-entity>
    <a-camera raycaster sticky-cursor="fuse: true; fuseTimeout: 1500; cursorId: #cursor; hoverDistance: 0;"></a-camera>
  </a-scene>
</body>
```

### npm
Install via npm:

`$npm install aframe-sticky-cursor-component`

Then register and use.

```javascript
require('aframe');
require('aframe-sticky-cursor-component');
```

### Shoutouts

This component is basically a mashup of the [aframe's 0.4.0 cursor component](https://github.com/aframevr/aframe/blob/master/src/components/cursor.js) and [Jun Ito's Crawling Cursor Component](https://github.com/jujunjun110/aframe-crawling-cursor)

Van gogh Room by ruslans3d is licensed under CC Attribution

Vincent van Gogh too.

## TODO

#### rotation is weird on flat surface

Use model cursor demo, look straight down onto the floor and walk forward, strafe and move the view around slowly.  Rotation is weird.

Relevant? https://github.com/mrdoob/three.js/issues/1486
