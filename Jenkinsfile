pipeline {
    agent {
        docker {
            image 'node:16'
            args '-u root'
        }
    }

    environment {
        REGISTRY = 'ghcr.io'
        IMAGE_NAME = 'victorandres123/frontend-restaurante-smash_order'
        CREDENTIAL_ID = 'ghcr-credentials'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        stage('Validate Branch') {
            steps {
                script {
                    def currentBranch = env.BRANCH_NAME ?: env.GIT_BRANCH?.replaceAll('origin/', '')
                    
                    echo "Rama actual: ${currentBranch}"
                    
                    // Definir patrones de ramas permitidas
                    def allowedPatterns = [
                        'develop',
                        'main',
                        'quality',
                        'release',
                        ~/^dev\/HU-\d+$/,
                        ~/^dev\/CHU-\d+$/,
                        ~/^qa\/HU-\d+$/,
                        ~/^release\.\d+\.\d+\.\d+$/
                    ]
                    
                    def isAllowed = allowedPatterns.any { pattern ->
                        if (pattern instanceof String) {
                            return currentBranch == pattern
                        } else {
                            return currentBranch ==~ pattern
                        }
                    }
                    
                    if (!isAllowed) {
                        error("Pipeline solo se ejecuta en ramas permitidas. Rama actual: ${currentBranch}")
                    }
                    
                    echo "✓ Rama ${currentBranch} es válida para el pipeline"
                }
            }
        }

        stage('Checkout') {
            steps {
                script {
                    echo 'Obteniendo código del repositorio...'
                    checkout scm
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    echo 'Instalando dependencias...'
                    sh '''
                        node --version
                        npm --version
                        npm ci
                    '''
                }
            }
        }

        stage('Lint') {
            steps {
                script {
                    echo 'Ejecutando linter...'
                    sh 'npm run lint || true'
                }
            }
        }

        stage('Build Application') {
            steps {
                script {
                    def currentBranch = env.BRANCH_NAME ?: env.GIT_BRANCH?.replaceAll('origin/', '')
                    echo "Construyendo aplicación para la rama: ${currentBranch}..."
                    sh 'npm run build'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    def currentBranch = env.BRANCH_NAME ?: env.GIT_BRANCH?.replaceAll('origin/', '')
                    def branchTag = currentBranch.replaceAll('/', '-')
                    def shortCommit = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    def fullImageName = "${env.REGISTRY}/${env.IMAGE_NAME}"
                    def imageTag = "${branchTag}-${shortCommit}-${env.BUILD_NUMBER}"
                    
                    echo "Construyendo imagen Docker: ${fullImageName}:${imageTag}..."
                    
                    try {
                        // Verificar Docker
                        sh 'docker --version'
                        
                        // Construir imagen
                        sh "docker build -t ${fullImageName}:${imageTag} ."
                        
                        // Tags adicionales
                        sh "docker tag ${fullImageName}:${imageTag} ${fullImageName}:${branchTag}"
                        sh "docker tag ${fullImageName}:${imageTag} ${fullImageName}:${shortCommit}"
                        
                        // Si es rama principal, también tagear como latest
                        if (currentBranch == 'main' || currentBranch == 'develop' || currentBranch == 'quality') {
                            sh "docker tag ${fullImageName}:${imageTag} ${fullImageName}:latest"
                            echo "✓ También etiquetado como latest"
                        }
                        
                        echo "✓ Imagen Docker construida exitosamente: ${fullImageName}:${imageTag}"
                        
                        // Guardar variables para otros stages
                        env.DOCKER_IMAGE_TAG = imageTag
                        env.DOCKER_SHORT_COMMIT = shortCommit
                        env.DOCKER_BRANCH_TAG = branchTag
                        env.DOCKER_FULL_IMAGE = fullImageName
                        
                    } catch (err) {
                        echo "✗ Error al construir imagen Docker: ${err}"
                        currentBuild.result = 'FAILURE'
                        error("Fallo en la construcción de imagen Docker")
                    }
                }
            }
        }

        stage('Push to Registry') {
            when {
                expression {
                    def currentBranch = env.BRANCH_NAME ?: env.GIT_BRANCH?.replaceAll('origin/', '')
                    return currentBranch == 'main' || currentBranch == 'develop' || currentBranch == 'quality'
                }
            }
            steps {
                script {
                    echo "Subiendo imagen a ${env.REGISTRY}..."
                    
                    try {
                        // Login a GitHub Container Registry
                        withCredentials([usernamePassword(
                            credentialsId: env.CREDENTIAL_ID,
                            usernameVariable: 'REGISTRY_USER',
                            passwordVariable: 'REGISTRY_TOKEN'
                        )]) {
                            sh "echo \$REGISTRY_TOKEN | docker login ${env.REGISTRY} -u \$REGISTRY_USER --password-stdin"
                        }
                        
                        // Push todas las versiones
                        sh "docker push ${env.DOCKER_FULL_IMAGE}:${env.DOCKER_IMAGE_TAG}"
                        sh "docker push ${env.DOCKER_FULL_IMAGE}:${env.DOCKER_BRANCH_TAG}"
                        sh "docker push ${env.DOCKER_FULL_IMAGE}:${env.DOCKER_SHORT_COMMIT}"
                        sh "docker push ${env.DOCKER_FULL_IMAGE}:latest"
                        
                        echo "✓ Imagen subida exitosamente al registry"
                        
                    } catch (err) {
                        echo "✗ Error al subir imagen: ${err}"
                        currentBuild.result = 'FAILURE'
                        error("Fallo al subir imagen al registry")
                    } finally {
                        // Logout
                        sh "docker logout ${env.REGISTRY} || true"
                    }
                }
            }
        }

        stage('Deploy Info') {
            steps {
                script {
                    def currentBranch = env.BRANCH_NAME ?: env.GIT_BRANCH?.replaceAll('origin/', '')
                    def branchTag = currentBranch.replaceAll('/', '-')
                    
                    echo """
                    ========================================
                    BUILD COMPLETADO EXITOSAMENTE
                    ========================================
                    Rama: ${currentBranch}
                    Build: #${env.BUILD_NUMBER}
                    Commit: ${env.DOCKER_SHORT_COMMIT ?: 'N/A'}
                    Imagen Docker: ${env.DOCKER_FULL_IMAGE}:${env.DOCKER_IMAGE_TAG ?: branchTag}
                    Registry: ${env.REGISTRY}
                    ========================================
                    """
                    
                    // Información específica por rama
                    if (currentBranch == 'develop') {
                        echo 'Entorno: DESARROLLO'
                        echo 'Imagen disponible en registry para desarrollo'
                    } else if (currentBranch == 'quality') {
                        echo 'Entorno: CALIDAD/QA'
                        echo 'Imagen disponible en registry para QA'
                    } else if (currentBranch == 'main') {
                        echo 'Entorno: PRODUCCIÓN'
                        echo 'Imagen disponible en registry para producción'
                    } else if (currentBranch.startsWith('dev/')) {
                        echo 'Entorno: DESARROLLO - Feature Branch'
                        echo 'Imagen construida localmente (no publicada en registry)'
                    } else if (currentBranch.startsWith('qa/')) {
                        echo 'Entorno: QA - Testing Branch'
                        echo 'Imagen construida localmente (no publicada en registry)'
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                echo 'Limpiando imágenes Docker locales...'
                sh """
                    docker rmi ${env.DOCKER_FULL_IMAGE}:${env.DOCKER_IMAGE_TAG} || true
                    docker rmi ${env.DOCKER_FULL_IMAGE}:${env.DOCKER_BRANCH_TAG} || true
                    docker rmi ${env.DOCKER_FULL_IMAGE}:${env.DOCKER_SHORT_COMMIT} || true
                    docker rmi ${env.DOCKER_FULL_IMAGE}:latest || true
                """ 
            }
        }
        success {
            echo '✓ Pipeline ejecutado exitosamente'
        }
        failure {
            echo '✗ Pipeline falló'
        }
        cleanup {
            echo 'Limpiando workspace...'
            cleanWs()
        }
    }
}