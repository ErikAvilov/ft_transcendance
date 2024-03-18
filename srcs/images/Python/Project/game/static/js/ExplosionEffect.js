import * as THREE from 'three';

class ExplosionEffect {
    constructor(scene) {
        this.particleGroup = new THREE.Group();
        scene.add(this.particleGroup);

        for (let i = 0; i < 500; i++) {
            const particleGeometry = new THREE.SphereGeometry(2, 32, 32);
            const particleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            this.particleGroup.add(particle);
            particleMaterial.color.offsetHSL(0.003, 0, 0);
        }

    }

    explode(position) {
        this.particleGroup.position.copy(position);
        this.particleGroup.children.forEach(particle => {
            particle.visible = true;
            particle.position.set(0, 0, 0);
            // Set a random direction for each particle
            particle.userData.direction = new THREE.Vector3(
                Math.random() - 0.5,
                Math.random() - 0.5,
                Math.random() - 0.5
            ).normalize();
        });
    }

    update(time, currentColor) {
        const speed = 3; 
        const fadeRate = 0.001;

        this.particleGroup.children.forEach(particle => { 
            if (particle.visible) { 
                if (particle.userData.direction) {
                    particle.position.add(particle.userData.direction.clone().multiplyScalar(speed));
                }
                particle.material.opacity -= time * fadeRate;
                particle.material.color = currentColor;
                if (particle.material.opacity <= 0) {
                    particle.visible = false;
                    particle.material.opacity = 1;
                }
            }
        });
    }
}

export default ExplosionEffect;
