var EVENTS = {
    CLICK: 'click',
    FUSING: 'fusing',
    MOUSEENTER: 'mouseenter',
    MOUSEDOWN: 'mousedown',
    MOUSELEAVE: 'mouseleave',
    MOUSEUP: 'mouseup'
};

var STATES = {
    FUSING: 'cursor-fusing',
    HOVERING: 'cursor-hovering',
    HOVERED: 'cursor-hovered'
};

var bind = AFRAME.utils.bind;

/* global AFRAME */
if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Sticky Cursor
 */
AFRAME.registerComponent('sticky-cursor', {
    dependencies: ['raycaster'],

    schema: {
        fuse: {
            default: AFRAME.utils.device.isMobile()
        },
        fuseTimeout: {
            default: 1500,
            min: 0
        },
        hoverDistance: {
          default: 0.05
        },
        cursorId: {
          default: "#cursor"
        }
    },

    init: function() {
        var cameraEl = this.el;
        var cursorEl = document.querySelector(this.data.cursorId)
        var canvas = cursorEl.sceneEl.canvas;
        this.fuseTimeout = undefined;
        this.mouseDownEl = null;
        this.intersection = null;
        this.intersectedEl = null;

        // Wait for canvas to load.
        if (!canvas) {
            cursorEl.sceneEl.addEventListener('render-target-loaded', bind(this.init, this));
            return;
        }

        // Attach event listeners.
        canvas.addEventListener('mousedown', bind(this.onMouseDown, this));
        canvas.addEventListener('mouseup', bind(this.onMouseUp, this));
        cameraEl.addEventListener('raycaster-intersection', bind(this.onIntersection, this));
        cameraEl.addEventListener('raycaster-intersection-cleared', bind(this.onIntersectionCleared, this));
    },

    /**
	 * Trigger mousedown and keep track of the mousedowned entity.
	 */
    onMouseDown: function(evt) {
        this.twoWayEmit(EVENTS.MOUSEDOWN);
        this.mouseDownEl = this.intersectedEl;
    },

    /**
	 * Trigger mouseup if:
	 * - Not fusing (mobile has no mouse).
	 * - Currently intersecting an entity.
	 * - Currently-intersected entity is the same as the one when mousedown was triggered,
	 *   in case user mousedowned one entity, dragged to another, and mouseupped.
	 */
    onMouseUp: function(evt) {
        this.twoWayEmit(EVENTS.MOUSEUP);
        if (this.data.fuse || !this.intersectedEl || this.mouseDownEl !== this.intersectedEl) {
            return;
        }
        this.twoWayEmit(EVENTS.CLICK);
    },

    /**
	 * Handle intersection.
	 */
    onIntersection: function(evt) {
        var self = this;
        var cursorEl = document.querySelector(this.data.cursorId)
        var data = this.data;

        // Select closest object, excluding the cursor.
        var index = evt.detail.els[0] === cursorEl
            ? 1
            : 0;
        var intersection = evt.detail.intersections[index];
        var intersectedEl = evt.detail.els[index];

        // If cursor is the only intersected object, ignore the event.
        if (!intersectedEl) {
            return;
        }

        // Make it Sticky.
        var mat = intersection.object.matrixWorld;
        mat.setPosition(new THREE.Vector3(0, 0, 0));
        var global_normal = intersection.face.normal.clone().applyMatrix4(mat).normalize();
        var lookAtTarget = new THREE.Vector3().addVectors(intersection.point.clone(), global_normal);
        cursorEl.object3D.lookAt(lookAtTarget);
        var cursorPosition = new THREE.Vector3().addVectors(intersection.point, global_normal.multiplyScalar(data.hoverDistance));
        cursorEl.setAttribute("position", cursorPosition.clone());

        // Already intersecting this entity.
        if (this.intersectedEl === intersectedEl) {
            this.intersection = intersection;
            return;
        }

        // Unset current intersection.
        if (this.intersectedEl) {
            this.clearCurrentIntersection();
        }

        // Set new intersection.
        this.intersection = intersection;
        this.intersectedEl = intersectedEl;

        // Hovering.
        cursorEl.addState(STATES.HOVERING);
        intersectedEl.addState(STATES.HOVERED);
        self.twoWayEmit(EVENTS.MOUSEENTER);

        // Begin fuse if necessary.
        if (data.fuseTimeout === 0 || !data.fuse) {
            return;
        }
        cursorEl.addState(STATES.FUSING);
        this.twoWayEmit(EVENTS.FUSING);
        this.fuseTimeout = setTimeout(function fuse() {
            cursorEl.removeState(STATES.FUSING);
            self.twoWayEmit(EVENTS.CLICK);
        }, data.fuseTimeout);

    },

    /**
	 * Handle intersection cleared.
	 */
    onIntersectionCleared: function(evt) {
        var cursorEl = document.querySelector(this.data.cursorId)
        var intersectedEl = evt.detail.el;

        // Ignore the cursor.
        if (cursorEl === intersectedEl) {
            return;
        }

        // Ignore if the event didn't occur on the current intersection.
        if (intersectedEl !== this.intersectedEl) {
            return;
        }

        this.clearCurrentIntersection();
    },

    clearCurrentIntersection: function() {
        var cursorEl = document.querySelector(this.data.cursorId)
        // No longer hovering (or fusing).
        this.intersectedEl.removeState(STATES.HOVERED);
        cursorEl.removeState(STATES.HOVERING);
        cursorEl.removeState(STATES.FUSING);
        this.twoWayEmit(EVENTS.MOUSELEAVE);

        // Unset intersected entity (after emitting the event).
        this.intersection = null;
        this.intersectedEl = null;

        // Clear fuseTimeout.
        clearTimeout(this.fuseTimeout);
    },

    /**
	 * Helper to emit on both the cursor and the intersected entity (if exists).
	 */
    twoWayEmit: function(evtName) {
        var el = document.querySelector(this.data.cursorId)
        var intersectedEl = this.intersectedEl;
        var intersection = this.intersection;
        el.emit(evtName, {
            intersectedEl: intersectedEl,
            intersection: intersection
        });
        if (!intersectedEl) {
            return;
        }
        intersectedEl.emit(evtName, {
            cursorEl: el,
            intersection: intersection
        });
    },

    // getNearestIntersection: function (intersections, cursorElement) {
    //     var l = intersections.length;
    //     for (var i = 0; i < l; i++) {
    //         // ignore cursor itself to avoid flicker && ignore "ignore-ray" class
    //         if (cursorElement === intersections[i].object.el || intersections[i].object.el.classList.contains("ignore-ray")) {continue;}
    //         return intersections[i];
    //     }
    //     return null;
    // }

});
