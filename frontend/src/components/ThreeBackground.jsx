import { useRef, useEffect } from 'react'
import * as THREE from 'three'

export default function ThreeBackground() {
    const mountRef = useRef(null)

    useEffect(() => {
        const mount = mountRef.current
        if (!mount) return

        // Scene setup
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 1000)
        camera.position.z = 30

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(mount.clientWidth, mount.clientHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setClearColor(0x000000, 0)
        mount.appendChild(renderer.domElement)

        // Particles
        const particleCount = 120
        const positions = new Float32Array(particleCount * 3)
        const colors = new Float32Array(particleCount * 3)

        const palette = [
            new THREE.Color(0x6366f1),
            new THREE.Color(0x818cf8),
            new THREE.Color(0x0ea5e9),
            new THREE.Color(0x8b5cf6),
            new THREE.Color(0x06b6d4),
        ]

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 80
            positions[i * 3 + 1] = (Math.random() - 0.5) * 60
            positions[i * 3 + 2] = (Math.random() - 0.5) * 40
            const c = palette[Math.floor(Math.random() * palette.length)]
            colors[i * 3] = c.r
            colors[i * 3 + 1] = c.g
            colors[i * 3 + 2] = c.b
        }

        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

        const material = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            sizeAttenuation: true,
        })

        const particles = new THREE.Points(geometry, material)
        scene.add(particles)

        // Floating geometric shapes
        const shapes = []
        const shapeGeometries = [
            new THREE.IcosahedronGeometry(1.2, 0),
            new THREE.OctahedronGeometry(1, 0),
            new THREE.TetrahedronGeometry(1.4, 0),
        ]

        for (let i = 0; i < 6; i++) {
            const geo = shapeGeometries[i % 3]
            const mat = new THREE.MeshBasicMaterial({
                color: palette[i % palette.length],
                wireframe: true,
                transparent: true,
                opacity: 0.1,
            })
            const mesh = new THREE.Mesh(geo, mat)
            mesh.position.set(
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 20
            )
            mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
            shapes.push({ mesh, speed: 0.002 + Math.random() * 0.003 })
            scene.add(mesh)
        }

        // Mouse effect
        let mouseX = 0, mouseY = 0
        const onMouseMove = (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2
            mouseY = -(e.clientY / window.innerHeight - 0.5) * 2
        }
        window.addEventListener('mousemove', onMouseMove)

        // Resize handler
        const onResize = () => {
            camera.aspect = mount.clientWidth / mount.clientHeight
            camera.updateProjectionMatrix()
            renderer.setSize(mount.clientWidth, mount.clientHeight)
        }
        window.addEventListener('resize', onResize)

        // Animation loop
        let animId
        const clock = new THREE.Clock()
        const animate = () => {
            animId = requestAnimationFrame(animate)
            const t = clock.getElapsedTime()

            particles.rotation.y = t * 0.03
            particles.rotation.x = t * 0.015

            shapes.forEach(({ mesh, speed }, i) => {
                mesh.rotation.x += speed
                mesh.rotation.y += speed * 0.7
                mesh.position.y += Math.sin(t + i) * 0.005
            })

            camera.position.x += (mouseX * 3 - camera.position.x) * 0.02
            camera.position.y += (mouseY * 2 - camera.position.y) * 0.02
            camera.lookAt(scene.position)

            renderer.render(scene, camera)
        }
        animate()

        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('resize', onResize)
            mount.removeChild(renderer.domElement)
            renderer.dispose()
        }
    }, [])

    return (
        <div
            ref={mountRef}
            style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
            }}
        />
    )
}
