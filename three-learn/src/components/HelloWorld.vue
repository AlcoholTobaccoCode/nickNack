
<template>
  <div>
    <div id="container" />
    <div class="controls-box">
      <section>
        <el-row>
          <el-col :span="8" class="label-col">
            <label>passType</label>
          </el-col>
          <el-col :span="16">
            <el-select v-model="properties.passType" placeholder="请选择" @change="updateProperties">
              <el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-checkbox v-model="properties.isRotate">
            是否旋转
          </el-checkbox>
        </el-row>
        <el-row v-if="properties.passType=='filmPass'">
          <el-checkbox v-model="properties.grayscale">
            grayscale
          </el-checkbox>
        </el-row>
        <el-row v-if="properties.passType=='glitchPass'">
          <el-checkbox v-model="properties.goWild">
            goWild
          </el-checkbox>
        </el-row>
        <el-row>
          <div v-for="(item,key) in properties" :key="key">
            <div v-if="item&&item.name!=undefined&&(item.type === properties.passType)">
              <el-col :span="8">
                <span class="vertice-span">{{ item.name }}</span>
              </el-col>
              <el-col :span="13">
                <el-slider v-model="item.value" :min="item.min" :max="item.max" :step="item.step" :format-tooltip="formatTooltip" @change="updateProperties" />
              </el-col>
              <el-col :span="3">
                <span class="vertice-span">{{ item.value }}</span>
              </el-col>
            </div>
          </div>
        </el-row>
      </section>
    </div>
  </div>
</template>


<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js'
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass.js'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'

