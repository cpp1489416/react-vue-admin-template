<template>
  <div class="app-container">
    this is a demo of tree.js
    <canvas ref="tree" width="500" height="500"/>
    <el-button @click="repaint">repaint</el-button>
    <el-button @click="paintGl">paintGL</el-button>
  </div>
</template>

<script>
import vertex_shader_source from '@/assets/shaders/vshader.glsl'
import fragment_shader_source from '@/assets/shaders/fshader.glsl'
import * as THREE from 'three'
import Camera from '../../utils/gl/common/Camera'
import BasicTechnique from '../../utils/gl/techniques/BasicTechnique'
import Cube from '../../utils/gl/things/Cube'
import CubeMapNX from '@/assets/textures/CubeMapNX.png'
import SyncImage from '@/utils/gl/tools/SyncImage'
import Texture2DTechnique from '../../utils/gl/techniques/Texture2DTechnique'
import Quad from '../../utils/gl/things/Quad'

export default {
  data () {
    return {
      canvas: null,
      camera: null,
      quad: null,
      technique: null,
      gl: null,
      now: 1
    }
  },
  watch: {
    filterText (val) {
    }
  },
  mounted () {
    var canvas = this.$refs.tree
    this.canvas = canvas
    this.$nextTick(function () {
      setInterval(this.timePass, 100)
    })
  },

  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    repaint: async function () {
      // 获取canvas元素
      // 获取绘制二维上下文
      var gl = this.canvas.getContext('webgl2')
      this.gl = gl
      if (!gl) {
        console.log('Failed')
        return
      }
      await this.initGl()
      await this.paintGl()
    },

    initGl: async function () {
      this.camera = new Camera(this.gl)
      this.camera.lookAt(new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0))
      this.camera.perspective(-5, 5, 5, -5, -30, 500)

      this.quad = new Quad(this.gl)

      this.technique = new Texture2DTechnique(this.gl)
      this.technique.create()

      this.technique.addComponent(this.camera)
      this.technique.addComponent(this.quad)

      this.gl.clearColor(0, 0.5, 0, 1)
      this.gl.enable(this.gl.DEPTH_TEST)
      // this.gl.depthFunc(this.gl.LESS)
      // this.gl.depthMask(this.gl.TRUE)
      // this.gl.enable(this.gl.DEPTH_CLAMP)
    },

    paintGl: function () {
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
      this.technique.drawThings()
    },

    timePass: function () {
      return
      if (this.quad !== null) {
        this.quad.transform.rotation = new THREE.Vector3(this.now, this.now, this.now)
        this.now += 0.1
        this.paintGl()
      }
    }
  }
}
</script>