export default {
  data() {
    return {
      selectOptions: [
        {
          value: 'none',
          label: 'none'
        },
        {
          value: 'filmPass',
          label: 'filmPass'
        },
        {
          value: 'dotScreenPass',
          label: 'dotScreenPass'
        },
        {
          value: 'glitchPass',
          label: 'glitchPass'
        }
      ],
      properties: {
        scanlinesIntensity: {
          name: 'scanlinesIntensity',
          type: 'filmPass',
          value: 0.28,
          min: 0,
          max: 1,
          step: 0.01
        },
        noiseIntensity: {
          name: 'noiseIntensity',
          type: 'filmPass',
          value: 0.9,
          min: 0,
          max: 3,
          step: 0.01
        },
        scanlinesCount: {
          name: 'scanlinesCount',
          type: 'filmPass',
          value: 208,
          min: 0,
          max: 2048,
          step: 1
        },

        centerX: {
          name: 'centerX',
          type: 'dotScreenPass',
          value: 0.5,
          min: 0,
          max: 1,
          step: 0.1
        },
        centerY: {
          name: 'centerY',
          type: 'dotScreenPass',
          value: 0.5,
          min: 0,
          max: 1,
          step: 0.1
        },
        angle: {
          name: 'angle',
          type: 'dotScreenPass',
          value: 1.57,
          min: 0,
          max: Math.PI,
          step: 0.1
        },
        scale: {
          name: 'scale',
          type: 'dotScreenPass',
          value: 0.5,
          min: 0,
          max: 1,
          step: 0.1
        },
        isRotate: true,
        grayscale: true,
        goWild: false,
        passType: 'none'
      },
      earchMesh: null,
      camera: null,
      scene: null,
      renderer: null,
      orbitControls: null,
      clock: null,
      composer: null,
      filmPass: null,
      dotScreenPass: null,
      glitchPass: null
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    formatTooltip(val) {
      return val
    },
    // 初始化
    init() {
      this.createScene() // 创建场景
      this.createModels() // 创建模型
      this.createLight() // 创建光源
      this.createCamera() // 创建相机
      this.createRender() // 创建渲染器
      this.createControls() // 创建控件对象
      this.createComposer()
      this.render() // 渲染
    },
    // 创建场景
    createScene() {
      this.scene = new THREE.Scene()
    },

    // 创建模型
    createModels() {
      const publicPath = process.env.BASE_URL
      const planetTexture = new THREE.TextureLoader().load(
        `${publicPath}textures/planets/Earth.png`
      )
      const specularTexture = new THREE.TextureLoader().load(
        `${publicPath}textures/planets/EarthSpec.png`
      )
      const normalTexture = new THREE.TextureLoader().load(
        `${publicPath}textures/planets/EarthNormal.png`
      )

      const planetMaterial = new THREE.MeshPhongMaterial()
      planetMaterial.specularMap = specularTexture
      planetMaterial.specular = new THREE.Color(0x4444aa)
      // planetMaterial.shininess = 2

      planetMaterial.normalMap = normalTexture
      planetMaterial.map = planetTexture
      // planetMaterial.shininess = 150
      const sphereGeom = new THREE.SphereGeometry(10, 40, 40)
      this.earchMesh = new THREE.Mesh(sphereGeom, planetMaterial)

      this.scene.add(this.earchMesh)
    },

    // 创建光源
    createLight() {
      // 环境光
      const ambientLight = new THREE.AmbientLight(0x686868) // 创建环境光
      this.scene.add(ambientLight) // 将环境光添加到场景
      // 平行光
      const directionLight = new THREE.DirectionalLight(0xffffff)
      directionLight.position.set(10, 50, 50)
      directionLight.intensity = 0.2
      this.scene.add(directionLight)
    },
    // 创建相机
    createCamera() {
      const element = document.getElementById('container')
      const width = element.clientWidth // 窗口宽度
      const height = element.clientHeight // 窗口高度
      const k = width / height // 窗口宽高比
      // PerspectiveCamera( fov, aspect, near, far )
      this.camera = new THREE.PerspectiveCamera(45, k, 0.1, 1000)
      this.camera.position.set(-10, 20, 30) // 设置相机位置

      this.camera.lookAt(new THREE.Vector3(0, 0, 0)) // 设置相机方向
      this.scene.add(this.camera)
    },
    // 创建渲染器
    createRender() {
      const element = document.getElementById('container')
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      this.renderer.setSize(element.clientWidth, element.clientHeight) // 设置渲染区域尺寸
      this.renderer.shadowMap.enabled = true // 显示阴影
      // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
      this.renderer.setClearColor(0x000000, 1) // 设置背景颜色
      element.appendChild(this.renderer.domElement)
    },

    createComposer() {
      //使用场景和相机创建RenderPass通道
      const renderPass = new RenderPass(this.scene, this.camera)

      //创建FilmPass通道
      this.filmPass = new FilmPass(0.8, 0.325, 256, false)
      this.filmPass.renderToScreen = true
      this.filmPass.enabled = false

      //创建DotScreenPass通道
      this.dotScreenPass = new DotScreenPass()
      this.dotScreenPass.enabled = false

      //创建GlitchPass通道
      this.glitchPass = new GlitchPass(64)
      this.glitchPass.enabled = false

      //创建效果组合器
      this.composer = new EffectComposer(this.renderer)

      //将创建的通道添加到EffectComposer对象中
      this.composer.addPass(renderPass)
      this.composer.addPass(this.filmPass)
      this.composer.addPass(this.dotScreenPass)
      this.composer.addPass(this.glitchPass)
    },
    updateProperties() {
      // 除了第一个renderPass外全部启用关闭
      for (let i = 1; i < this.composer.passes.length; i++) {
        this.composer.passes[i].enabled = false
      }

      switch (this.properties.passType) {
        case 'filmPass': {
          this.composer.passes[1].enabled = true
          this.filmPass.uniforms.grayscale.value = this.properties.grayscale
          this.filmPass.uniforms.nIntensity.value = this.properties.noiseIntensity.value
          this.filmPass.uniforms.sIntensity.value = this.properties.scanlinesIntensity.value
          this.filmPass.uniforms.sCount.value = this.properties.scanlinesCount.value

          break
        }
        case 'dotScreenPass': {
          this.composer.passes[2].enabled = true
          this.dotScreenPass.uniforms.center.value.set(
            this.properties.centerX.value,
            this.properties.centerY.value
          )
          this.dotScreenPass.uniforms.angle.value = this.properties.angle.value
          this.dotScreenPass.uniforms.scale.value = this.properties.scale.value
          break
        }

        case 'glitchPass': {
          this.composer.passes[3].enabled = true
          this.glitchPass.goWild = this.properties.goWild
          break
        }
      }
    },

    render() {
      const delta = this.clock.getDelta() // 获取自上次调用的时间差
      this.orbitControls.update(delta) // 相机控制更新
      if (this.properties.isRotate) {
        this.earchMesh.rotation.y += 0.003
      }

      this.updateProperties() //通道切换与参数更新处理

      this.renderer.render(this.scene, this.camera)
      /********** 更新效果组合器一定要在渲染器更新后，否则通道无法产生效果************/
      this.composer.render(delta) //效果组合器更新

      requestAnimationFrame(this.render)
    },
    // 创建控件对象
    createControls() {
      this.clock = new THREE.Clock() // 创建THREE.Clock对象，用于计算上次调用经过的时间
      this.orbitControls = new OrbitControls(
        this.camera,
        this.renderer.domElement
      )
    }
  }
}
</script>

<style>
#container {
  position: absolute;
  width: 100%;
  height: 100%;
}
.controls-box {
  position: absolute;
  right: 5px;
  top: 5px;
  width: 400px;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #c3c3c3;
}
.label-col {
  padding: 8px 5px;
}

.vertice-span {
  line-height: 38px;
  padding: 0 2px 0 10px;
}
</style>

